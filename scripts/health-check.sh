#!/bin/bash

# Shadow Guardian SOC - Application Health Check
# Comprehensive check for application status and errors

echo "🛡️  Shadow Guardian SOC - Application Health Check"
echo "=================================================="
echo

echo "📊 Application Status:"
echo "---------------------"

# Check if dev server is running
if pgrep -f "vite" > /dev/null; then
    echo "✅ Development server is running"
    port=$(netstat -tlnp 2>/dev/null | grep vite | awk '{print $4}' | cut -d: -f2 | head -1)
    if [[ ! -z "$port" ]]; then
        echo "🌐 Accessible at: http://localhost:$port/"
    else
        echo "🌐 Accessible at: http://localhost:5174/"
    fi
else
    echo "❌ Development server is not running"
    echo "💡 Start with: npm run dev"
fi

echo

echo "🔍 Code Quality Check:"
echo "----------------------"

# Check linting
if npm run lint --silent > /dev/null 2>&1; then
    echo "✅ No linting errors found"
else
    echo "⚠️  Linting issues detected"
    echo "💡 Run: npm run lint"
fi

# Check build
if npm run build --silent > /dev/null 2>&1; then
    echo "✅ Application builds successfully"
else
    echo "❌ Build errors detected"
    echo "💡 Run: npm run build"
fi

echo

echo "🔧 System Integration:"
echo "----------------------"

# Check Suricata IPS
if pgrep -f suricata > /dev/null; then
    echo "✅ Suricata IPS is running"
    echo "📊 Monitor alerts: sudo ./scripts/check-alerts.sh"
else
    echo "⚠️  Suricata IPS is not running"
    echo "💡 Start with: sudo suricata -c /home/ghost/projects/shadow-guardian-soc/configs/suricata/suricata.yaml --af-packet=enp0s20f0u4 -D"
fi

echo

echo "📂 Project Structure:"
echo "--------------------"
echo "✅ Source code: /home/ghost/projects/shadow-guardian-soc/src/"
echo "✅ Components: /home/ghost/projects/shadow-guardian-soc/src/components/"
echo "✅ Suricata config: /home/ghost/projects/shadow-guardian-soc/configs/suricata/"
echo "✅ Scripts: /home/ghost/projects/shadow-guardian-soc/scripts/"

echo

echo "🚀 Available Commands:"
echo "----------------------"
echo "Development:"
echo "  npm run dev          # Start development server"
echo "  npm run build        # Build for production"
echo "  npm run lint         # Check code quality"
echo "  npm run preview      # Preview production build"
echo
echo "Security Operations:"
echo "  sudo ./scripts/check-alerts.sh                 # Check Suricata alerts"
echo "  sudo ./scripts/monitor-suricata-alerts.sh      # Real-time monitoring"
echo "  sudo ./scripts/test-suricata-alerts.sh         # Test alert generation"
echo
echo "Application URLs:"
echo "  http://localhost:5174/                         # Main application"

echo

echo "✨ Shadow Guardian SOC Platform Status: OPERATIONAL"
echo "🛡️  Your cybersecurity operations center is ready!"
