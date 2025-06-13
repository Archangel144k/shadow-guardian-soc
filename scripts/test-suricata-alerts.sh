#!/bin/bash

# Shadow Guardian SOC - Suricata Alert Test Script
# Safe simulation of attack patterns to test Suricata IPS detection

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    Shadow Guardian SOC - Suricata IPS Test Suite              ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo

# Check if Suricata is running
check_suricata() {
    if ! pgrep -f suricata > /dev/null; then
        echo -e "${RED}❌ ERROR: Suricata is not running!${NC}"
        echo "Start Suricata first with: sudo suricata -c /home/ghost/projects/shadow-guardian-soc/configs/suricata/suricata.yaml --af-packet=enp0s20f0u4 -D"
        exit 1
    fi
    echo -e "${GREEN}✅ Suricata is running and monitoring${NC}"
}

# Test 1: SQL Injection simulation
test_sql_injection() {
    echo -e "${YELLOW}🧪 Test 1: SQL Injection Detection${NC}"
    echo "Simulating SQL injection attack pattern..."
    
    # Create a safe test that matches our rule pattern
    local test_url="http://httpbin.org/get?id=1' union select * from users--"
    
    echo "Testing URL with SQL injection pattern: $test_url"
    curl -s "$test_url" > /dev/null 2>&1 || true
    
    echo -e "${CYAN}✓ SQL injection test pattern sent${NC}"
    sleep 2
}

# Test 2: Suspicious User Agent
test_user_agent() {
    echo -e "${YELLOW}🧪 Test 2: Suspicious User Agent Detection${NC}"
    echo "Simulating suspicious user agent pattern..."
    
    # Use the exact user agent from our rules
    curl -s -A "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)" "http://httpbin.org/user-agent" > /dev/null 2>&1 || true
    
    echo -e "${CYAN}✓ Suspicious user agent test sent${NC}"
    sleep 2
}

# Test 3: Port scanning simulation
test_port_scan() {
    echo -e "${YELLOW}🧪 Test 3: Port Scan Detection${NC}"
    echo "Simulating port scanning activity..."
    
    # Create multiple connection attempts to trigger threshold
    local target="127.0.0.1"
    for port in {80..100}; do
        timeout 1 nc -z $target $port > /dev/null 2>&1 || true
    done
    
    echo -e "${CYAN}✓ Port scan simulation completed${NC}"
    sleep 2
}

# Test 4: DNS tunneling simulation
test_dns_tunneling() {
    echo -e "${YELLOW}🧪 Test 4: DNS Tunneling Detection${NC}"
    echo "Simulating suspicious DNS query..."
    
    # Create a long DNS query that should trigger our rule
    local long_domain=$(python3 -c "print('a' * 70 + '.example.com')")
    nslookup "$long_domain" > /dev/null 2>&1 || true
    
    echo -e "${CYAN}✓ Suspicious DNS query test sent${NC}"
    sleep 2
}

# Test 5: Malware download simulation
test_malware_download() {
    echo -e "${YELLOW}🧪 Test 5: Suspicious File Download${NC}"
    echo "Simulating suspicious executable download..."
    
    # Test suspicious file extensions
    curl -s "http://httpbin.org/response-headers?Content-Disposition=attachment;filename=malware.bat" > /dev/null 2>&1 || true
    curl -s "http://httpbin.org/response-headers?Content-Disposition=attachment;filename=virus.scr" > /dev/null 2>&1 || true
    
    echo -e "${CYAN}✓ Suspicious download test completed${NC}"
    sleep 2
}

# Function to check for generated alerts
check_alerts() {
    echo
    echo -e "${PURPLE}🔍 Checking for generated alerts...${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    sleep 3  # Wait for alerts to be written to logs
    
    local fast_log="/var/log/suricata/fast.log"
    local eve_log="/var/log/suricata/eve.json"
    
    if [[ -f "$fast_log" ]] && [[ -s "$fast_log" ]]; then
        local alert_count=$(wc -l < "$fast_log")
        echo -e "${RED}🚨 ALERTS GENERATED: $alert_count alerts detected!${NC}"
        echo
        echo -e "${YELLOW}Recent alerts:${NC}"
        tail -n 10 "$fast_log" | sed 's/^/   /'
    else
        echo -e "${GREEN}ℹ️  No alerts in fast.log yet (may take a moment to appear)${NC}"
    fi
    
    echo
    if [[ -f "$eve_log" ]] && [[ -s "$eve_log" ]]; then
        if command -v jq >/dev/null 2>&1; then
            local json_alerts=$(tail -n 100 "$eve_log" | jq -r 'select(.event_type=="alert")' 2>/dev/null | wc -l)
            echo -e "${YELLOW}Detailed alert count from eve.json: $json_alerts${NC}"
            
            if [[ $json_alerts -gt 0 ]]; then
                echo -e "${YELLOW}Alert details:${NC}"
                tail -n 100 "$eve_log" | jq -r 'select(.event_type=="alert") | "   \(.timestamp) - \(.alert.signature) (Severity: \(.alert.severity))"' 2>/dev/null | tail -5
            fi
        else
            echo -e "${YELLOW}Install jq for detailed JSON analysis: sudo apt install jq${NC}"
        fi
    fi
}

# Function to show monitoring commands
show_monitoring_commands() {
    echo
    echo -e "${CYAN}🔧 Monitor alerts in real-time with these commands:${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "1. Real-time alert stream:"
    echo "   sudo tail -f /var/log/suricata/fast.log"
    echo
    echo "2. Advanced dashboard:"
    echo "   sudo ./scripts/monitor-suricata-alerts.sh"
    echo
    echo "3. Quick status check:"
    echo "   sudo ./scripts/check-alerts.sh"
    echo
    echo "4. Live monitoring with notifications:"
    echo "   sudo ./scripts/monitor-suricata-alerts.sh --live"
}

# Function to create a legitimate traffic test
test_legitimate_traffic() {
    echo -e "${YELLOW}🧪 Test 6: Legitimate Traffic (Should NOT Alert)${NC}"
    echo "Testing whitelisted traffic patterns..."
    
    # These should be allowed by our pass rules
    curl -s "https://windowsupdate.microsoft.com" > /dev/null 2>&1 || true
    curl -s "https://update.googleapis.com" > /dev/null 2>&1 || true
    curl -s "https://www.google.com" > /dev/null 2>&1 || true
    
    echo -e "${GREEN}✓ Legitimate traffic test completed (should be allowed)${NC}"
    sleep 2
}

# Create a test alert rule for demonstration
create_test_rule() {
    echo -e "${YELLOW}📝 Adding test-specific detection rule...${NC}"
    
    # Add a simple test rule that will definitely trigger
    local test_rule='alert tcp any any -> any any (msg:"SHADOW-GUARDIAN Test Rule Triggered"; content:"SURICATA_TEST_ALERT"; sid:9999999; rev:1;)'
    
    echo "$test_rule" | sudo tee -a /var/lib/suricata/rules/custom-shadow-guardian.rules > /dev/null
    
    # Reload rules (kill -USR2 to reload without restart)
    local suricata_pid=$(pgrep -f suricata | head -1)
    if [[ ! -z "$suricata_pid" ]]; then
        sudo kill -USR2 "$suricata_pid" 2>/dev/null || true
        echo -e "${GREEN}✓ Test rule added and rules reloaded${NC}"
        sleep 2
    fi
}

# Test the custom test rule
test_custom_rule() {
    echo -e "${YELLOW}🧪 Test 7: Custom Test Rule${NC}"
    echo "Triggering custom test rule..."
    
    # Send HTTP request with test string
    curl -s -d "SURICATA_TEST_ALERT" "http://httpbin.org/post" > /dev/null 2>&1 || true
    
    echo -e "${CYAN}✓ Custom test rule triggered${NC}"
    sleep 2
}

# Clean up test rule
cleanup_test_rule() {
    echo -e "${YELLOW}🧹 Cleaning up test rule...${NC}"
    
    # Remove the test rule
    sudo sed -i '/SURICATA_TEST_ALERT/d' /var/lib/suricata/rules/custom-shadow-guardian.rules 2>/dev/null || true
    
    # Reload rules
    local suricata_pid=$(pgrep -f suricata | head -1)
    if [[ ! -z "$suricata_pid" ]]; then
        sudo kill -USR2 "$suricata_pid" 2>/dev/null || true
    fi
    
    echo -e "${GREEN}✓ Test rule removed${NC}"
}

# Interactive menu
show_menu() {
    echo -e "${CYAN}Choose test mode:${NC}"
    echo "1) Run all tests (recommended)"
    echo "2) Run individual tests"
    echo "3) Only check current alerts"
    echo "4) Exit"
    echo
    read -p "Enter choice [1-4]: " choice
    
    case $choice in
        1) run_all_tests ;;
        2) run_individual_tests ;;
        3) check_alerts ;;
        4) echo "Exiting..."; exit 0 ;;
        *) echo "Invalid choice"; show_menu ;;
    esac
}

# Run all tests
run_all_tests() {
    echo -e "${GREEN}🚀 Running all Suricata IPS tests...${NC}"
    echo
    
    create_test_rule
    test_sql_injection
    test_user_agent
    test_port_scan
    test_dns_tunneling
    test_malware_download
    test_legitimate_traffic
    test_custom_rule
    
    echo
    echo -e "${GREEN}✅ All tests completed!${NC}"
    check_alerts
    cleanup_test_rule
    show_monitoring_commands
}

# Run individual tests
run_individual_tests() {
    while true; do
        echo
        echo -e "${CYAN}Individual test menu:${NC}"
        echo "1) SQL Injection test"
        echo "2) Suspicious User Agent test"
        echo "3) Port Scan test"
        echo "4) DNS Tunneling test"
        echo "5) Malware Download test"
        echo "6) Legitimate Traffic test"
        echo "7) Custom Test Rule"
        echo "8) Check alerts"
        echo "9) Back to main menu"
        echo
        read -p "Enter choice [1-9]: " test_choice
        
        case $test_choice in
            1) test_sql_injection ;;
            2) test_user_agent ;;
            3) test_port_scan ;;
            4) test_dns_tunneling ;;
            5) test_malware_download ;;
            6) test_legitimate_traffic ;;
            7) create_test_rule; test_custom_rule; cleanup_test_rule ;;
            8) check_alerts ;;
            9) break ;;
            *) echo "Invalid choice" ;;
        esac
    done
}

# Main execution
main() {
    # Check prerequisites
    if [[ $EUID -ne 0 ]]; then
        echo -e "${RED}This script needs to be run with sudo for full functionality${NC}"
        echo "Run: sudo $0"
        exit 1
    fi
    
    check_suricata
    echo
    
    echo -e "${YELLOW}ℹ️  This script will safely test Suricata IPS detection capabilities${NC}"
    echo -e "${YELLOW}   by simulating attack patterns that should trigger alerts.${NC}"
    echo
    
    show_menu
}

# Install jq if not present (for JSON parsing)
install_prerequisites() {
    if ! command -v jq >/dev/null 2>&1; then
        echo -e "${YELLOW}Installing jq for JSON log analysis...${NC}"
        apt-get update && apt-get install -y jq
    fi
}

# Run main function
install_prerequisites 2>/dev/null || true
main "$@"
