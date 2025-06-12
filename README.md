# Shadow Guardian SOC Platform

An advanced cybersecurity Security Operations Center (SOC) dashboard built with React, TypeScript, and cutting-edge web technologies. Features a cyberpunk aesthetic with professional SOC functionality.

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

1. Clone the repository:
```bash
git clone <repository-url>
cd cronos
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Demo Credentials

| Username | Password | Clearance Level | Role |
|----------|----------|----------------|------|
| `shadowadmin` | `StealthOp2024!` | APEX | SOC Director |
| `ghostoperator` | `Phantom2024#` | CLASSIFIED | Senior Analyst |
| `agent47` | `Assassin2024$` | SECRET | Field Operator |
| `analyst` | `Recon2024@` | SECRET | Junior Analyst |

**MFA Codes**: Use the same 6-digit code as the username (e.g., shadowadmin = 123456)

## 🎮 Demo Mode

Add `?demo=true` to the URL for automatic authentication after 3 seconds.

## 🏗️ Project Structure

```
src/
├── components/
│   └── ShadowGuardian.tsx    # Main SOC dashboard component
├── index.css                 # Global styles with Tailwind + custom CSS
├── App.tsx                   # Root component
└── main.tsx                  # Application entry point
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

---

**⚠️ Disclaimer**: This is a demonstration/educational project. Not intended for actual security operations without proper security reviews and implementations.
