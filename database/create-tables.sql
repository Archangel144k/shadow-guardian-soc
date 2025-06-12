-- ================================================================
-- SHADOW GUARDIAN SOC PLATFORM - EXECUTABLE DATABASE SCHEMA
-- ================================================================
-- Execute this in the Supabase Dashboard SQL Editor
-- URL: https://supabase.com/dashboard/project/qrgbhlujkjfbqvcybxbl/sql/new

-- ================================================================
-- 1. USER PROFILES TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Indexes for user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_department ON user_profiles(department);
CREATE INDEX IF NOT EXISTS idx_user_profiles_clearance ON user_profiles(clearance_level);

-- ================================================================
-- 2. SECURITY THREATS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS security_threats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    status TEXT NOT NULL DEFAULT 'Detected' CHECK (status IN ('Detected', 'Investigating', 'Blocked', 'Mitigated', 'Resolved')),
    source_ip TEXT,
    target_ip TEXT,
    source_port INTEGER,
    target_port INTEGER,
    protocol TEXT,
    description TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    indicators JSONB DEFAULT '{}',
    mitre_tactics TEXT[] DEFAULT '{}',
    mitre_techniques TEXT[] DEFAULT '{}',
    affected_systems TEXT[] DEFAULT '{}',
    response_actions JSONB DEFAULT '[]',
    assigned_to UUID REFERENCES user_profiles(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for security_threats
CREATE INDEX IF NOT EXISTS idx_security_threats_type ON security_threats(type);
CREATE INDEX IF NOT EXISTS idx_security_threats_severity ON security_threats(severity);
CREATE INDEX IF NOT EXISTS idx_security_threats_status ON security_threats(status);
CREATE INDEX IF NOT EXISTS idx_security_threats_created_at ON security_threats(created_at);

-- ================================================================
-- 3. SECURITY TOOLS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS security_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    vendor TEXT,
    version TEXT,
    status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'maintenance', 'error', 'scanning')),
    performance INTEGER DEFAULT 0 CHECK (performance >= 0 AND performance <= 100),
    icon TEXT DEFAULT '🔧',
    description TEXT,
    configuration JSONB DEFAULT '{}',
    metrics JSONB DEFAULT '{}',
    endpoints TEXT[] DEFAULT '{}',
    api_key TEXT,
    last_health_check TIMESTAMPTZ,
    alerts_enabled BOOLEAN DEFAULT true,
    installed_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for security_tools
CREATE INDEX IF NOT EXISTS idx_security_tools_name ON security_tools(name);
CREATE INDEX IF NOT EXISTS idx_security_tools_type ON security_tools(type);
CREATE INDEX IF NOT EXISTS idx_security_tools_status ON security_tools(status);

-- ================================================================
-- 4. TRAINING MODULES TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS training_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    duration TEXT NOT NULL,
    type TEXT NOT NULL,
    content JSONB DEFAULT '{}',
    learning_objectives TEXT[] DEFAULT '{}',
    prerequisites TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT false,
    author_id UUID REFERENCES user_profiles(id),
    thumbnail_url TEXT,
    video_url TEXT,
    completion_certificate BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for training_modules
CREATE INDEX IF NOT EXISTS idx_training_modules_category ON training_modules(category);
CREATE INDEX IF NOT EXISTS idx_training_modules_difficulty ON training_modules(difficulty);
CREATE INDEX IF NOT EXISTS idx_training_modules_published ON training_modules(is_published);

-- ================================================================
-- 5. USER PROGRESS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    module_id UUID REFERENCES training_modules(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    completed_at TIMESTAMPTZ,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    time_spent INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, module_id)
);

-- Indexes for user_progress
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_module_id ON user_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON user_progress(completed_at);

-- ================================================================
-- 6. SYSTEM METRICS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS system_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name TEXT NOT NULL,
    metric_value DECIMAL NOT NULL,
    metric_unit TEXT NOT NULL,
    category TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    source TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for system_metrics
CREATE INDEX IF NOT EXISTS idx_system_metrics_name ON system_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_system_metrics_category ON system_metrics(category);
CREATE INDEX IF NOT EXISTS idx_system_metrics_created_at ON system_metrics(created_at);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_threats ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;

-- User profiles: Users can read their own profile and admins can read all
CREATE POLICY "Users can read own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Security threats: Users can read all, but only create/update their own
CREATE POLICY "Users can read all threats" ON security_threats FOR SELECT USING (true);
CREATE POLICY "Users can insert threats" ON security_threats FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own threats" ON security_threats FOR UPDATE USING (true);

-- Security tools: Read access for all authenticated users
CREATE POLICY "Users can read security tools" ON security_tools FOR SELECT USING (true);
CREATE POLICY "Users can update security tools" ON security_tools FOR UPDATE USING (true);

-- Training modules: Public read access for published modules
CREATE POLICY "Users can read published modules" ON training_modules FOR SELECT USING (is_published = true);

-- User progress: Users can manage their own progress
CREATE POLICY "Users can manage own progress" ON user_progress FOR ALL USING (true);

-- System metrics: Read access for all authenticated users
CREATE POLICY "Users can read system metrics" ON system_metrics FOR SELECT USING (true);
CREATE POLICY "Users can insert system metrics" ON system_metrics FOR INSERT WITH CHECK (true);

-- ================================================================
-- FUNCTIONS AND TRIGGERS
-- ================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_security_threats_updated_at BEFORE UPDATE ON security_threats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_security_tools_updated_at BEFORE UPDATE ON security_tools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_training_modules_updated_at BEFORE UPDATE ON training_modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- COMPLETION MESSAGE
-- ================================================================
-- If you see this message, all tables have been created successfully!
-- Next step: Run the data population script to add sample data.
