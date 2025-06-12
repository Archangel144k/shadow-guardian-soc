# 🛡️ Shadow Guardian SOC - Supabase Integration Guide

This guide will help you set up Supabase as the backend for your Shadow Guardian SOC platform, enabling real-time authentication, threat monitoring, and data persistence.

## 🚀 Quick Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New Project"
3. Choose your organization and fill in:
   - **Project Name**: `shadow-guardian-soc`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
4. Click "Create new project"

### 2. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.local.example .env.local
```

2. In your Supabase project dashboard, go to **Settings** → **API**
3. Copy the following values to your `.env.local` file:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

### 3. Set Up Database Tables

Run the following SQL commands in your Supabase **SQL Editor**:

#### User Profiles Table
```sql
-- Create user profiles table
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  clearance_level TEXT CHECK (clearance_level IN ('PUBLIC', 'SECRET', 'CLASSIFIED', 'APEX')) DEFAULT 'PUBLIC',
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid()::text = id::text);
```

#### Security Threats Table
```sql
-- Create security threats table
CREATE TABLE security_threats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')) NOT NULL,
  source_ip TEXT NOT NULL,
  target_ip TEXT,
  description TEXT NOT NULL,
  status TEXT CHECK (status IN ('Active', 'Blocked', 'Mitigated', 'Investigating')) DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE security_threats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can view threats" ON security_threats
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create threats" ON security_threats
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update threats they created" ON security_threats
  FOR UPDATE USING (auth.uid() = user_id);
```

#### Security Tools Table
```sql
-- Create security tools table
CREATE TABLE security_tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive', 'maintenance', 'scanning', 'standby')) DEFAULT 'active',
  performance INTEGER CHECK (performance >= 0 AND performance <= 100) DEFAULT 100,
  version TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE security_tools ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Authenticated users can view tools" ON security_tools
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update tools" ON security_tools
  FOR UPDATE USING (auth.role() = 'authenticated');
```

#### Training Modules Table
```sql
-- Create training modules table
CREATE TABLE training_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')) NOT NULL,
  duration TEXT NOT NULL,
  type TEXT CHECK (type IN ('Tutorial', 'Simulation', 'Hands-on Lab', 'Assessment')) NOT NULL,
  description TEXT NOT NULL,
  content JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  module_id UUID REFERENCES training_modules(id),
  progress INTEGER CHECK (progress >= 0 AND progress <= 100) DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- Enable RLS
ALTER TABLE training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can view modules" ON training_modules
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view their own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);
```

#### System Metrics Table
```sql
-- Create system metrics table
CREATE TABLE system_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_type TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Authenticated users can view metrics" ON system_metrics
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can insert metrics" ON system_metrics
  FOR INSERT WITH CHECK (true);
```

### 4. Insert Demo Data

```sql
-- Insert demo security tools
INSERT INTO security_tools (name, type, status, performance, version) VALUES
('Suricata IDS', 'IDS/IPS', 'active', 98, '7.0.3'),
('Elasticsearch', 'SIEM', 'active', 95, '8.11.0'),
('Graylog', 'Log Management', 'active', 92, '5.2.0'),
('Wazuh', 'Host Monitoring', 'active', 89, '4.7.0'),
('Metasploit', 'Penetration Testing', 'standby', 100, '6.4.0'),
('Nmap', 'Network Discovery', 'active', 100, '7.94'),
('Wireshark', 'Network Analysis', 'standby', 100, '4.2.0'),
('OSSEC', 'Host Intrusion Detection', 'active', 87, '3.7.0');

-- Insert demo training modules
INSERT INTO training_modules (title, difficulty, duration, type, description) VALUES
('Cybersecurity Fundamentals', 'Beginner', '45 min', 'Tutorial', 'Learn the basics of cybersecurity, threat landscapes, and defense strategies'),
('Incident Response Procedures', 'Intermediate', '30 min', 'Simulation', 'Practice incident response workflows and containment strategies'),
('Digital Forensics Fundamentals', 'Beginner', '60 min', 'Tutorial', 'Master the basics of digital forensics and evidence collection'),
('Red Team Operations', 'Expert', '90 min', 'Hands-on Lab', 'Offensive security techniques and penetration testing methodologies'),
('SIEM Analytics', 'Intermediate', '40 min', 'Tutorial', 'Learn to analyze security events using SIEM tools'),
('Malware Analysis', 'Advanced', '75 min', 'Hands-on Lab', 'Reverse engineering and analyzing malicious software');

-- Insert demo threats
INSERT INTO security_threats (type, severity, source_ip, target_ip, description, status) VALUES
('DDoS Attack', 'High', '192.168.1.100', '10.0.0.5', 'Detected distributed denial of service attack from botnet', 'Active'),
('Malware Detection', 'Critical', '203.0.113.45', '10.0.0.12', 'Trojan.GenKD detected in email attachment', 'Investigating'),
('Brute Force', 'Medium', '198.51.100.23', '10.0.0.8', 'Multiple failed SSH login attempts detected', 'Blocked'),
('Data Exfiltration', 'Critical', '10.0.0.15', '8.8.8.8', 'Unusual outbound data transfer detected', 'Active'),
('Phishing Attempt', 'High', '192.0.2.78', '10.0.0.20', 'Suspicious email with malicious links detected', 'Mitigated');
```

### 5. Enable Real-time Features

In your Supabase dashboard:

1. Go to **Database** → **Replication**
2. Enable replication for tables you want real-time updates:
   - `security_threats`
   - `security_tools`
   - `user_progress`
   - `system_metrics`

### 6. Authentication Setup

1. Go to **Authentication** → **Settings**
2. Configure your **Site URL**: `http://localhost:5173` (for development)
3. Add **Redirect URLs** (for production deployment)
4. Enable **Email Confirmations** if desired

### 7. Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Try creating a user account or use demo mode
3. Check that real-time updates work when you modify data in Supabase

## 🔄 Demo Mode vs Live Mode

The application automatically detects whether Supabase is configured:

- **Live Mode**: When `VITE_SUPABASE_URL` is set, uses real Supabase authentication and data
- **Demo Mode**: Falls back to mock data and simulated authentication

You can force demo mode by adding `?demo=true` to the URL.

## 🛠️ Advanced Configuration

### Row Level Security (RLS)

All tables have RLS enabled for security. Users can only access data they own or have permission to view.

### Real-time Subscriptions

The app subscribes to real-time changes for:
- Security threats
- Tool status updates
- Training progress
- System metrics

### Custom Hooks

The app uses custom React hooks for data management:
- `useAuth()` - Authentication state
- `useThreats()` - Security threats
- `useSecurityTools()` - Tool monitoring
- `useTraining()` - Learning modules
- `useMetrics()` - System metrics

## 🚨 Security Best Practices

1. **Environment Variables**: Never commit `.env.local` to version control
2. **RLS Policies**: Always use Row Level Security in production
3. **API Keys**: Use the anon key for client-side, service key only for server-side
4. **HTTPS**: Always use HTTPS in production
5. **Rate Limiting**: Configure rate limiting in Supabase

## 📊 Monitoring

Monitor your Supabase usage in the dashboard:
- **Database** → **Usage** for storage and bandwidth
- **Auth** → **Users** for user activity
- **API** → **Logs** for debugging

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**: Add your domain to allowed origins in Supabase
2. **RLS Blocking Queries**: Check your RLS policies
3. **Environment Variables**: Ensure they start with `VITE_`
4. **Real-time Not Working**: Check replication settings

### Debug Mode

Add this to your `.env.local` for verbose logging:
```
VITE_APP_ENV=development
```

## 🔗 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)
- [React Integration](https://supabase.com/docs/guides/getting-started/tutorials/with-react)
