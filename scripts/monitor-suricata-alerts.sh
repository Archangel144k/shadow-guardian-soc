#!/bin/bash

# Shadow Guardian SOC - Suricata Alert Monitor
# Real-time monitoring script for Suricata IPS alerts

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Log files
FAST_LOG="/var/log/suricata/fast.log"
EVE_LOG="/var/log/suricata/eve.json"
STATS_LOG="/var/log/suricata/stats.log"

# Function to display header
show_header() {
    clear
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}    Shadow Guardian SOC - Suricata IPS Alert Monitor           ${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}Timestamp: $(date)${NC}"
    echo -e "${CYAN}Monitoring Interface: enp0s20f0u4${NC}"
    echo
}

# Check if Suricata is running
check_suricata_status() {
    if ! pgrep -f suricata > /dev/null; then
        echo -e "${RED}ERROR: Suricata is not running!${NC}"
        echo "Start Suricata with: sudo suricata -c /home/ghost/projects/shadow-guardian-soc/configs/suricata/suricata.yaml --af-packet=enp0s20f0u4 -D"
        exit 1
    fi
    
    local pid_count=$(pgrep -f suricata | wc -l)
    echo -e "${GREEN}✓ Suricata Status: RUNNING (${pid_count} processes)${NC}"
}

# Display real-time statistics
show_statistics() {
    echo -e "${YELLOW}Real-time Statistics:${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [[ -f "$EVE_LOG" ]]; then
        # Count different event types from the last minute
        local alerts_count=$(tail -n 1000 "$EVE_LOG" 2>/dev/null | jq -r 'select(.event_type=="alert") | .timestamp' 2>/dev/null | wc -l)
        local drops_count=$(tail -n 1000 "$EVE_LOG" 2>/dev/null | jq -r 'select(.event_type=="drop") | .timestamp' 2>/dev/null | wc -l)
        local flows_count=$(tail -n 1000 "$EVE_LOG" 2>/dev/null | jq -r 'select(.event_type=="flow") | .timestamp' 2>/dev/null | wc -l)
        local dns_count=$(tail -n 1000 "$EVE_LOG" 2>/dev/null | jq -r 'select(.event_type=="dns") | .timestamp' 2>/dev/null | wc -l)
        local http_count=$(tail -n 1000 "$EVE_LOG" 2>/dev/null | jq -r 'select(.event_type=="http") | .timestamp' 2>/dev/null | wc -l)
        
        echo -e "Alerts detected:     ${RED}${alerts_count}${NC}"
        echo -e "Packets dropped:     ${RED}${drops_count}${NC}"
        echo -e "Flows monitored:     ${GREEN}${flows_count}${NC}"
        echo -e "DNS queries:         ${CYAN}${dns_count}${NC}"
        echo -e "HTTP requests:       ${CYAN}${http_count}${NC}"
    else
        echo -e "${YELLOW}No eve.json log file found${NC}"
    fi
    
    # System performance
    local load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | tr -d ',')
    local mem_usage=$(free | grep Mem | awk '{printf("%.1f", $3/$2 * 100.0)}')
    local disk_usage=$(df /var/log | tail -1 | awk '{print $5}' | tr -d '%')
    
    echo
    echo -e "System Load:         ${BLUE}${load_avg}${NC}"
    echo -e "Memory Usage:        ${BLUE}${mem_usage}%${NC}"
    echo -e "Log Disk Usage:      ${BLUE}${disk_usage}%${NC}"
}

# Display recent alerts
show_recent_alerts() {
    echo
    echo -e "${YELLOW}Recent Alerts (Last 10):${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [[ -f "$FAST_LOG" ]] && [[ -s "$FAST_LOG" ]]; then
        tail -n 10 "$FAST_LOG" | while read -r line; do
            if [[ ! -z "$line" ]]; then
                echo -e "${RED}ALERT:${NC} $line"
            fi
        done
    else
        echo -e "${GREEN}No alerts detected - System is secure${NC}"
    fi
}

# Display detailed alert information
show_detailed_alerts() {
    echo
    echo -e "${YELLOW}Detailed Alert Analysis:${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [[ -f "$EVE_LOG" ]] && [[ -s "$EVE_LOG" ]]; then
        # Show last 5 alerts with details
        tail -n 500 "$EVE_LOG" 2>/dev/null | jq -r 'select(.event_type=="alert") | "\(.timestamp) | \(.alert.severity) | \(.alert.signature) | \(.src_ip):\(.src_port) -> \(.dest_ip):\(.dest_port)"' 2>/dev/null | tail -5 | while read -r line; do
            if [[ ! -z "$line" ]]; then
                echo -e "${PURPLE}DETAILED:${NC} $line"
            fi
        done
    else
        echo -e "${GREEN}No detailed alerts available${NC}"
    fi
}

# Display top threats
show_top_threats() {
    echo
    echo -e "${YELLOW}Top Threat Sources (Last 24 Hours):${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [[ -f "$EVE_LOG" ]] && [[ -s "$EVE_LOG" ]]; then
        find /var/log/suricata -name "eve.json*" -mtime -1 -exec cat {} \; 2>/dev/null | \
            jq -r 'select(.event_type=="alert") | .src_ip' 2>/dev/null | \
            sort | uniq -c | sort -nr | head -5 | \
            awk '{print "IP: " $2 " - Alert Count: " $1}' | \
            while read -r line; do
                echo -e "${RED}THREAT:${NC} $line"
            done
    else
        echo -e "${GREEN}No threat data available${NC}"
    fi
}

# Live monitoring mode
live_monitor() {
    echo -e "${CYAN}Starting live monitoring mode... Press Ctrl+C to exit${NC}"
    echo
    
    # Monitor fast.log for new alerts
    if [[ -f "$FAST_LOG" ]]; then
        tail -f "$FAST_LOG" | while read -r line; do
            if [[ ! -z "$line" ]]; then
                echo -e "${RED}[$(date '+%H:%M:%S')] ALERT:${NC} $line"
                # Optional: Send desktop notification
                if command -v notify-send &> /dev/null; then
                    notify-send "Suricata Alert" "$line" --urgency=critical
                fi
            fi
        done
    else
        echo -e "${YELLOW}Waiting for alerts... (fast.log will be created when first alert occurs)${NC}"
        while true; do
            if [[ -f "$FAST_LOG" ]] && [[ -s "$FAST_LOG" ]]; then
                echo -e "${RED}[$(date '+%H:%M:%S')] First alert detected!${NC}"
                tail -f "$FAST_LOG" | while read -r line; do
                    if [[ ! -z "$line" ]]; then
                        echo -e "${RED}[$(date '+%H:%M:%S')] ALERT:${NC} $line"
                    fi
                done
                break
            fi
            sleep 2
        done
    fi
}

# Generate alert summary report
generate_report() {
    local report_file="/tmp/suricata_alert_report_$(date +%Y%m%d_%H%M%S).txt"
    
    echo "Generating alert report..."
    
    {
        echo "Shadow Guardian SOC - Suricata Alert Report"
        echo "Generated: $(date)"
        echo "=============================================="
        echo
        
        echo "SUMMARY:"
        if [[ -f "$EVE_LOG" ]]; then
            local total_alerts=$(jq -r 'select(.event_type=="alert")' "$EVE_LOG" 2>/dev/null | wc -l)
            local total_drops=$(jq -r 'select(.event_type=="drop")' "$EVE_LOG" 2>/dev/null | wc -l)
            echo "Total Alerts: $total_alerts"
            echo "Total Drops: $total_drops"
        fi
        echo
        
        echo "RECENT ALERTS:"
        if [[ -f "$FAST_LOG" ]]; then
            tail -n 20 "$FAST_LOG"
        fi
        
    } > "$report_file"
    
    echo -e "${GREEN}Report saved to: $report_file${NC}"
}

# Main menu
show_menu() {
    echo
    echo -e "${CYAN}Choose monitoring mode:${NC}"
    echo "1) Dashboard View (refresh every 5 seconds)"
    echo "2) Live Alert Monitor (real-time)"
    echo "3) Generate Report"
    echo "4) Exit"
    echo
    read -p "Enter choice [1-4]: " choice
    
    case $choice in
        1) dashboard_mode ;;
        2) live_monitor ;;
        3) generate_report ;;
        4) echo "Exiting..."; exit 0 ;;
        *) echo "Invalid choice"; show_menu ;;
    esac
}

# Dashboard mode with auto-refresh
dashboard_mode() {
    while true; do
        show_header
        check_suricata_status
        show_statistics
        show_recent_alerts
        show_detailed_alerts
        show_top_threats
        
        echo
        echo -e "${CYAN}Dashboard auto-refresh in 5 seconds... (Press Ctrl+C to exit)${NC}"
        sleep 5
    done
}

# Main execution
main() {
    # Check if running with appropriate permissions
    if [[ ! -r "/var/log/suricata" ]]; then
        echo -e "${RED}Error: Cannot access Suricata logs. Run with sudo or ensure user has read access.${NC}"
        exit 1
    fi
    
    show_header
    check_suricata_status
    
    # If no arguments, show menu
    if [[ $# -eq 0 ]]; then
        show_menu
    else
        case $1 in
            --live) live_monitor ;;
            --dashboard) dashboard_mode ;;
            --report) generate_report ;;
            --help) 
                echo "Usage: $0 [--live|--dashboard|--report|--help]"
                echo "  --live      : Real-time alert monitoring"
                echo "  --dashboard : Auto-refreshing dashboard"
                echo "  --report    : Generate alert report"
                echo "  --help      : Show this help"
                ;;
            *) echo "Invalid option. Use --help for usage."; exit 1 ;;
        esac
    fi
}

# Run main function
main "$@"
