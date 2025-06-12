import { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, AlertTriangle, ExternalLink, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SupabaseStatus {
  connected: boolean;
  error?: string;
  projectUrl?: string;
  hasUsers?: boolean;
  hasData?: boolean;
}

const SupabaseSetup = () => {
  const [status, setStatus] = useState<SupabaseStatus>({ connected: false });
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    checkSupabaseConnection();
  }, []);

  const checkSupabaseConnection = async () => {
    try {
      // Check if environment variables are set
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        setStatus({
          connected: false,
          error: 'Environment variables not configured'
        });
        setLoading(false);
        return;
      }

      if (!supabase) {
        setStatus({
          connected: false,
          error: 'Supabase client not initialized - check your configuration',
          projectUrl: import.meta.env.VITE_SUPABASE_URL
        });
        return;
      }

      // Test connection
      const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
      
      if (error) {
        setStatus({
          connected: false,
          error: error.message,
          projectUrl: import.meta.env.VITE_SUPABASE_URL
        });
      } else if (supabase) {
        // Check for data
        const { data: threatsData } = await supabase.from('security_threats').select('count').limit(1);
        const { data: toolsData } = await supabase.from('security_tools').select('count').limit(1);
        
        setStatus({
          connected: true,
          projectUrl: import.meta.env.VITE_SUPABASE_URL,
          hasUsers: data !== null,
          hasData: (threatsData !== null && toolsData !== null)
        });
      }
    } catch (err) {
      console.error('Supabase connection error:', err);
      setStatus({
        connected: false,
        error: 'Failed to connect to Supabase'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
        <div className="flex items-center space-x-3">
          <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="text-blue-400 font-mono">Checking Supabase connection...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <div className={`bg-black/60 backdrop-blur-sm rounded-xl p-6 border transition-all ${
        status.connected 
          ? 'border-green-500/30 shadow-lg shadow-green-500/10' 
          : 'border-red-500/30 shadow-lg shadow-red-500/10'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className={`w-6 h-6 ${status.connected ? 'text-green-400' : 'text-red-400'}`} />
            <div>
              <h3 className="text-lg font-mono font-bold text-white">Supabase Backend</h3>
              <p className={`text-sm font-mono ${status.connected ? 'text-green-400' : 'text-red-400'}`}>
                {status.connected ? 'Connected' : 'Not Connected'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {status.connected ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
            
            <button
              onClick={() => setShowSetup(!showSetup)}
              className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded border border-blue-500/50 hover:bg-blue-500/30 transition-all text-sm font-mono"
            >
              {showSetup ? 'Hide Setup' : 'Setup Guide'}
            </button>
          </div>
        </div>

        {status.error && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-mono text-sm">{status.error}</span>
            </div>
          </div>
        )}

        {status.connected && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="text-green-400 font-mono text-lg font-bold">
                {status.hasUsers ? '✓' : '○'}
              </div>
              <div className="text-green-400 font-mono text-xs">Tables Ready</div>
            </div>
            <div className="text-center p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="text-blue-400 font-mono text-lg font-bold">
                {status.hasData ? '✓' : '○'}
              </div>
              <div className="text-blue-400 font-mono text-xs">Demo Data</div>
            </div>
          </div>
        )}
      </div>

      {/* Setup Guide */}
      {showSetup && (
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h4 className="text-lg font-mono font-bold text-white mb-4">🚀 Supabase Setup Guide</h4>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-black rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <p className="text-white font-mono text-sm mb-2">Create a Supabase project at:</p>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-800 px-2 py-1 rounded text-blue-400 font-mono text-sm">https://supabase.com</code>
                  <button
                    onClick={() => window.open('https://supabase.com', '_blank')}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-black rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <p className="text-white font-mono text-sm mb-2">Copy your project credentials to <code className="bg-gray-800 px-1 rounded">.env.local</code>:</p>
                <div className="bg-gray-800 p-3 rounded-lg font-mono text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400">VITE_SUPABASE_URL=your_project_url</span>
                    <button onClick={() => copyToClipboard('VITE_SUPABASE_URL=your_project_url')}>
                      <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">VITE_SUPABASE_ANON_KEY=your_anon_key</span>
                    <button onClick={() => copyToClipboard('VITE_SUPABASE_ANON_KEY=your_anon_key')}>
                      <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-black rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <p className="text-white font-mono text-sm mb-2">Run the database setup scripts from:</p>
                <code className="bg-gray-800 px-2 py-1 rounded text-blue-400 font-mono text-sm">SUPABASE_INTEGRATION.md</code>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-black rounded-full flex items-center justify-center text-sm font-bold">4</div>
              <div>
                <p className="text-white font-mono text-sm">Restart the development server and refresh this page</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-mono text-sm font-bold">Demo Mode Available</span>
            </div>
            <p className="text-yellow-400 font-mono text-xs">
              You can use the app without Supabase in demo mode. Add <code>?demo=true</code> to the URL or the app will automatically fallback to demo mode.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupabaseSetup;
