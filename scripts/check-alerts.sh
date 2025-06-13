#!/bin/bash

# Shadow Guardian SOC - Simple Alert Checker
# Quick script to check for Suricata alerts

# Check if Suricata is running
if ! pgrep -f suricata > /dev/null; then
    echo "❌ Suricata is NOT running!"
    exit 1
fi

echo "✅ Suricata is running"

# Check for alerts in different ways
FAST_LOG="/var/log/suricata/fast.log"
EVE_LOG="/var/log/suricata/eve.json"

echo
echo "🔍 Alert Check Results:"
echo "========================"

# Method 1: Check fast.log (simple format)
if [[ -f "$FAST_LOG" ]] && [[ -s "$FAST_LOG" ]]; then
    alert_count=$(wc -l < "$FAST_LOG")
    echo "🚨 ALERTS FOUND: $alert_count alerts in fast.log"
    echo "📋 Last 3 alerts:"
    tail -n 3 "$FAST_LOG" | sed 's/^/   /'
else
    echo "✅ No alerts in fast.log (system is clean)"
fi

echo

# Method 2: Check eve.json (detailed format)
if [[ -f "$EVE_LOG" ]] && [[ -s "$EVE_LOG" ]]; then
    if command -v jq >/dev/null 2>&1; then
        alert_count=$(jq -r 'select(.event_type=="alert")' "$EVE_LOG" 2>/dev/null | wc -l)
        drop_count=$(jq -r 'select(.event_type=="drop")' "$EVE_LOG" 2>/dev/null | wc -l)
        
        echo "📊 Detailed Statistics:"
        echo "   - Alerts triggered: $alert_count"
        echo "   - Packets dropped: $drop_count"
        
        if [[ $alert_count -gt 0 ]]; then
            echo "📋 Recent alert details:"
            jq -r 'select(.event_type=="alert") | "   \(.timestamp) - \(.alert.signature) (Severity: \(.alert.severity))"' "$EVE_LOG" 2>/dev/null | tail -3
        fi
    else
        echo "⚠️  jq not installed - install with: sudo apt install jq"
        echo "📄 Raw eve.json has $(wc -l < "$EVE_LOG") total log entries"
    fi
else
    echo "✅ No events in eve.json"
fi

echo
echo "📁 Log file locations:"
echo "   - Fast alerts: $FAST_LOG"
echo "   - Detailed events: $EVE_LOG"

echo
echo "🔧 Commands to monitor alerts:"
echo "   - Real-time: sudo tail -f $FAST_LOG"
echo "   - Dashboard: sudo /home/ghost/projects/shadow-guardian-soc/scripts/monitor-suricata-alerts.sh"
