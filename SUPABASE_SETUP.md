# Shadow Guardian SOC - Supabase Database Schema

## Required Tables and Setup

### 1. User Profiles Table
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
```

### 2. Security Threats Table
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

-- Create policy
CREATE POLICY "Authenticated users can view threats" ON security_threats
  FOR SELECT USING (auth.role() = 'authenticated');
```

### 3. Security Tools Table
```sql
-- Create security tools table
CREATE TABLE security_tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive', 'maintenance', 'scanning', 'standby')) DEFAULT 'active',
  performance INTEGER CHECK (performance >= 0 AND performance <= 100) DEFAULT 100,
  icon TEXT DEFAULT '🛡️',
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE security_tools ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Authenticated users can view tools" ON security_tools
  FOR SELECT USING (auth.role() = 'authenticated');
```

### 4. Training Modules Table
```sql
-- Create training modules table
CREATE TABLE training_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')) NOT NULL,
  duration TEXT NOT NULL,
  type TEXT NOT NULL,
  content JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE training_modules ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Authenticated users can view modules" ON training_modules
  FOR SELECT USING (auth.role() = 'authenticated');
```

### 5. User Progress Table
```sql
-- Create user progress table
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  module_id UUID REFERENCES training_modules(id) NOT NULL,
  progress INTEGER CHECK (progress >= 0 AND progress <= 100) DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, module_id)
);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can view their own progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);
```

### 6. System Metrics Table
```sql
-- Create system metrics table
CREATE TABLE system_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Authenticated users can view metrics" ON system_metrics
  FOR SELECT USING (auth.role() = 'authenticated');
```

### 7. Insert Sample Data
```sql
-- Insert sample security tools
INSERT INTO security_tools (name, status, performance, icon, metrics) VALUES
('Suricata IDS', 'active', 98, '🛡️', '{"threats": 156, "packets_processed": 1000000}'),
('Elasticsearch', 'active', 95, '🔍', '{"events": 2847, "storage_used": "45GB"}'),
('Graylog SIEM', 'active', 97, '📊', '{"logs": 15420, "sources": 127}'),
('Wazuh HIDS', 'active', 94, '🔒', '{"agents": 847, "alerts": 23}'),
('NMAP Scanner', 'scanning', 89, '🌐', '{"targets": 256, "scanned": 180}'),
('Metasploit', 'standby', 100, '💥', '{"exploits": 2134, "payloads": 567}');

-- Insert sample training modules
INSERT INTO training_modules (title, description, difficulty, duration, type) VALUES
('Advanced Threat Hunting', 'Learn advanced techniques for proactive threat hunting using MITRE ATT&CK framework', 'Expert', '45 min', 'Interactive Lab'),
('Incident Response Procedures', 'Practice incident response workflows and containment strategies', 'Intermediate', '30 min', 'Simulation'),
('Digital Forensics Fundamentals', 'Master the basics of digital forensics and evidence collection', 'Beginner', '60 min', 'Tutorial'),
('Red Team Operations', 'Offensive security techniques and penetration testing methodologies', 'Expert', '90 min', 'Hands-on Lab');

-- Insert sample threats
INSERT INTO security_threats (type, severity, source_ip, description, status) VALUES
('Malware', 'High', '192.168.1.45', 'Suspicious executable detected attempting to establish C2 connection', 'Blocked'),
('DDoS', 'Critical', '203.45.67.89', 'Large volume of traffic detected from external source', 'Mitigating'),
('Phishing', 'Medium', '185.23.45.67', 'Suspicious email with malicious attachment detected', 'Investigating'),
('SQL Injection', 'High', '172.16.0.100', 'Attempted SQL injection on web application login form', 'Blocked');
```

## Setup Instructions

1. **Create a new Supabase project** at https://supabase.com
2. **Copy your project URL and anon key** to the `.env` file
3. **Run the SQL commands above** in the Supabase SQL editor
4. **Enable Authentication** in your Supabase project settings
5. **Configure email templates** for user authentication (optional)

## Environment Variables Required

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
