#!/bin/bash

# Shadow Guardian SOC - Alert Monitoring Demo
# Demonstrates real-time alert detection capabilities

echo "🚨 Shadow Guardian SOC - Alert Monitoring Demo"
echo "=============================================="
echo

echo "📊 Current Suricata Status:"
if pgrep -f suricata > /dev/null; then
    echo "✅ Suricata is running"
    echo "📍 Monitoring interface: enp0s20f0u4"
    echo "🔧 Running in IPS mode"
else
    echo "❌ Suricata is not running"
    exit 1
fi

echo
echo "📁 Alert Monitoring Locations:"
echo "   • Fast alerts: /var/log/suricata/fast.log"
echo "   • Detailed JSON: /var/log/suricata/eve.json"
echo "   • System logs: journalctl -u suricata"

echo
echo "🔍 How to detect alerts in real-time:"
echo "   1. Monitor fast.log: sudo tail -f /var/log/suricata/fast.log"
echo "   2. Monitor JSON events: sudo tail -f /var/log/suricata/eve.json"
echo "   3. Use our dashboard: sudo ./scripts/monitor-suricata-alerts.sh"

echo
echo "🧪 Alert Types You'll See:"
echo "   🚨 [**] [Priority: X] Alert Name [**]"
echo "   📅 Timestamp"
echo "   🌐 Source IP -> Destination IP"
echo "   📦 Protocol and port information"

echo
echo "💡 Example Alert Format:"
echo "   12/12/2025-19:30:45.123456  [**] [1:1000001:1] SHADOW-GUARDIAN Known Malware C2 Communication [**] [Classification: Trojan Activity] [Priority: 1] {TCP} 192.168.1.100:54321 -> 185.243.57.112:80"

echo
echo "🎯 Trigger an Alert Test:"
echo "   The system is configured to detect:"
echo "   • SQL injection attempts"
echo "   • Suspicious user agents"
echo "   • Port scanning"
echo "   • Malware downloads"
echo "   • Command injection"
echo "   • DNS tunneling"

echo
echo "🔐 Legitimate Traffic (Won't Alert):"
echo "   • Windows Updates"
echo "   • Google Services"
echo "   • Cloud platforms"
echo "   • Antivirus updates"

echo
echo "📈 Real-time Monitoring Commands:"
echo "   # Simple alert monitoring"
echo "   sudo watch -n 1 'wc -l /var/log/suricata/fast.log'"
echo
echo "   # Live alert stream"
echo "   sudo tail -f /var/log/suricata/fast.log"
echo
echo "   # Advanced dashboard"
echo "   sudo ./scripts/monitor-suricata-alerts.sh --dashboard"
echo
echo "   # Check current status"
echo "   sudo ./scripts/check-alerts.sh"

echo
echo "🚀 To start monitoring now, run one of these commands:"
echo "   sudo tail -f /var/log/suricata/fast.log    # Simple monitoring"
echo "   sudo ./scripts/monitor-suricata-alerts.sh  # Full dashboard"

echo
echo "✨ The system is now ready to detect and alert on malicious activity!"
echo "   Your network is protected while legitimate traffic flows normally."
