# Shadow Guardian SOC Platform - Demo Guide

## Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Installation & Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open browser to http://localhost:5174

### Demo Credentials

The application includes several demo user accounts with different clearance levels:

| Username | Password | Clearance | MFA Code | Role |
|----------|----------|-----------|----------|------|
| shadowadmin | StealthOp2024! | APEX | 123456 | SOC Director |
| ghostoperator | Phantom2024# | CLASSIFIED | 654321 | Senior Analyst |
| agent47 | Assassin2024$ | SECRET | 789123 | Field Operator |
| analyst | Recon2024@ | SECRET | 456789 | Junior Analyst |

### Features Overview

#### 🔐 Authentication System
- Multi-step authentication (Username/Password → 2FA)
- Account lockout protection after failed attempts
- Role-based access control

#### 📊 SOC Dashboard
- Real-time threat monitoring
- Security metrics visualization
- System status indicators
- Interactive charts and graphs

#### 🎨 Cyberpunk UI
- Matrix rain background effect
- Scanline animations
- Cyberpunk color scheme
- Monospace fonts for authentic feel

#### 🛡️ Security Tools
- Integration status for various security tools
- Performance metrics
- Tool-specific dashboards

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Technology Stack
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling and animations
- **Lucide React** - Icons
- **Recharts** - Data visualization

### Project Structure
```
src/
├── components/
│   └── ShadowGuardian.tsx    # Main application component
├── App.tsx                   # App wrapper
├── main.tsx                  # Application entry point
└── index.css                 # Global styles and Tailwind imports
```

## Customization

### Adding New Features
1. Extend the `ShadowGuardian` component
2. Add new tab options in the navigation
3. Create corresponding UI sections
4. Update the demo data as needed

### Styling
- Modify `tailwind.config.js` for custom colors/animations
- Update CSS variables in `index.css`
- Customize component styles using Tailwind classes

### Security Tools Integration
- Add new tools to the `toolsStatus` object
- Create tool-specific status displays
- Implement real API integrations as needed

## Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your web server
3. Configure environment variables for production APIs

---

**Note**: This is a demonstration application for educational and showcase purposes. In a production environment, implement proper security measures, real authentication systems, and actual security tool integrations.
