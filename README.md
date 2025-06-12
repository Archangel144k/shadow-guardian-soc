# 🛡️ Shadow Guardian SOC Platform

<div align="center">

[![GitHub Stars](https://img.shields.io/github/stars/Archangel144k/shadow-guardian-soc?style=for-the-badge&logo=github&color=red)](https://github.com/Archangel144k/shadow-guardian-soc/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Archangel144k/shadow-guardian-soc?style=for-the-badge&logo=github&color=orange)](https://github.com/Archangel144k/shadow-guardian-soc/network)
[![GitHub Issues](https://img.shields.io/github/issues/Archangel144k/shadow-guardian-soc?style=for-the-badge&logo=github&color=yellow)](https://github.com/Archangel144k/shadow-guardian-soc/issues)
[![License](https://img.shields.io/github/license/Archangel144k/shadow-guardian-soc?style=for-the-badge&color=green)](LICENSE)

**An advanced cybersecurity Security Operations Center (SOC) dashboard with cyberpunk aesthetics**

*Built with React + TypeScript + Professional SOC functionality*

[🚀 Live Demo](https://archangel144k.github.io/shadow-guardian-soc) • [📖 Documentation](./DEMO_GUIDE.md) • [🐛 Report Bug](https://github.com/Archangel144k/shadow-guardian-soc/issues) • [✨ Request Feature](https://github.com/Archangel144k/shadow-guardian-soc/issues)

</div>

---

An enterprise-grade cybersecurity dashboard that combines cutting-edge web technologies with professional SOC functionality. Features a stunning cyberpunk aesthetic, real-time threat monitoring, and comprehensive security tools management.

## 🛡️ Features

### Authentication & Security
- Multi-factor authentication with demo credentials
- Role-based access control (PUBLIC, SECRET, CLASSIFIED, APEX clearance levels)
- Biometric authentication simulation for mobile devices
- Account lockout protection and security monitoring

### Dashboard & Monitoring
- Real-time threat detection and monitoring
- Security tools status dashboard (Suricata, Elasticsearch, Graylog, Wazuh, etc.)
- Interactive data visualizations with Recharts
- Matrix rain effect and cyberpunk animations
- System metrics and performance monitoring

### Incident Response
- Threat detection and classification
- Automated response capabilities
- Incident escalation workflows
- MITRE ATT&CK framework integration
- Forensic analysis tools

### Training Academy
- Cybersecurity education modules
- Hands-on practical labs
- Skill progression tracking
- Achievement system
- Interactive learning experiences

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom cyberpunk theme
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Custom CSS animations with matrix effects

## 🔧 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Archangel144k/shadow-guardian-soc.git
cd shadow-guardian-soc
```

2. **Install dependencies:**
```bash
npm install
```

3. **(Optional) Set up Supabase backend:**
```bash
# Copy environment template
cp .env.local.example .env.local

# Add your Supabase credentials to .env.local
# See SUPABASE_INTEGRATION.md for detailed setup guide
```

4. **Start the development server:**
```bash
npm run dev
```

5. **Open your browser and navigate to:**
```
http://localhost:5173
```

## 🔧 Backend Integration

Shadow Guardian supports two modes of operation:

### Demo Mode (Default)
- Uses simulated data and mock authentication
- Perfect for testing and demonstrations
- No backend setup required
- Add `?demo=true` to URL to force demo mode

### Live Mode (Supabase Backend)
- Real-time threat monitoring and data persistence
- User authentication with role-based access control
- Training progress tracking and system metrics
- Follow the [Supabase Integration Guide](./SUPABASE_INTEGRATION.md) for setup

## 🎮 Demo Credentials

| Username | Password | Clearance Level | Role |
|----------|----------|----------------|------|
| `shadowadmin` | `StealthOp2024!` | APEX | SOC Director |
| `ghostoperator` | `Phantom2024#` | CLASSIFIED | Senior Analyst |
| `agent47` | `Assassin2024$` | SECRET | Field Operator |
| `analyst` | `Recon2024@` | SECRET | Junior Analyst |

**MFA Codes**: Use the same 6-digit code as the username (e.g., shadowadmin = 123456)

## 🎮 Demo Mode

Add `?demo=true` to the URL for automatic authentication after 3 seconds.

## 🛠️ Development Tips

### Quick Start with Demo Mode
```bash
# Fast demo without Supabase setup
npm install && npm run dev
# Visit http://localhost:5173?demo=true
```

### Environment Setup
```bash
# Check if Supabase is configured
npm run dev
# Look for "Supabase Backend" status in the dashboard
```

### Building for Production
```bash
npm run build    # Build optimized version
npm run preview  # Preview production build
```

## 🎨 Design Philosophy

Shadow Guardian combines the visual appeal of cyberpunk aesthetics with the functionality required by security professionals:

- **Matrix Rain Effects**: Animated background for immersive experience
- **Monospace Typography**: JetBrains Mono for authentic terminal feel
- **Cyberpunk Color Palette**: Neon colors on dark backgrounds
- **Glassmorphism**: Backdrop blur effects for modern UI
- **Professional Functionality**: Real SOC tools and workflows

## 🔐 Security Features Simulated

- **Network Security Monitoring**: Suricata IDS/IPS simulation
- **SIEM Analytics**: Elasticsearch and Graylog integration
- **Host Monitoring**: Wazuh and OSSEC capabilities
- **Threat Intelligence**: Real-time feed simulation
- **Penetration Testing**: Metasploit and Nmap tools
- **Behavioral Analysis**: AI-powered anomaly detection

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Roadmap

- [ ] Complete dashboard implementation with all tabs
- [ ] Real-time WebSocket integration for live updates
- [ ] Advanced threat hunting capabilities
- [ ] Integration with actual security APIs
- [ ] Mobile-responsive design improvements
- [ ] Dark/light theme toggle
- [ ] Export functionality for reports
- [ ] Plugin system for custom security tools

## 🤝 Contributing

This is a demonstration project showcasing modern React development with a cybersecurity theme. Feel free to fork and expand upon it!

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Archangel144k/shadow-guardian-soc/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⭐ Show Your Support

Give a ⭐️ if this project helped you learn about cybersecurity or web development!

## 👤 Author

**Archangel144k**
- GitHub: [@Archangel144k](https://github.com/Archangel144k)
- Project Link: [https://github.com/Archangel144k/shadow-guardian-soc](https://github.com/Archangel144k/shadow-guardian-soc)

---

<div align="center">

**🛡️ Built with ❤️ for the cybersecurity community**

*"In shadows we trust, in code we defend"*

**⚠️ Disclaimer**: This is a demonstration/educational project. Not intended for actual security operations without proper security reviews and implementations.

</div>
