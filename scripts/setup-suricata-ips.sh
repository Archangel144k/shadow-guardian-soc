#!/bin/bash

# Shadow Guardian SOC - Suricata IPS Tuning Script
# Optimizes Suricata configuration for IPS mode with minimal false positives

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration paths
SURICATA_CONFIG="/etc/suricata/suricata.yaml"
CUSTOM_CONFIG="/home/ghost/projects/shadow-guardian-soc/configs/suricata/suricata.yaml"
CUSTOM_RULES="/home/ghost/projects/shadow-guardian-soc/configs/suricata/custom-shadow-guardian.rules"
SURICATA_RULES_DIR="/var/lib/suricata/rules"
LOG_DIR="/var/log/suricata"

# System information
TOTAL_MEM=$(free -m | awk 'NR==2{print $2}')
CPU_CORES=$(nproc)
NETWORK_INTERFACES=$(ip -o link show | awk -F': ' '{print $2}' | grep -E '^(eth|ens|enp)' | head -2)

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    Shadow Guardian SOC - Suricata IPS Configuration Wizard    ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo

# Function to log messages
log_message() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error_message() {
    echo -e "${RED}[ERROR] $1${NC}"
}

warning_message() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Check if running as root
check_privileges() {
    if [[ $EUID -ne 0 ]]; then
        error_message "This script must be run as root for system configuration changes."
        echo "Please run: sudo $0"
        exit 1
    fi
}

# System requirements check
check_system_requirements() {
    log_message "Checking system requirements..."
    
    # Memory check
    if [[ $TOTAL_MEM -lt 4096 ]]; then
        warning_message "System has less than 4GB RAM. IPS performance may be limited."
        warning_message "Consider adjusting memory settings in configuration."
    else
        log_message "Memory: ${TOTAL_MEM}MB - Sufficient for IPS operations"
    fi
    
    # CPU check
    if [[ $CPU_CORES -lt 4 ]]; then
        warning_message "System has less than 4 CPU cores. Consider using fewer worker threads."
    else
        log_message "CPU Cores: ${CPU_CORES} - Good for multi-threaded IPS"
    fi
    
    # Network interfaces check
    local interface_count=$(echo "$NETWORK_INTERFACES" | wc -l)
    if [[ $interface_count -lt 2 ]]; then
        warning_message "Only one network interface detected. Bridge mode recommended for IPS."
        echo "Available interfaces: $NETWORK_INTERFACES"
    else
        log_message "Network interfaces detected: $NETWORK_INTERFACES"
    fi
}

# Install Suricata if not present
install_suricata() {
    if ! command -v suricata &> /dev/null; then
        log_message "Installing Suricata..."
        
        # Detect distribution and install accordingly
        if [[ -f /etc/debian_version ]]; then
            apt-get update
            apt-get install -y software-properties-common
            add-apt-repository ppa:oisf/suricata-stable -y
            apt-get update
            apt-get install -y suricata suricata-update
        elif [[ -f /etc/redhat-release ]]; then
            yum install -y epel-release
            yum install -y suricata suricata-update
        else
            error_message "Unsupported distribution. Please install Suricata manually."
            exit 1
        fi
    else
        log_message "Suricata is already installed: $(suricata --version | head -1)"
    fi
}

# Create optimized Suricata configuration
configure_suricata() {
    log_message "Configuring Suricata for IPS mode..."
    
    # Backup original configuration
    if [[ -f "$SURICATA_CONFIG" ]]; then
        cp "$SURICATA_CONFIG" "${SURICATA_CONFIG}.backup.$(date +%Y%m%d_%H%M%S)"
        log_message "Original configuration backed up"
    fi
    
    # Copy our optimized configuration
    cp "$CUSTOM_CONFIG" "$SURICATA_CONFIG"
    
    # Adjust configuration based on system resources
    sed -i "s/cpu: \[ \"1-4\" \]/cpu: [ \"1-$((CPU_CORES-1))\" ]/" "$SURICATA_CONFIG"
    
    # Adjust memory settings based on available RAM
    local memcap_flow=$((TOTAL_MEM / 8))
    local memcap_stream=$((TOTAL_MEM / 16))
    local memcap_detect=$((TOTAL_MEM / 4))
    
    sed -i "s/memcap: 128mb/memcap: ${memcap_flow}mb/" "$SURICATA_CONFIG"
    sed -i "s/memcap: 64mb/memcap: ${memcap_stream}mb/" "$SURICATA_CONFIG"
    
    log_message "Configuration optimized for system resources"
}

# Set up network interface configuration
configure_network() {
    log_message "Configuring network interfaces..."
    
    # Get primary interfaces
    local interfaces=($NETWORK_INTERFACES)
    local interface1=${interfaces[0]:-eth0}
    local interface2=${interfaces[1]:-eth1}
    
    echo "Detected interfaces: $interface1, $interface2"
    read -p "Enter ingress interface [$interface1]: " ingress_int
    read -p "Enter egress interface [$interface2]: " egress_int
    
    ingress_int=${ingress_int:-$interface1}
    egress_int=${egress_int:-$interface2}
    
    # Update configuration with selected interfaces
    sed -i "s/interface: eth0/interface: $ingress_int/" "$SURICATA_CONFIG"
    sed -i "s/copy-iface: eth1/copy-iface: $egress_int/" "$SURICATA_CONFIG"
    
    log_message "Network configuration updated: $ingress_int -> $egress_int"
}

# Set up rule management
setup_rules() {
    log_message "Setting up Suricata rules..."
    
    # Create rules directory if it doesn't exist
    mkdir -p "$SURICATA_RULES_DIR"
    
    # Copy custom rules
    cp "$CUSTOM_RULES" "$SURICATA_RULES_DIR/"
    
    # Update Suricata rules
    if command -v suricata-update &> /dev/null; then
        log_message "Updating Emerging Threats rules..."
        suricata-update --no-test --no-reload
        
        # Enable additional rule sources for better coverage
        suricata-update enable-source et/open
        suricata-update enable-source oisf/trafficid
        suricata-update --no-test --no-reload
    else
        warning_message "suricata-update not available. Manual rule management required."
    fi
    
    log_message "Rules configuration completed"
}

# Configure logging and monitoring
setup_logging() {
    log_message "Configuring logging and monitoring..."
    
    # Create log directory
    mkdir -p "$LOG_DIR"
    chown suricata:suricata "$LOG_DIR"
    
    # Set up log rotation
    cat > /etc/logrotate.d/suricata << 'EOF'
/var/log/suricata/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    sharedscripts
    create 644 suricata suricata
    postrotate
        /bin/kill -HUP `cat /var/run/suricata.pid 2> /dev/null` 2> /dev/null || true
    endscript
}

/var/log/suricata/*.json {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    sharedscripts
    create 644 suricata suricata
    postrotate
        /bin/kill -HUP `cat /var/run/suricata.pid 2> /dev/null` 2> /dev/null || true
    endscript
}
EOF
    
    log_message "Logging configuration completed"
}

# Create systemd service for IPS mode
setup_service() {
    log_message "Setting up Suricata IPS service..."
    
    # Create systemd service file optimized for IPS
    cat > /etc/systemd/system/suricata-ips.service << 'EOF'
[Unit]
Description=Suricata IPS (Intrusion Prevention System)
After=network.target

[Service]
Type=simple
ExecStartPre=/usr/bin/suricata -T -c /etc/suricata/suricata.yaml
ExecStart=/usr/bin/suricata -c /etc/suricata/suricata.yaml --netmap=eth0,eth1 -v
ExecReload=/bin/kill -USR2 $MAINPID
KillMode=mixed
KillSignal=SIGINT
TimeoutStopSec=300
Restart=on-failure
RestartSec=5
User=root
Group=root

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ReadWritePaths=/var/log/suricata /var/lib/suricata /var/run/suricata
ProtectHome=true
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true

# Resource limits
LimitNOFILE=65536
LimitMEMLOCK=infinity

[Install]
WantedBy=multi-user.target
EOF
    
    # Reload systemd and enable service
    systemctl daemon-reload
    systemctl enable suricata-ips
    
    log_message "Suricata IPS service configured"
}

# Performance tuning
performance_tuning() {
    log_message "Applying performance tuning..."
    
    # Kernel network tuning
    cat > /etc/sysctl.d/99-suricata-ips.conf << 'EOF'
# Suricata IPS Performance Tuning

# Increase network buffer sizes
net.core.rmem_default = 262144
net.core.rmem_max = 134217728
net.core.wmem_default = 262144
net.core.wmem_max = 134217728

# Increase maximum number of packets in kernel queue
net.core.netdev_max_backlog = 30000

# Increase TCP buffer sizes
net.ipv4.tcp_rmem = 4096 87380 134217728
net.ipv4.tcp_wmem = 4096 65536 134217728

# Increase connection tracking table size
net.netfilter.nf_conntrack_max = 2000000
net.netfilter.nf_conntrack_buckets = 500000

# Disable TCP timestamps for better performance
net.ipv4.tcp_timestamps = 0

# Enable TCP window scaling
net.ipv4.tcp_window_scaling = 1

# Increase maximum number of open files
fs.file-max = 2097152
EOF
    
    # Apply sysctl settings
    sysctl -p /etc/sysctl.d/99-suricata-ips.conf
    
    log_message "Performance tuning applied"
}

# Create monitoring script
create_monitoring() {
    log_message "Creating monitoring scripts..."
    
    # Create monitoring script
    cat > /usr/local/bin/suricata-monitor.sh << 'EOF'
#!/bin/bash

# Shadow Guardian Suricata IPS Monitor
# Real-time monitoring script for Suricata IPS performance

LOG_FILE="/var/log/suricata/stats.log"
EVE_FILE="/var/log/suricata/eve.json"

echo "Shadow Guardian Suricata IPS Monitor"
echo "====================================="
echo

# Check if Suricata is running
if ! pgrep -x "suricata" > /dev/null; then
    echo "ERROR: Suricata is not running!"
    exit 1
fi

# Display real-time statistics
echo "Real-time Statistics:"
echo "--------------------"

while true; do
    if [[ -f "$EVE_FILE" ]]; then
        # Count alerts in last minute
        alerts_last_min=$(tail -n 1000 "$EVE_FILE" | jq -r 'select(.event_type=="alert") | .timestamp' 2>/dev/null | wc -l)
        
        # Count dropped packets
        dropped=$(tail -n 100 "$EVE_FILE" | jq -r 'select(.event_type=="drop") | .timestamp' 2>/dev/null | wc -l)
        
        # System load
        load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | tr -d ',')
        
        # Memory usage
        mem_usage=$(free | grep Mem | awk '{printf("%.1f", $3/$2 * 100.0)}')
        
        clear
        echo "Shadow Guardian Suricata IPS Monitor"
        echo "====================================="
        echo "Timestamp: $(date)"
        echo "Alerts (last check): $alerts_last_min"
        echo "Dropped packets: $dropped"
        echo "System load: $load_avg"
        echo "Memory usage: ${mem_usage}%"
        echo
        echo "Press Ctrl+C to exit"
    fi
    
    sleep 5
done
EOF
    
    chmod +x /usr/local/bin/suricata-monitor.sh
    
    log_message "Monitoring script created: /usr/local/bin/suricata-monitor.sh"
}

# False positive tuning script
create_tuning_script() {
    log_message "Creating false positive tuning script..."
    
    cat > /usr/local/bin/suricata-tune.sh << 'EOF'
#!/bin/bash

# Shadow Guardian Suricata False Positive Tuning
# Analyzes alerts and provides tuning recommendations

EVE_FILE="/var/log/suricata/eve.json"
RULES_DIR="/var/lib/suricata/rules"

echo "Shadow Guardian Suricata False Positive Analysis"
echo "==============================================="

if [[ ! -f "$EVE_FILE" ]]; then
    echo "Error: Eve log file not found at $EVE_FILE"
    exit 1
fi

# Analyze top alerting rules
echo "Top 10 Most Frequent Alerts (last 24 hours):"
echo "--------------------------------------------"
find /var/log/suricata -name "eve.json*" -mtime -1 -exec cat {} \; | \
    jq -r 'select(.event_type=="alert") | "\(.alert.signature_id)|\(.alert.signature)"' 2>/dev/null | \
    sort | uniq -c | sort -nr | head -10 | \
    awk '{print "SID " $2 " (" $1 " alerts): " substr($0, index($0,$3))}'

echo
echo "Alert Distribution by Category:"
echo "------------------------------"
find /var/log/suricata -name "eve.json*" -mtime -1 -exec cat {} \; | \
    jq -r 'select(.event_type=="alert") | .alert.category' 2>/dev/null | \
    sort | uniq -c | sort -nr

echo
echo "Recommendations:"
echo "---------------"
echo "1. Review high-frequency alerts for false positives"
echo "2. Consider disabling or modifying rules with SID numbers listed above"
echo "3. Add whitelist rules for legitimate traffic patterns"
echo "4. Adjust thresholds for frequently triggered rules"
echo "5. Review and update HOME_NET and EXTERNAL_NET variables"

# Check for common false positive patterns
echo
echo "Potential False Positive Indicators:"
echo "-----------------------------------"

# Check for alerts during business hours (likely legitimate traffic)
business_hours_alerts=$(find /var/log/suricata -name "eve.json*" -mtime -1 -exec cat {} \; | \
    jq -r 'select(.event_type=="alert") | select(.timestamp | strptime("%Y-%m-%dT%H:%M:%S") | strftime("%H") | tonumber >= 9 and tonumber <= 17) | .alert.signature_id' 2>/dev/null | \
    sort | uniq -c | sort -nr | head -5)

if [[ -n "$business_hours_alerts" ]]; then
    echo "High-frequency alerts during business hours (9 AM - 5 PM):"
    echo "$business_hours_alerts"
fi
EOF
    
    chmod +x /usr/local/bin/suricata-tune.sh
    
    log_message "Tuning script created: /usr/local/bin/suricata-tune.sh"
}

# Validation and testing
validate_configuration() {
    log_message "Validating Suricata configuration..."
    
    # Test configuration syntax
    if suricata -T -c "$SURICATA_CONFIG" -v; then
        log_message "Configuration validation passed"
    else
        error_message "Configuration validation failed. Please check the configuration file."
        exit 1
    fi
    
    # Test rules syntax
    if suricata -T -c "$SURICATA_CONFIG" -S "$SURICATA_RULES_DIR/custom-shadow-guardian.rules" -v; then
        log_message "Rules validation passed"
    else
        error_message "Rules validation failed. Please check the rules file."
        exit 1
    fi
}

# Main installation function
main() {
    echo -e "${BLUE}Starting Shadow Guardian Suricata IPS setup...${NC}"
    echo
    
    check_privileges
    check_system_requirements
    install_suricata
    configure_suricata
    configure_network
    setup_rules
    setup_logging
    setup_service
    performance_tuning
    create_monitoring
    create_tuning_script
    validate_configuration
    
    echo
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}    Shadow Guardian Suricata IPS Setup Complete!                ${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "1. Start Suricata IPS: systemctl start suricata-ips"
    echo "2. Monitor performance: /usr/local/bin/suricata-monitor.sh"
    echo "3. Tune false positives: /usr/local/bin/suricata-tune.sh"
    echo "4. View logs: tail -f /var/log/suricata/eve.json"
    echo "5. Check alerts: tail -f /var/log/suricata/fast.log"
    echo
    echo -e "${YELLOW}Important Notes:${NC}"
    echo "- Configuration optimized for minimal false positives"
    echo "- Monitor system performance during initial deployment"
    echo "- Adjust thresholds based on your network traffic patterns"
    echo "- Regular rule updates recommended for threat coverage"
    echo
    
    read -p "Would you like to start Suricata IPS now? (y/N): " start_now
    if [[ $start_now =~ ^[Yy]$ ]]; then
        systemctl start suricata-ips
        systemctl status suricata-ips
        log_message "Suricata IPS started successfully!"
    fi
}

# Run main function
main "$@"
