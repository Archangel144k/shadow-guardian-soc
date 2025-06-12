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
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
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
  const dashboardData = {
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
  };

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
              </div>

              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 shadow-lg shadow-green-500/10">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-8 h-8 text-green-400" />
                    <div>
                      <div className="text-2xl font-bold text-green-400 font-mono">8</div>
                      <div className="text-sm text-gray-300 font-mono">TOOLS ACTIVE</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 shadow-lg shadow-blue-500/10">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-8 h-8 text-blue-400" />
                    <div>
                      <div className="text-2xl font-bold text-blue-400 font-mono">0</div>
                      <div className="text-sm text-gray-300 font-mono">INCIDENTS</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30 shadow-lg shadow-orange-500/10">
                  <div className="flex items-center space-x-3">
                    <Target className="w-8 h-8 text-orange-400" />
                    <div>
                      <div className="text-2xl font-bold text-orange-400 font-mono">23</div>
                      <div className="text-sm text-gray-300 font-mono">BLOCKED</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-lg shadow-purple-500/10">
                  <div className="flex items-center space-x-3">
                    <Database className="w-8 h-8 text-purple-400" />
                    <div>
                      <div className="text-2xl font-bold text-purple-400 font-mono">1.2M</div>
                      <div className="text-sm text-gray-300 font-mono">EVENTS</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Threat Trend Chart */}
                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-red-500/30 shadow-lg shadow-red-500/10">
                  <h3 className="text-xl font-bold text-red-400 mb-4 font-mono">THREAT TREND ANALYSIS</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={dashboardData.threatTrend}>
                      <defs>
                        <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis dataKey="time" stroke="#9CA3AF" style={{fontFamily: 'monospace', fontSize: '11px'}} />
                      <YAxis stroke="#9CA3AF" style={{fontFamily: 'monospace', fontSize: '11px'}} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                          border: '1px solid #EF4444',
                          borderRadius: '8px',
                          fontFamily: 'monospace',
                          fontSize: '12px'
                        }}
                      />
                      <Area type="monotone" dataKey="threats" stackId="1" stroke="#EF4444" fillOpacity={1} fill="url(#colorThreats)" />
                      <Area type="monotone" dataKey="blocked" stackId="1" stroke="#10B981" fillOpacity={1} fill="url(#colorBlocked)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Severity Distribution */}
                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 shadow-lg shadow-blue-500/10">
                  <h3 className="text-xl font-bold text-blue-400 mb-4 font-mono">THREAT SEVERITY</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={dashboardData.severityDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dashboardData.severityDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                          border: '1px solid #3B82F6',
                          borderRadius: '8px',
                          fontFamily: 'monospace',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {activeTab !== 'dashboard' && (
            <div className="text-center py-12">
              <div className="relative">
                <Skull className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
                <div className="absolute -inset-2 bg-red-500/20 rounded-full blur-lg animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-red-400 font-mono mb-4">
                {activeTab.toUpperCase()} MODULE
              </h3>
              <p className="text-gray-300 font-mono mb-6">
                {activeTab === 'threats' && 'Advanced incident response and threat analysis capabilities'}
                {activeTab === 'tools' && 'Enterprise security toolkit management and configuration'}
                {activeTab === 'hunting' && 'Proactive threat hunting and intelligence operations'}
                {activeTab === 'learning' && 'Cybersecurity training academy and skill development'}
                {activeTab === 'hardening' && 'System hardening recommendations and compliance'}
              </p>
              <div className="text-sm text-gray-400 font-mono">
                Module under development - Full features coming soon
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShadowGuardian;
