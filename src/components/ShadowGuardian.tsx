import { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Book, 
  Activity, 
  Lock, 
  Eye, 
  Skull, 
  Key, 
  Smartphone, 
  QrCode, 
  ShieldCheck, 
  Settings, 
  Search, 
  LogOut, 
  LogIn, 
  User, 
  Database, 
  Ghost, 
  Target 
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

// Shadow Guardian SOC Platform
const ShadowGuardian = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStep, setAuthStep] = useState('login');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [mfaCode, setMfaCode] = useState(['', '', '', '', '', '']);
  const [authAttempts, setAuthAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // UI State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [systemStatus] = useState('stealth');
  const [matrixRain, setMatrixRain] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [alertCount, setAlertCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const scanlineEffect = true;

  // User Database
  const users = {
    'shadowadmin': { 
      password: 'StealthOp2024!', 
      clearance: 'APEX', 
      name: 'Shadow Administrator',
      mfaSecret: '123456',
      role: 'SOC Director',
      department: 'Cyber Command'
    },
    'ghostoperator': { 
      password: 'Phantom2024#', 
      clearance: 'CLASSIFIED', 
      name: 'Ghost Operator',
      mfaSecret: '654321',
      role: 'Senior Analyst',
      department: 'Threat Intelligence'
    },
    'agent47': { 
      password: 'Assassin2024$', 
      clearance: 'SECRET', 
      name: 'Field Agent',
      mfaSecret: '789123',
      role: 'Field Operator',
      department: 'Red Team'
    },
    'analyst': {
      password: 'Recon2024@',
      clearance: 'SECRET',
      name: 'Security Analyst',
      mfaSecret: '456789',
      role: 'Junior Analyst',
      department: 'Blue Team'
    }
  };

  // Dashboard Data
  const [dashboardData, setDashboardData] = useState({
    threatTrend: [
      { time: '10:00', threats: 12, blocked: 8, mitigated: 4 },
      { time: '10:05', threats: 15, blocked: 10, mitigated: 5 },
      { time: '10:10', threats: 8, blocked: 6, mitigated: 2 },
      { time: '10:15', threats: 20, blocked: 15, mitigated: 5 },
      { time: '10:20', threats: 18, blocked: 12, mitigated: 6 },
    ],
    severityDistribution: [
      { name: 'Low', value: 45, color: '#10B981' },
      { name: 'Medium', value: 30, color: '#F59E0B' },
      { name: 'High', value: 20, color: '#EF4444' },
      { name: 'Critical', value: 5, color: '#8B5CF6' }
    ]
  });

  // Security Tools Status
  interface SecurityTool {
    name: string;
    status: string;
    performance: number;
    icon: string;
    threats?: number;
    events?: number;
    logs?: number;
    agents?: number;
    targets?: number;
    exploits?: number;
  }

  const [securityTools, setSecurityTools] = useState<SecurityTool[]>([
    { name: 'Suricata IDS', status: 'active', threats: 156, performance: 98, icon: '🛡️' },
    { name: 'Elasticsearch', status: 'active', events: 2847, performance: 95, icon: '🔍' },
    { name: 'Graylog SIEM', status: 'active', logs: 15420, performance: 97, icon: '📊' },
    { name: 'Wazuh HIDS', status: 'active', agents: 847, performance: 94, icon: '🔒' },
    { name: 'NMAP Scanner', status: 'scanning', targets: 256, performance: 89, icon: '🌐' },
    { name: 'Metasploit', status: 'standby', exploits: 2134, performance: 100, icon: '💥' }
  ]);

  // Recent Threats
  const [recentThreats, setRecentThreats] = useState([
    { id: 1, type: 'Malware', severity: 'High', source: '192.168.1.45', status: 'Blocked', time: '10:23:45' },
    { id: 2, type: 'DDoS', severity: 'Critical', source: '203.45.67.89', status: 'Mitigating', time: '10:21:32' },
    { id: 3, type: 'Phishing', severity: 'Medium', source: 'email.suspicious.com', status: 'Quarantined', time: '10:19:15' },
    { id: 4, type: 'SQL Injection', severity: 'High', source: '185.23.45.67', status: 'Blocked', time: '10:17:28' }
  ]);

  // Training Modules
  const trainingModules = [
    { 
      id: 1, 
      title: 'Advanced Threat Hunting', 
      difficulty: 'Expert', 
      duration: '45 min', 
      progress: 75,
      type: 'Interactive Lab',
      description: 'Learn advanced techniques for proactive threat hunting using MITRE ATT&CK framework'
    },
    { 
      id: 2, 
      title: 'Incident Response Procedures', 
      difficulty: 'Intermediate', 
      duration: '30 min', 
      progress: 90,
      type: 'Simulation',
      description: 'Practice incident response workflows and containment strategies'
    },
    { 
      id: 3, 
      title: 'Digital Forensics Fundamentals', 
      difficulty: 'Beginner', 
      duration: '60 min', 
      progress: 60,
      type: 'Tutorial',
      description: 'Master the basics of digital forensics and evidence collection'
    },
    { 
      id: 4, 
      title: 'Red Team Operations', 
      difficulty: 'Expert', 
      duration: '90 min', 
      progress: 25,
      type: 'Hands-on Lab',
      description: 'Offensive security techniques and penetration testing methodologies'
    }
  ];

  // Matrix Rain Effect
  useEffect(() => {
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const columns = Math.floor(window.innerWidth / 20);
    const drops = new Array(columns).fill(0);
    
    const rain = drops.map((_, i) => ({
      id: i,
      x: i * 20,
      y: Math.random() * window.innerHeight,
      speed: Math.random() * 3 + 2,
      char: characters[Math.floor(Math.random() * characters.length)],
      opacity: Math.random() * 0.5 + 0.1
    }));
    
    setMatrixRain(rain);

    const interval = setInterval(() => {
      setMatrixRain(prev => prev.map(drop => ({
        ...drop,
        y: drop.y > window.innerHeight ? -20 : drop.y + drop.speed,
        char: Math.random() < 0.1 ? characters[Math.floor(Math.random() * characters.length)] : drop.char,
        opacity: Math.random() * 0.3 + 0.05
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Real-time Data Simulation
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      // Generate new threat data
      const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      const newThreats = Math.floor(Math.random() * 25) + 5;
      const newBlocked = Math.floor(newThreats * 0.7);
      const newMitigated = newThreats - newBlocked;

      setDashboardData(prev => ({
        ...prev,
        threatTrend: [
          ...prev.threatTrend.slice(1),
          { 
            time: currentTime, 
            threats: newThreats, 
            blocked: newBlocked, 
            mitigated: newMitigated 
          }
        ]
      }));

      // Randomly generate new threats
      if (Math.random() < 0.3) {
        const threatTypes = ['Malware', 'DDoS', 'Phishing', 'SQL Injection', 'XSS Attack', 'Brute Force', 'Zero-Day'];
        const severities = ['Low', 'Medium', 'High', 'Critical'];
        const sources = ['192.168.1.', '203.45.67.', '185.23.45.', '10.0.0.', '172.16.1.'];
        const statuses = ['Detected', 'Blocked', 'Mitigating', 'Quarantined'];

        const newThreat = {
          id: Date.now(),
          type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          source: sources[Math.floor(Math.random() * sources.length)] + Math.floor(Math.random() * 255),
          status: statuses[Math.floor(Math.random() * statuses.length)],
          time: new Date().toLocaleTimeString()
        };

        setRecentThreats(prev => [newThreat, ...prev.slice(0, 9)]);
        setAlertCount(prev => prev + 1);
        
        // Add notification
        const notification = {
          id: Date.now(),
          type: newThreat.severity,
          message: `${newThreat.type} detected from ${newThreat.source}`,
          time: new Date().toLocaleTimeString(),
          read: false
        };
        
        setNotifications(prev => [notification, ...prev.slice(0, 4)]);

        // Play alert sound if enabled
        if (soundEnabled && newThreat.severity === 'Critical') {
          // In a real app, you'd play an actual sound file
          console.log('🚨 CRITICAL ALERT SOUND');
        }
      }

      // Update security tools performance
      setSecurityTools(prev => prev.map(tool => ({
        ...tool,
        performance: Math.max(85, Math.min(100, tool.performance + (Math.random() - 0.5) * 4)),
        threats: tool.threats ? tool.threats + Math.floor(Math.random() * 3) : undefined,
        events: tool.events ? tool.events + Math.floor(Math.random() * 50) : undefined,
        logs: tool.logs ? tool.logs + Math.floor(Math.random() * 100) : undefined,
        agents: tool.agents ? tool.agents + Math.floor(Math.random() * 2) : undefined,
        targets: tool.targets ? tool.targets + Math.floor(Math.random() * 5) : undefined
      })));

    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, soundEnabled]);

  // Lockout Timer
  useEffect(() => {
    if (lockoutTime > 0) {
      const timer = setTimeout(() => {
        setLockoutTime(lockoutTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [lockoutTime]);

  // Authentication Functions
  const handleLogin = async () => {
    if (lockoutTime > 0) return;

    const user = (users as any)[loginData.username.toLowerCase()];
    if (user && user.password === loginData.password) {
      setCurrentUser({ username: loginData.username, ...user });
      setAuthStep('mfa');
      setAuthAttempts(0);
    } else {
      setAuthAttempts(prev => prev + 1);
      if (authAttempts >= 2) {
        setLockoutTime(30);
      }
    }
  };

  const handleMFACode = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...mfaCode];
      newCode[index] = value;
      setMfaCode(newCode);
      
      if (value && index < 5) {
        const nextInput = document.getElementById(`mfa-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const verifyMFA = () => {
    const enteredCode = mfaCode.join('');
    if (enteredCode === currentUser.mfaSecret) {
      setIsAuthenticated(true);
    } else {
      setMfaCode(['', '', '', '', '', '']);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAuthStep('login');
    setCurrentUser(null);
    setLoginData({ username: '', password: '' });
    setMfaCode(['', '', '', '', '', '']);
    setAuthAttempts(0);
  };

  // Authentication Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Matrix Rain Background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {matrixRain.map(drop => (
            <div
              key={drop.id}
              className="absolute text-green-400 font-mono text-sm select-none animate-pulse"
              style={{
                left: drop.x,
                top: drop.y,
                opacity: drop.opacity,
                textShadow: '0 0 10px currentColor'
              }}
            >
              {drop.char}
            </div>
          ))}
        </div>

        {/* Background Effects */}
        <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90 z-1"></div>
        
        {scanlineEffect && (
          <div className="fixed inset-0 pointer-events-none z-50 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent h-1 animate-scan"></div>
          </div>
        )}
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="relative">
                  <Skull className="w-12 h-12 text-red-500 animate-pulse" />
                  <div className="absolute -inset-2 bg-red-500/20 rounded-full blur-lg animate-pulse"></div>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-transparent font-mono">
                  SHADOW GUARDIAN
                </h1>
              </div>
              <p className="text-gray-400 font-mono text-sm">ENTERPRISE SECURITY OPERATIONS CENTER</p>
            </div>

            {/* Login Form */}
            {authStep === 'login' && (
              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-red-500/30 shadow-lg shadow-red-500/10">
                <div className="flex items-center space-x-2 mb-6">
                  <Key className="w-5 h-5 text-red-400" />
                  <h2 className="text-xl font-bold text-red-400 font-mono">PRIMARY AUTHENTICATION</h2>
                </div>
                
                {lockoutTime > 0 && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
                    <div className="text-red-400 font-mono text-sm flex items-center space-x-2">
                      <Lock className="w-4 h-4" />
                      <span>SECURITY LOCKOUT: {lockoutTime}s remaining</span>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 font-mono mb-2">OPERATOR ID</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={loginData.username}
                        onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-4 py-3 pl-10 bg-black/50 border border-gray-600 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 text-white font-mono transition-all"
                        placeholder="Enter operator identifier"
                        disabled={lockoutTime > 0}
                      />
                      <User className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 font-mono mb-2">PASSPHRASE</label>
                    <div className="relative">
                      <input
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full px-4 py-3 pl-10 bg-black/50 border border-gray-600 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 text-white font-mono transition-all"
                        placeholder="Enter security passphrase"
                        disabled={lockoutTime > 0}
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                      />
                      <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                    </div>
                  </div>
                  <button
                    onClick={handleLogin}
                    disabled={lockoutTime > 0}
                    className="w-full py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all font-mono border border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>INITIATE ACCESS</span>
                  </button>
                </div>

                <div className="mt-6 p-4 bg-black/40 rounded-lg border border-gray-700/50">
                  <div className="text-xs text-gray-400 font-mono mb-2">DEMO CREDENTIALS:</div>
                  <div className="space-y-1 text-xs font-mono">
                    <div className="text-green-400">shadowadmin / StealthOp2024! <span className="text-purple-400">(APEX)</span></div>
                    <div className="text-green-400">ghostoperator / Phantom2024# <span className="text-red-400">(CLASSIFIED)</span></div>
                    <div className="text-green-400">agent47 / Assassin2024$ <span className="text-orange-400">(SECRET)</span></div>
                    <div className="text-green-400">analyst / Recon2024@ <span className="text-orange-400">(SECRET)</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* MFA Form */}
            {authStep === 'mfa' && (
              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-orange-500/30 shadow-lg shadow-orange-500/10">
                <div className="flex items-center space-x-2 mb-6">
                  <Smartphone className="w-5 h-5 text-orange-400" />
                  <h2 className="text-xl font-bold text-orange-400 font-mono">TWO-FACTOR AUTHENTICATION</h2>
                </div>
                
                <div className="text-center mb-6">
                  <QrCode className="w-16 h-16 text-orange-400 mx-auto mb-4 animate-pulse" />
                  <p className="text-gray-300 font-mono text-sm">Enter the 6-digit code from your authenticator app</p>
                </div>

                <div className="flex space-x-2 mb-6">
                  {mfaCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`mfa-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleMFACode(index, e.target.value)}
                      className="w-12 h-12 text-center bg-black/50 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-white font-mono text-lg transition-all"
                      maxLength={1}
                    />
                  ))}
                </div>

                <button
                  onClick={verifyMFA}
                  disabled={mfaCode.some(digit => !digit)}
                  className="w-full py-3 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-all font-mono border border-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>COMPLETE AUTHENTICATION</span>
                </button>

                <div className="mt-4 p-3 bg-black/40 rounded-lg border border-gray-700/50">
                  <div className="text-xs text-gray-400 font-mono text-center">
                    Demo codes: shadowadmin=123456, ghostoperator=654321, agent47=789123, analyst=456789
                  </div>
                </div>
              </div>
            )}

            {/* System Status */}
            <div className="mt-6 bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${authAttempts > 0 ? 'bg-yellow-400' : 'bg-green-400'} animate-pulse`}></div>
                  <span>SYSTEM STATUS: {authAttempts > 0 ? 'ALERT' : 'SECURE'}</span>
                </div>
                <div>ATTEMPTS: {authAttempts}/3</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Application Interface
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Matrix Rain Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {matrixRain.map(drop => (
          <div
            key={drop.id}
            className="absolute text-green-400 font-mono text-sm select-none opacity-30"
            style={{
              left: drop.x,
              top: drop.y,
              opacity: drop.opacity,
              textShadow: '0 0 10px currentColor'
            }}
          >
            {drop.char}
          </div>
        ))}
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90 z-1"></div>
      
      {scanlineEffect && (
        <div className="fixed inset-0 pointer-events-none z-50 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent h-1 animate-scan"></div>
        </div>
      )}
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-black/80 backdrop-blur-md border-b border-red-500/30 shadow-lg shadow-red-500/10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Skull className="w-8 h-8 text-red-500 animate-pulse" />
                  <div className="absolute -inset-1 bg-red-500/20 rounded-full blur-sm animate-pulse"></div>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-transparent font-mono">
                  SHADOW GUARDIAN
                </h1>
                <div className="text-xs text-red-400 font-mono opacity-75">Enterprise SOC v3.0</div>
              </div>
              
              <div className="flex items-center space-x-6">
                {/* System Status */}
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                  systemStatus === 'stealth' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 
                  systemStatus === 'alert' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
                  'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  {systemStatus === 'stealth' ? <Ghost className="w-4 h-4" /> : 
                   systemStatus === 'alert' ? <Eye className="w-4 h-4" /> : 
                   <Target className="w-4 h-4 animate-pulse" />}
                  <span className="text-sm font-mono font-medium">
                    {systemStatus === 'stealth' ? 'SECURE' : 
                     systemStatus === 'alert' ? 'ALERT' : 
                     'COMBAT'}
                  </span>
                </div>
                
                {/* User Info */}
                <div className="text-right bg-black/50 px-3 py-2 rounded-lg border border-gray-700/50">
                  <div className="text-sm font-mono">
                    <span className="text-red-400">{currentUser?.name}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    <span className="text-red-400">{currentUser?.clearance}</span> | {currentUser?.role}
                  </div>
                </div>
                
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all font-mono border border-red-500/50 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>LOGOUT</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-black/60 backdrop-blur-sm border-b border-gray-800/50">
          <div className="container mx-auto px-6">
            <nav className="flex space-x-0">
              {[
                { id: 'dashboard', label: 'SOC Dashboard', icon: Activity },
                { id: 'threats', label: 'Incident Response', icon: AlertTriangle },
                { id: 'tools', label: 'Security Tools', icon: Settings },
                { id: 'hunting', label: 'Threat Hunting', icon: Search },
                { id: 'learning', label: 'Training Academy', icon: Book },
                { id: 'hardening', label: 'Security Hardening', icon: ShieldCheck }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-all font-mono ${
                    activeTab === id
                      ? 'border-red-500 text-red-400 bg-red-500/5'
                      : 'border-transparent text-gray-400 hover:text-red-300 hover:border-red-800 hover:bg-red-500/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          {/* SOC Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-red-400 font-mono">SECURITY OPERATIONS CENTER</h2>
                <div className="flex items-center space-x-4">
                  {/* Notification Bell */}
                  <div className="relative">
                    <button 
                      onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                      className="relative p-2 bg-black/50 rounded-lg border border-orange-500/50 hover:bg-orange-500/10 transition-all"
                    >
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                      {notifications.filter(n => !n.read).length > 0 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      )}
                    </button>
                    {notifications.length > 0 && (
                      <div className="absolute right-0 top-12 w-80 bg-black/90 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-xl z-50">
                        <div className="p-4">
                          <h3 className="text-sm font-mono text-red-400 mb-3">RECENT ALERTS</h3>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {notifications.map(notification => (
                              <div key={notification.id} className={`p-2 rounded border-l-2 ${
                                notification.type === 'Critical' ? 'border-red-500 bg-red-500/10' :
                                notification.type === 'High' ? 'border-orange-500 bg-orange-500/10' :
                                'border-yellow-500 bg-yellow-500/10'
                              }`}>
                                <div className="text-xs font-mono text-white">{notification.message}</div>
                                <div className="text-xs text-gray-400 mt-1">{notification.time}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Sound Toggle */}
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`p-2 rounded-lg border transition-all ${
                      soundEnabled 
                        ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                        : 'bg-gray-500/20 border-gray-500/50 text-gray-400'
                    }`}
                  >
                    🔊
                  </button>
                </div>
              </div>

              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 shadow-lg shadow-green-500/10 animate-pulse-glow">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-8 h-8 text-green-400" />
                    <div>
                      <div className="text-2xl font-bold text-green-400 font-mono">{securityTools.filter(t => t.status === 'active').length}</div>
                      <div className="text-sm text-gray-300 font-mono">TOOLS ACTIVE</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 shadow-lg shadow-blue-500/10">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-8 h-8 text-blue-400" />
                    <div>
                      <div className="text-2xl font-bold text-blue-400 font-mono">{recentThreats.length}</div>
                      <div className="text-sm text-gray-300 font-mono">THREATS DETECTED</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30 shadow-lg shadow-orange-500/10">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-8 h-8 text-orange-400" />
                    <div>
                      <div className="text-2xl font-bold text-orange-400 font-mono">{alertCount}</div>
                      <div className="text-sm text-gray-300 font-mono">TOTAL ALERTS</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-lg shadow-purple-500/10">
                  <div className="flex items-center space-x-3">
                    <Database className="w-8 h-8 text-purple-400" />
                    <div>
                      <div className="text-2xl font-bold text-purple-400 font-mono">
                        {securityTools.reduce((acc, tool) => acc + (tool.events || tool.logs || tool.threats || 0), 0)}
                      </div>
                      <div className="text-sm text-gray-300 font-mono">EVENTS PROCESSED</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Threat Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Threat Trend Chart */}
                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 shadow-lg shadow-blue-500/10">
                  <h3 className="text-lg font-bold text-blue-400 font-mono mb-4 flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>THREAT ACTIVITY TRENDS</span>
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dashboardData.threatTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                        <YAxis stroke="#9CA3AF" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#000', 
                            border: '1px solid #374151', 
                            borderRadius: '8px',
                            color: '#fff'
                          }} 
                        />
                        <Area type="monotone" dataKey="threats" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                        <Area type="monotone" dataKey="blocked" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                        <Area type="monotone" dataKey="mitigated" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Threat Severity Distribution */}
                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-lg shadow-purple-500/10">
                  <h3 className="text-lg font-bold text-purple-400 font-mono mb-4 flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>THREAT SEVERITY DISTRIBUTION</span>
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dashboardData.severityDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {dashboardData.severityDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#000', 
                            border: '1px solid #374151', 
                            borderRadius: '8px',
                            color: '#fff'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {dashboardData.severityDistribution.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm font-mono text-gray-300">{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Real-time Threat Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-red-500/30 shadow-lg shadow-red-500/10">
                  <h3 className="text-lg font-bold text-red-400 font-mono mb-4 flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>LIVE THREAT FEED</span>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-auto"></div>
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {recentThreats.map(threat => (
                      <div key={threat.id} className="p-3 bg-black/40 rounded-lg border border-gray-700/50 hover:border-red-500/30 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-mono font-medium">{threat.type}</span>
                          <span className={`px-2 py-1 rounded text-xs font-mono ${
                            threat.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                            threat.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                            threat.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {threat.severity}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400 font-mono">
                          <span>{threat.source}</span>
                          <span className={`${
                            threat.status === 'Blocked' ? 'text-green-400' :
                            threat.status === 'Mitigating' ? 'text-yellow-400' :
                            'text-blue-400'
                          }`}>
                            {threat.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 font-mono mt-1">{threat.time}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Performance */}
                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 shadow-lg shadow-blue-500/10">
                  <h3 className="text-lg font-bold text-blue-400 font-mono mb-4 flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>SYSTEM PERFORMANCE</span>
                  </h3>
                  <div className="space-y-3">
                    {securityTools.slice(0, 4).map((tool, index) => (
                      <div key={index} className="p-3 bg-black/40 rounded-lg border border-gray-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-mono text-sm">{tool.icon} {tool.name}</span>
                          <span className={`px-2 py-1 rounded text-xs font-mono ${
                            tool.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            tool.status === 'scanning' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {tool.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                          <span>Performance: {tool.performance}%</span>
                          <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${
                                tool.performance >= 95 ? 'bg-green-400' :
                                tool.performance >= 85 ? 'bg-yellow-400' :
                                'bg-red-400'
                              }`}
                              style={{ width: `${tool.performance}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs content */}
          {activeTab === 'tools' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-blue-400 font-mono">SECURITY TOOLS MANAGEMENT</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-400 font-mono">REAL-TIME MONITORING</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {securityTools.map((tool, index) => (
                  <div key={index} className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 shadow-lg shadow-blue-500/10 hover:border-blue-400/50 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{tool.icon}</span>
                        <div>
                          <h3 className="text-lg font-bold text-white font-mono">{tool.name}</h3>
                          <div className={`text-xs font-mono ${
                            tool.status === 'active' ? 'text-green-400' :
                            tool.status === 'scanning' ? 'text-yellow-400' :
                            'text-gray-400'
                          }`}>
                            STATUS: {tool.status.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        tool.status === 'active' ? 'bg-green-400 animate-pulse' :
                        tool.status === 'scanning' ? 'bg-yellow-400 animate-pulse' :
                        'bg-gray-400'
                      }`}></div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-mono">
                        <span className="text-gray-300">Performance</span>
                        <span className={`${
                          tool.performance >= 95 ? 'text-green-400' :
                          tool.performance >= 85 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {tool.performance}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            tool.performance >= 95 ? 'bg-green-400' :
                            tool.performance >= 85 ? 'bg-yellow-400' :
                            'bg-red-400'
                          }`}
                          style={{ width: `${tool.performance}%` }}
                        ></div>
                      </div>
                      
                      {tool.threats && (
                        <div className="flex justify-between text-sm font-mono">
                          <span className="text-gray-300">Threats Detected</span>
                          <span className="text-red-400">{tool.threats}</span>
                        </div>
                      )}
                      {tool.events && (
                        <div className="flex justify-between text-sm font-mono">
                          <span className="text-gray-300">Events Processed</span>
                          <span className="text-blue-400">{tool.events.toLocaleString()}</span>
                        </div>
                      )}
                      {tool.logs && (
                        <div className="flex justify-between text-sm font-mono">
                          <span className="text-gray-300">Logs Analyzed</span>
                          <span className="text-green-400">{tool.logs.toLocaleString()}</span>
                        </div>
                      )}
                      {tool.agents && (
                        <div className="flex justify-between text-sm font-mono">
                          <span className="text-gray-300">Active Agents</span>
                          <span className="text-purple-400">{tool.agents}</span>
                        </div>
                      )}
                      {tool.targets && (
                        <div className="flex justify-between text-sm font-mono">
                          <span className="text-gray-300">Scan Targets</span>
                          <span className="text-orange-400">{tool.targets}</span>
                        </div>
                      )}
                      {tool.exploits && (
                        <div className="flex justify-between text-sm font-mono">
                          <span className="text-gray-300">Available Exploits</span>
                          <span className="text-red-400">{tool.exploits.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 py-2 px-3 bg-blue-500/20 text-blue-400 rounded border border-blue-500/50 hover:bg-blue-500/30 transition-all text-xs font-mono">
                        CONFIGURE
                      </button>
                      <button className="flex-1 py-2 px-3 bg-green-500/20 text-green-400 rounded border border-green-500/50 hover:bg-green-500/30 transition-all text-xs font-mono">
                        VIEW LOGS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'learning' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-green-400 font-mono">CYBERSECURITY TRAINING ACADEMY</h2>
                <div className="flex items-center space-x-2">
                  <Book className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-green-400 font-mono">SKILL DEVELOPMENT</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trainingModules.map((module) => (
                  <div key={module.id} className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 shadow-lg shadow-green-500/10 hover:border-green-400/50 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white font-mono mb-2">{module.title}</h3>
                        <div className="flex items-center space-x-4 text-sm font-mono">
                          <span className={`px-2 py-1 rounded ${
                            module.difficulty === 'Expert' ? 'bg-red-500/20 text-red-400' :
                            module.difficulty === 'Intermediate' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {module.difficulty}
                          </span>
                          <span className="text-gray-400">{module.duration}</span>
                          <span className="text-blue-400">{module.type}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-400 font-mono">{module.progress}%</div>
                        <div className="text-xs text-gray-400 font-mono">PROGRESS</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4 font-mono">{module.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 font-mono mb-1">
                        <span>Progress</span>
                        <span>{module.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-400 transition-all duration-1000"
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 py-2 px-3 bg-green-500/20 text-green-400 rounded border border-green-500/50 hover:bg-green-500/30 transition-all text-xs font-mono">
                        {module.progress > 0 ? 'CONTINUE' : 'START MODULE'}
                      </button>
                      <button className="px-3 py-2 bg-gray-500/20 text-gray-400 rounded border border-gray-500/50 hover:bg-gray-500/30 transition-all text-xs font-mono">
                        INFO
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-lg shadow-purple-500/10">
                <h3 className="text-lg font-bold text-purple-400 font-mono mb-4">ACHIEVEMENT SYSTEM</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-black/40 rounded-lg border border-gray-700/50">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🏆</div>
                      <div className="text-sm font-mono text-yellow-400">THREAT HUNTER</div>
                      <div className="text-xs text-gray-400 font-mono">Complete 5 hunting modules</div>
                    </div>
                  </div>
                  <div className="p-4 bg-black/40 rounded-lg border border-gray-700/50">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🛡️</div>
                      <div className="text-sm font-mono text-blue-400">DEFENDER</div>
                      <div className="text-xs text-gray-400 font-mono">Master incident response</div>
                    </div>
                  </div>
                  <div className="p-4 bg-black/40 rounded-lg border border-gray-700/50">
                    <div className="text-center">
                      <div className="text-2xl mb-2">💀</div>
                      <div className="text-sm font-mono text-red-400">RED TEAM</div>
                      <div className="text-xs text-gray-400 font-mono">Complete offensive modules</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hunting' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-orange-400 font-mono">THREAT HUNTING OPERATIONS</h2>
                <div className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-orange-400" />
                  <span className="text-sm text-orange-400 font-mono">PROACTIVE DEFENSE</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30 shadow-lg shadow-orange-500/10">
                    <h3 className="text-lg font-bold text-orange-400 font-mono mb-4">HUNTING QUERIES</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-black/40 rounded-lg border border-gray-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-mono text-sm">Suspicious PowerShell Activity</span>
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-mono">HIGH PRIORITY</span>
                        </div>
                        <div className="text-xs text-gray-400 font-mono">process_name:powershell.exe AND command_line:*-encodedcommand*</div>
                        <div className="flex justify-between mt-2 text-xs font-mono">
                          <span className="text-gray-400">Last run: 2 minutes ago</span>
                          <span className="text-red-400">23 matches</span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-black/40 rounded-lg border border-gray-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-mono text-sm">Lateral Movement Detection</span>
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-mono">MEDIUM</span>
                        </div>
                        <div className="text-xs text-gray-400 font-mono">network_protocol:smb AND destination_port:445</div>
                        <div className="flex justify-between mt-2 text-xs font-mono">
                          <span className="text-gray-400">Last run: 5 minutes ago</span>
                          <span className="text-yellow-400">8 matches</span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-black/40 rounded-lg border border-gray-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-mono text-sm">Persistence Mechanisms</span>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-mono">LOW</span>
                        </div>
                        <div className="text-xs text-gray-400 font-mono">registry_path:*\\Run* OR registry_path:*\\RunOnce*</div>
                        <div className="flex justify-between mt-2 text-xs font-mono">
                          <span className="text-gray-400">Last run: 10 minutes ago</span>
                          <span className="text-green-400">2 matches</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 shadow-lg shadow-blue-500/10">
                    <h3 className="text-lg font-bold text-blue-400 font-mono mb-4">MITRE ATT&CK TECHNIQUES</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 bg-black/40 rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-all cursor-pointer">
                        <div className="font-mono text-sm text-white">T1059.001</div>
                        <div className="font-mono text-xs text-blue-400">PowerShell</div>
                        <div className="font-mono text-xs text-gray-400">Command and Scripting Interpreter</div>
                      </div>
                      <div className="p-3 bg-black/40 rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-all cursor-pointer">
                        <div className="font-mono text-sm text-white">T1021.002</div>
                        <div className="font-mono text-xs text-blue-400">SMB/Windows Admin Shares</div>
                        <div className="font-mono text-xs text-gray-400">Remote Services</div>
                      </div>
                      <div className="p-3 bg-black/40 rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-all cursor-pointer">
                        <div className="font-mono text-sm text-white">T1547.001</div>
                        <div className="font-mono text-xs text-blue-400">Registry Run Keys</div>
                        <div className="font-mono text-xs text-gray-400">Boot or Logon Autostart</div>
                      </div>
                      <div className="p-3 bg-black/40 rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-all cursor-pointer">
                        <div className="font-mono text-sm text-white">T1055</div>
                        <div className="font-mono text-xs text-blue-400">Process Injection</div>
                        <div className="font-mono text-xs text-gray-400">Defense Evasion</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-lg shadow-purple-500/10">
                    <h3 className="text-lg font-bold text-purple-400 font-mono mb-4">HUNT STATISTICS</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-mono text-sm">Active Hunts</span>
                        <span className="text-purple-400 font-mono text-lg">12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-mono text-sm">IOCs Tracked</span>
                        <span className="text-blue-400 font-mono text-lg">847</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-mono text-sm">Threats Found</span>
                        <span className="text-red-400 font-mono text-lg">23</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-mono text-sm">False Positives</span>
                        <span className="text-yellow-400 font-mono text-lg">156</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 shadow-lg shadow-green-500/10">
                    <h3 className="text-lg font-bold text-green-400 font-mono mb-4">THREAT INTELLIGENCE</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-black/40 rounded-lg border border-gray-700/50">
                        <div className="font-mono text-sm text-white">APT29 IOCs</div>
                        <div className="font-mono text-xs text-gray-400">Updated 2 hours ago</div>
                        <div className="font-mono text-xs text-green-400">Status: Active</div>
                      </div>
                      <div className="p-3 bg-black/40 rounded-lg border border-gray-700/50">
                        <div className="font-mono text-sm text-white">Ransomware Signatures</div>
                        <div className="font-mono text-xs text-gray-400">Updated 4 hours ago</div>
                        <div className="font-mono text-xs text-green-400">Status: Active</div>
                      </div>
                      <div className="p-3 bg-black/40 rounded-lg border border-gray-700/50">
                        <div className="font-mono text-sm text-white">C2 Domains</div>
                        <div className="font-mono text-xs text-gray-400">Updated 1 hour ago</div>
                        <div className="font-mono text-xs text-green-400">Status: Active</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'threats' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-red-400 font-mono">INCIDENT RESPONSE CENTER</h2>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-sm text-red-400 font-mono">ACTIVE MONITORING</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-red-500/30 shadow-lg shadow-red-500/10">
                  <h3 className="text-lg font-bold text-red-400 font-mono mb-4">ACTIVE INCIDENTS</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-black/40 rounded-lg border border-red-500/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-mono font-medium">INC-2024-001</span>
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-mono">CRITICAL</span>
                      </div>
                      <div className="text-sm text-gray-300 font-mono mb-2">Suspected APT Activity - Lateral Movement Detected</div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">Opened: 23 minutes ago</span>
                        <span className="text-red-400">Assigned: Ghost Operator</span>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded border border-red-500/50 hover:bg-red-500/30 transition-all text-xs font-mono">
                          ESCALATE
                        </button>
                        <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded border border-blue-500/50 hover:bg-blue-500/30 transition-all text-xs font-mono">
                          INVESTIGATE
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-black/40 rounded-lg border border-orange-500/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-mono font-medium">INC-2024-002</span>
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-mono">HIGH</span>
                      </div>
                      <div className="text-sm text-gray-300 font-mono mb-2">Malware Execution - Process Injection Detected</div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">Opened: 1 hour ago</span>
                        <span className="text-orange-400">Assigned: Agent 47</span>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <button className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded border border-orange-500/50 hover:bg-orange-500/30 transition-all text-xs font-mono">
                          CONTAIN
                        </button>
                        <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded border border-blue-500/50 hover:bg-blue-500/30 transition-all text-xs font-mono">
                          ANALYZE
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 shadow-lg shadow-blue-500/10">
                  <h3 className="text-lg font-bold text-blue-400 font-mono mb-4">RESPONSE PLAYBOOKS</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-black/40 rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-all cursor-pointer">
                      <div className="font-mono text-sm text-white">Malware Incident Response</div>
                      <div className="font-mono text-xs text-gray-400">8 steps • Est. 45 minutes</div>
                      <div className="font-mono text-xs text-blue-400 mt-1">Isolate → Analyze → Contain → Eradicate</div>
                    </div>
                    
                    <div className="p-3 bg-black/40 rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-all cursor-pointer">
                      <div className="font-mono text-sm text-white">Data Breach Response</div>
                      <div className="font-mono text-xs text-gray-400">12 steps • Est. 2 hours</div>
                      <div className="font-mono text-xs text-blue-400 mt-1">Assess → Notify → Investigate → Recover</div>
                    </div>
                    
                    <div className="p-3 bg-black/40 rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-all cursor-pointer">
                      <div className="font-mono text-sm text-white">DDoS Mitigation</div>
                      <div className="font-mono text-xs text-gray-400">6 steps • Est. 30 minutes</div>
                      <div className="font-mono text-xs text-blue-400 mt-1">Detect → Filter → Scale → Monitor</div>
                    </div>
                    
                    <div className="p-3 bg-black/40 rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-all cursor-pointer">
                      <div className="font-mono text-sm text-white">Phishing Campaign</div>
                      <div className="font-mono text-xs text-gray-400">10 steps • Est. 90 minutes</div>
                      <div className="font-mono text-xs text-blue-400 mt-1">Block → Identify → Remediate → Educate</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 shadow-lg shadow-green-500/10">
                <h3 className="text-lg font-bold text-green-400 font-mono mb-4">INCIDENT TIMELINE</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-mono text-sm text-white">Critical Alert: Suspicious PowerShell Execution</div>
                          <div className="font-mono text-xs text-gray-400">Host: DESKTOP-ABC123 | User: john.doe</div>
                        </div>
                        <div className="font-mono text-xs text-red-400">10:23:45</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-mono text-sm text-white">Network Connection Blocked</div>
                          <div className="font-mono text-xs text-gray-400">Destination: 185.23.45.67:443 | Protocol: HTTPS</div>
                        </div>
                        <div className="font-mono text-xs text-orange-400">10:21:32</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-mono text-sm text-white">File Quarantined</div>
                          <div className="font-mono text-xs text-gray-400">Path: C:\\Users\\john.doe\\Downloads\\invoice.exe</div>
                        </div>
                        <div className="font-mono text-xs text-blue-400">10:19:15</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hardening' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-purple-400 font-mono">SECURITY HARDENING CENTER</h2>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-purple-400 font-mono">COMPLIANCE & HARDENING</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-lg shadow-purple-500/10">
                  <h3 className="text-lg font-bold text-purple-400 font-mono mb-4">HARDENING RECOMMENDATIONS</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-black/40 rounded-lg border border-red-500/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm text-white">Disable SMBv1 Protocol</span>
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-mono">CRITICAL</span>
                      </div>
                      <div className="text-xs text-gray-400 font-mono mb-2">
                        Legacy SMBv1 protocol detected on 23 systems. Vulnerable to EternalBlue attacks.
                      </div>
                      <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded border border-red-500/50 hover:bg-red-500/30 transition-all text-xs font-mono">
                        APPLY FIX
                      </button>
                    </div>
                    
                    <div className="p-4 bg-black/40 rounded-lg border border-orange-500/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm text-white">Enable Windows Defender ATP</span>
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-mono">HIGH</span>
                      </div>
                      <div className="text-xs text-gray-400 font-mono mb-2">
                        Advanced threat protection not enabled on 12 endpoints.
                      </div>
                      <button className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded border border-orange-500/50 hover:bg-orange-500/30 transition-all text-xs font-mono">
                        CONFIGURE
                      </button>
                    </div>
                    
                    <div className="p-4 bg-black/40 rounded-lg border border-yellow-500/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm text-white">Update PowerShell to v7+</span>
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-mono">MEDIUM</span>
                      </div>
                      <div className="text-xs text-gray-400 font-mono mb-2">
                        Outdated PowerShell versions detected with security vulnerabilities.
                      </div>
                      <button className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded border border-yellow-500/50 hover:bg-yellow-500/30 transition-all text-xs font-mono">
                        SCHEDULE
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 shadow-lg shadow-blue-500/10">
                  <h3 className="text-lg font-bold text-blue-400 font-mono mb-4">COMPLIANCE STATUS</h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-black/40 rounded-lg border border-gray-700/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-sm text-white">NIST Cybersecurity Framework</span>
                        <span className="font-mono text-lg text-green-400">87%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-400 transition-all duration-1000" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-black/40 rounded-lg border border-gray-700/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-sm text-white">CIS Controls v8</span>
                        <span className="font-mono text-lg text-yellow-400">73%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 transition-all duration-1000" style={{ width: '73%' }}></div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-black/40 rounded-lg border border-gray-700/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-sm text-white">ISO 27001</span>
                        <span className="font-mono text-lg text-orange-400">65%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400 transition-all duration-1000" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-black/40 rounded-lg border border-gray-700/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-sm text-white">GDPR Compliance</span>
                        <span className="font-mono text-lg text-green-400">92%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-400 transition-all duration-1000" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 shadow-lg shadow-green-500/10">
                <h3 className="text-lg font-bold text-green-400 font-mono mb-4">SECURITY BASELINE</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-400 font-mono">156</div>
                    <div className="text-sm text-gray-300 font-mono">Compliant Systems</div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400 font-mono">23</div>
                    <div className="text-sm text-gray-300 font-mono">Needs Attention</div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-400 font-mono">8</div>
                    <div className="text-sm text-gray-300 font-mono">Non-Compliant</div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400 font-mono">12</div>
                    <div className="text-sm text-gray-300 font-mono">Remediation Jobs</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!['dashboard', 'tools', 'learning', 'hunting', 'threats', 'hardening'].includes(activeTab) && (
            <div className="text-center py-12">
              <div className="relative">
                <Skull className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
                <div className="absolute -inset-2 bg-red-500/20 rounded-full blur-lg animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-red-400 font-mono mb-4">
                {activeTab.toUpperCase()} MODULE
              </h3>
              <p className="text-gray-300 font-mono mb-6">
                Module under development - Full features coming soon
              </p>
              <div className="text-sm text-gray-400 font-mono">
                Additional security operations capabilities
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShadowGuardian;
