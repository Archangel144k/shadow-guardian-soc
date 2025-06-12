import { useState } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Skull, 
  Key, 
  User, 
  Database,
  Lock,
  LogOut
} from 'lucide-react';

// Shadow Guardian SOC Platform - Simplified Working Version
const ShadowGuardian = () => {
  // Demo mode authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStep, setAuthStep] = useState('login');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [mfaCode, setMfaCode] = useState(['', '', '', '', '', '']);
  const [authAttempts, setAuthAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [currentUser, setCurrentUser] = useState<{
    username: string;
    role: string;
    department: string;
    clearance: string;
    name?: string;
    mfaSecret?: string;
  } | null>(null);

  // Demo users database
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
    }
  };

  // Authentication functions
  const handleLogin = async () => {
    if (lockoutTime > 0) return;

    const user = users[loginData.username.toLowerCase() as keyof typeof users];
    if (user && user.password === loginData.password) {
      setCurrentUser({ username: loginData.username, role: user.role, department: user.department, clearance: user.clearance, name: user.name, mfaSecret: user.mfaSecret });
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
    if (enteredCode === currentUser?.mfaSecret) {
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
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 via-black to-black"></div>
        </div>

        {/* Scanline Effect */}
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-pulse"></div>
        </div>

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
                    disabled={lockoutTime > 0 || !loginData.username || !loginData.password}
                    className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95 font-mono"
                  >
                    {lockoutTime > 0 ? `LOCKED (${lockoutTime}s)` : 'AUTHENTICATE'}
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <div className="text-xs text-gray-400 font-mono">
                    <div className="mb-2">DEMO CREDENTIALS:</div>
                    <div>shadowadmin / StealthOp2024!</div>
                    <div>ghostoperator / Phantom2024#</div>
                  </div>
                </div>
              </div>
            )}

            {/* MFA Form */}
            {authStep === 'mfa' && (
              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-orange-500/30 shadow-lg shadow-orange-500/10">
                <div className="flex items-center space-x-2 mb-6">
                  <Shield className="w-5 h-5 text-orange-400" />
                  <h2 className="text-xl font-bold text-orange-400 font-mono">MULTI-FACTOR AUTHENTICATION</h2>
                </div>
                
                <p className="text-gray-300 font-mono text-sm mb-6">
                  Enter your 6-digit authentication code
                </p>

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
                  className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95 font-mono"
                >
                  VERIFY ACCESS
                </button>

                <div className="mt-4 text-center">
                  <div className="text-xs text-gray-400 font-mono">
                    Demo MFA: {currentUser?.mfaSecret}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-black to-red-900/10"></div>
      </div>

      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-pulse"></div>
      </div>

      <div className="relative z-20">
        {/* Header */}
        <div className="bg-black/80 backdrop-blur-sm border-b border-red-500/30">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Skull className="w-8 h-8 text-red-500 animate-pulse" />
                  <div className="absolute -inset-1 bg-red-500/20 rounded-full blur-sm animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-transparent font-mono">
                    SHADOW GUARDIAN
                  </h1>
                  <p className="text-xs text-gray-400 font-mono">SECURITY OPERATIONS CENTER</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
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
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/50 hover:bg-red-500/30 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-red-400 font-mono">SECURITY OPERATIONS CENTER</h2>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 shadow-lg shadow-green-500/10 animate-pulse-glow">
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
                    <div className="text-2xl font-bold text-blue-400 font-mono">23</div>
                    <div className="text-sm text-gray-300 font-mono">THREATS DETECTED</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30 shadow-lg shadow-orange-500/10">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-8 h-8 text-orange-400" />
                  <div>
                    <div className="text-2xl font-bold text-orange-400 font-mono">5</div>
                    <div className="text-sm text-gray-300 font-mono">ACTIVE ALERTS</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-lg shadow-purple-500/10">
                <div className="flex items-center space-x-3">
                  <Database className="w-8 h-8 text-purple-400" />
                  <div>
                    <div className="text-2xl font-bold text-purple-400 font-mono">1.2K</div>
                    <div className="text-sm text-gray-300 font-mono">EVENTS PROCESSED</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-green-500/30 shadow-lg shadow-green-500/10 text-center">
              <div className="relative">
                <Shield className="w-16 h-16 text-green-500 mx-auto mb-4 animate-pulse" />
                <div className="absolute -inset-2 bg-green-500/20 rounded-full blur-lg animate-pulse mx-auto"></div>
              </div>
              <h3 className="text-2xl font-bold text-green-400 font-mono mb-4">
                SHADOW GUARDIAN OPERATIONAL
              </h3>
              <p className="text-gray-300 font-mono mb-6">
                All systems online - Security monitoring active
              </p>
              <div className="text-sm text-gray-400 font-mono">
                Welcome to the simplified demo version of Shadow Guardian SOC
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShadowGuardian;