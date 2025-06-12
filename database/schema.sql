-- ================================================================
-- SHADOW GUARDIAN SOC PLATFORM - COMPLETE DATABASE SCHEMA
-- ================================================================
-- This file contains the complete database schema for the Shadow Guardian
-- Security Operations Center platform. All tables are already created in
-- your Supabase project, but this serves as documentation and backup.

-- ================================================================
-- 1. USER PROFILES TABLE
-- ================================================================
-- Stores extended user profile information beyond Supabase Auth
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'analyst',
    department TEXT NOT NULL DEFAULT 'security',
    clearance_level TEXT NOT NULL DEFAULT 'SECRET' CHECK (clearance_level IN ('PUBLIC', 'SECRET', 'CLASSIFIED', 'APEX')),
    avatar_url TEXT,
    bio TEXT,
    phone TEXT,
    location TEXT,
    timezone TEXT DEFAULT 'UTC',
    preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_department ON user_profiles(department);
CREATE INDEX IF NOT EXISTS idx_user_profiles_clearance ON user_profiles(clearance_level);

-- ================================================================
-- 2. SECURITY THREATS TABLE
-- ================================================================
-- Stores detected security threats and incidents
CREATE TABLE IF NOT EXISTS security_threats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- 'Malware', 'DDoS', 'Phishing', 'SQL Injection', etc.
    severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    status TEXT NOT NULL DEFAULT 'Detected' CHECK (status IN ('Detected', 'Investigating', 'Blocked', 'Mitigated', 'Resolved')),
    source_ip INET,
    target_ip INET,
    source_port INTEGER,
    target_port INTEGER,
    protocol TEXT,
    description TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    indicators JSONB DEFAULT '{}', -- IOCs, file hashes, etc.
    mitre_tactics TEXT[], -- MITRE ATT&CK tactics
    mitre_techniques TEXT[], -- MITRE ATT&CK techniques
    affected_systems TEXT[],
    response_actions JSONB DEFAULT '[]',
    assigned_to UUID REFERENCES user_profiles(id),
    user_id UUID REFERENCES user_profiles(id) NOT NULL,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_threats_type ON security_threats(type);
CREATE INDEX IF NOT EXISTS idx_security_threats_severity ON security_threats(severity);
CREATE INDEX IF NOT EXISTS idx_security_threats_status ON security_threats(status);
CREATE INDEX IF NOT EXISTS idx_security_threats_source_ip ON security_threats(source_ip);
CREATE INDEX IF NOT EXISTS idx_security_threats_created_at ON security_threats(created_at);
CREATE INDEX IF NOT EXISTS idx_security_threats_user_id ON security_threats(user_id);

-- ================================================================
-- 3. SECURITY TOOLS TABLE
-- ================================================================
-- Manages security tools and their status
CREATE TABLE IF NOT EXISTS security_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL, -- 'IDS', 'SIEM', 'Scanner', 'EDR', etc.
    vendor TEXT,
    version TEXT,
    status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'maintenance', 'error', 'scanning')),
    performance INTEGER DEFAULT 0 CHECK (performance >= 0 AND performance <= 100),
    icon TEXT DEFAULT '🔧',
    description TEXT,
    configuration JSONB DEFAULT '{}',
    metrics JSONB DEFAULT '{}', -- Current performance metrics
    endpoints TEXT[], -- URLs or IPs for the tool
    api_key TEXT, -- Encrypted API key for integration
    last_health_check TIMESTAMPTZ,
    alerts_enabled BOOLEAN DEFAULT true,
    installed_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_security_tools_name ON security_tools(name);
CREATE INDEX IF NOT EXISTS idx_security_tools_type ON security_tools(type);
CREATE INDEX IF NOT EXISTS idx_security_tools_status ON security_tools(status);

-- ================================================================
-- 4. TRAINING MODULES TABLE
-- ================================================================
-- Cybersecurity training and education content
CREATE TABLE IF NOT EXISTS training_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general', -- 'incident-response', 'threat-hunting', 'forensics', etc.
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    duration TEXT NOT NULL, -- e.g., "45 minutes", "2 hours"
    type TEXT NOT NULL CHECK (type IN ('Tutorial', 'Interactive Lab', 'Simulation', 'Assessment', 'Hands-on Lab')),
    content JSONB NOT NULL DEFAULT '{}', -- Module content, slides, exercises
    prerequisites TEXT[],
    learning_objectives TEXT[],
    tags TEXT[],
    author UUID REFERENCES user_profiles(id),
    is_published BOOLEAN DEFAULT false,
    is_mandatory BOOLEAN DEFAULT false,
    completion_criteria JSONB DEFAULT '{}',
    resources JSONB DEFAULT '[]', -- Links, files, references
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_training_modules_category ON training_modules(category);
CREATE INDEX IF NOT EXISTS idx_training_modules_difficulty ON training_modules(difficulty);
CREATE INDEX IF NOT EXISTS idx_training_modules_type ON training_modules(type);
CREATE INDEX IF NOT EXISTS idx_training_modules_published ON training_modules(is_published);

-- ================================================================
-- 5. USER PROGRESS TABLE
-- ================================================================
-- Tracks user progress through training modules
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    module_id UUID REFERENCES training_modules(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'failed')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    score INTEGER CHECK (score >= 0 AND score <= 100),
    time_spent INTEGER DEFAULT 0, -- in minutes
    attempts INTEGER DEFAULT 0,
    last_activity TIMESTAMPTZ,
    completion_data JSONB DEFAULT '{}', -- Quiz answers, lab results, etc.
    notes TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, module_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_module_id ON user_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_progress(status);

-- ================================================================
-- 6. SYSTEM METRICS TABLE
-- ================================================================
-- Stores system performance and security metrics
CREATE TABLE IF NOT EXISTS system_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type TEXT NOT NULL, -- 'threat_count', 'system_load', 'tool_performance', etc.
    metric_name TEXT NOT NULL,
    value NUMERIC NOT NULL,
    unit TEXT, -- 'count', 'percentage', 'bytes', 'ms', etc.
    tags JSONB DEFAULT '{}', -- Additional metadata
    source TEXT, -- Source system or tool
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for time-series queries
CREATE INDEX IF NOT EXISTS idx_system_metrics_type ON system_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_system_metrics_name ON system_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_system_metrics_timestamp ON system_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_metrics_source ON system_metrics(source);

-- ================================================================
-- ADDITIONAL FEATURES AND CONSTRAINTS
-- ================================================================

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_threats ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- ROW LEVEL SECURITY POLICIES
-- ================================================================

-- User Profiles: Users can view their own profile and admins can view all
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'soc_director')
        )
    );

-- Security Threats: Users can view threats based on clearance level
CREATE POLICY "Users can view threats based on clearance" ON security_threats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND clearance_level IN ('CLASSIFIED', 'APEX')
        )
        OR user_id = auth.uid()
    );

-- Training Modules: Published modules are visible to all authenticated users
CREATE POLICY "Authenticated users can view published modules" ON training_modules
    FOR SELECT USING (auth.role() = 'authenticated' AND is_published = true);

-- User Progress: Users can only see their own progress
CREATE POLICY "Users can view own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

-- ================================================================
-- FUNCTIONS AND TRIGGERS
-- ================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_threats_updated_at 
    BEFORE UPDATE ON security_threats 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_tools_updated_at 
    BEFORE UPDATE ON security_tools 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_modules_updated_at 
    BEFORE UPDATE ON training_modules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at 
    BEFORE UPDATE ON user_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- INITIAL DATA SEEDING (OPTIONAL)
-- ================================================================

-- Insert demo security tools
INSERT INTO security_tools (name, type, status, performance, icon, description, metrics) VALUES
    ('Suricata IDS', 'IDS', 'active', 98, '🛡️', 'Network intrusion detection system', '{"threats": 156}'),
    ('Elasticsearch', 'SIEM', 'active', 95, '🔍', 'Search and analytics engine', '{"events": 2847}'),
    ('Graylog SIEM', 'SIEM', 'active', 97, '📊', 'Log management platform', '{"logs": 15420}'),
    ('Wazuh HIDS', 'HIDS', 'active', 94, '🔒', 'Host-based intrusion detection', '{"agents": 847}'),
    ('NMAP Scanner', 'Scanner', 'scanning', 89, '🌐', 'Network discovery and security auditing', '{"targets": 256}'),
    ('Metasploit', 'Penetration Testing', 'standby', 100, '💥', 'Penetration testing framework', '{"exploits": 2134}')
ON CONFLICT (name) DO NOTHING;

-- Insert demo training modules
INSERT INTO training_modules (title, description, category, difficulty, duration, type, content, is_published) VALUES
    ('Advanced Threat Hunting', 'Learn advanced techniques for proactive threat hunting using MITRE ATT&CK framework', 'threat-hunting', 'Expert', '45 minutes', 'Interactive Lab', '{}', true),
    ('Incident Response Procedures', 'Practice incident response workflows and containment strategies', 'incident-response', 'Intermediate', '30 minutes', 'Simulation', '{}', true),
    ('Digital Forensics Fundamentals', 'Master the basics of digital forensics and evidence collection', 'forensics', 'Beginner', '60 minutes', 'Tutorial', '{}', true),
    ('Red Team Operations', 'Offensive security techniques and penetration testing methodologies', 'red-team', 'Expert', '90 minutes', 'Hands-on Lab', '{}', true),
    ('MITRE ATT&CK Framework', 'Understanding adversary tactics, techniques, and procedures', 'frameworks', 'Intermediate', '45 minutes', 'Tutorial', '{}', true),
    ('Malware Analysis Basics', 'Static and dynamic malware analysis techniques', 'malware', 'Advanced', '75 minutes', 'Interactive Lab', '{}', true)
ON CONFLICT DO NOTHING;

-- ================================================================
-- PERFORMANCE OPTIMIZATIONS
-- ================================================================

-- Create composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_threats_status_severity ON security_threats(status, severity);
CREATE INDEX IF NOT EXISTS idx_threats_created_type ON security_threats(created_at, type);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_status ON user_progress(user_id, status);
CREATE INDEX IF NOT EXISTS idx_metrics_type_timestamp ON system_metrics(metric_type, timestamp);

-- ================================================================
-- SCHEMA COMPLETE
-- ================================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
