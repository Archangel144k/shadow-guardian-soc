-- ================================================================
-- SHADOW GUARDIAN SOC - SAMPLE DATA INSERTION
-- ================================================================
-- This script populates the database with realistic sample data
-- for testing and demonstration purposes.

-- ================================================================
-- SAMPLE USER PROFILES
-- ================================================================
-- Note: These would typically be created when users sign up through Supabase Auth
-- For demo purposes, we'll insert some sample profiles

-- Insert sample user profiles (adjust UUIDs as needed for your auth.users)
INSERT INTO user_profiles (id, email, username, full_name, role, department, clearance_level, bio) VALUES
    ('11111111-1111-1111-1111-111111111111', 'admin@shadowguardian.com', 'shadowadmin', 'Shadow Administrator', 'soc_director', 'cyber_command', 'APEX', 'SOC Director with over 15 years of cybersecurity experience'),
    ('22222222-2222-2222-2222-222222222222', 'ghost@shadowguardian.com', 'ghostoperator', 'Ghost Operator', 'senior_analyst', 'threat_intelligence', 'CLASSIFIED', 'Senior threat intelligence analyst specializing in APT tracking'),
    ('33333333-3333-3333-3333-333333333333', 'agent47@shadowguardian.com', 'agent47', 'Field Agent', 'field_operator', 'red_team', 'SECRET', 'Red team operator focused on penetration testing'),
    ('44444444-4444-4444-4444-444444444444', 'analyst@shadowguardian.com', 'analyst', 'Security Analyst', 'analyst', 'blue_team', 'SECRET', 'Junior security analyst working on incident response')
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    username = EXCLUDED.username,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    clearance_level = EXCLUDED.clearance_level,
    bio = EXCLUDED.bio;

-- ================================================================
-- SAMPLE SECURITY THREATS
-- ================================================================
INSERT INTO security_threats (type, severity, status, source_ip, target_ip, description, details, mitre_tactics, mitre_techniques, user_id) VALUES
    ('Malware', 'High', 'Blocked', '192.168.1.45', '10.0.0.100', 'Suspicious executable detected attempting to establish C2 communication', 
     '{"file_hash": "a1b2c3d4e5f6", "file_name": "invoice.exe", "detection_engine": "Windows Defender"}', 
     ARRAY['Execution', 'Command and Control'], ARRAY['T1059.001', 'T1071.001'], 
     '11111111-1111-1111-1111-111111111111'),
    
    ('DDoS', 'Critical', 'Mitigating', '203.45.67.89', '10.0.0.50', 'High volume traffic detected from multiple sources', 
     '{"request_rate": "10000/sec", "attack_type": "HTTP flood", "target_service": "web_server"}', 
     ARRAY['Impact'], ARRAY['T1498.001'], 
     '22222222-2222-2222-2222-222222222222'),
    
    ('Phishing', 'Medium', 'Investigating', '185.23.45.67', NULL, 'Suspicious email campaign targeting finance department', 
     '{"sender": "noreply@trusted-bank.net", "subject": "Account Security Alert", "attachment": "update.docm"}', 
     ARRAY['Initial Access'], ARRAY['T1566.001'], 
     '33333333-3333-3333-3333-333333333333'),
    
    ('SQL Injection', 'High', 'Blocked', '172.16.1.200', '10.0.0.25', 'SQL injection attempt detected on customer portal', 
     '{"payload": "1\' OR 1=1--", "target_endpoint": "/api/customers", "user_agent": "sqlmap/1.6"}', 
     ARRAY['Initial Access'], ARRAY['T1190'], 
     '44444444-4444-4444-4444-444444444444'),
    
    ('Lateral Movement', 'Critical', 'Investigating', '10.0.0.45', '10.0.0.75', 'Suspicious SMB activity between internal hosts', 
     '{"protocol": "SMB", "port": "445", "technique": "Pass-the-Hash", "affected_accounts": ["service_account1"]}', 
     ARRAY['Lateral Movement'], ARRAY['T1021.002', 'T1550.002'], 
     '22222222-2222-2222-2222-222222222222'),
    
    ('Data Exfiltration', 'Critical', 'Investigating', '10.0.0.120', '8.8.8.8', 'Large data transfer to external IP detected', 
     '{"data_size": "2.5GB", "protocol": "HTTPS", "duration": "45 minutes", "file_types": ["xlsx", "pdf", "docx"]}', 
     ARRAY['Exfiltration'], ARRAY['T1041'], 
     '11111111-1111-1111-1111-111111111111'),
    
    ('Brute Force', 'Medium', 'Blocked', '203.0.113.42', '10.0.0.10', 'Multiple failed login attempts detected', 
     '{"attempts": 847, "target_service": "SSH", "usernames": ["admin", "root", "user"], "duration": "2 hours"}', 
     ARRAY['Credential Access'], ARRAY['T1110.001'], 
     '44444444-4444-4444-4444-444444444444'),
    
    ('Zero-Day Exploit', 'Critical', 'Investigating', '198.51.100.15', '10.0.0.85', 'Unknown vulnerability exploitation detected', 
     '{"cve": "UNKNOWN", "target_software": "Apache Struts", "exploit_signature": "custom_payload_v2"}', 
     ARRAY['Initial Access', 'Execution'], ARRAY['T1190', 'T1059'], 
     '11111111-1111-1111-1111-111111111111');

-- ================================================================
-- SAMPLE SECURITY TOOLS (Additional tools)
-- ================================================================
INSERT INTO security_tools (name, type, vendor, status, performance, icon, description, metrics) VALUES
    ('Splunk Enterprise', 'SIEM', 'Splunk Inc.', 'active', 96, '📈', 'Machine data analytics platform', '{"events_per_day": 50000000, "dashboards": 45}'),
    ('CrowdStrike Falcon', 'EDR', 'CrowdStrike', 'active', 99, '🦅', 'Endpoint detection and response platform', '{"endpoints": 1250, "detections": 89}'),
    ('Nessus Professional', 'Vulnerability Scanner', 'Tenable', 'active', 92, '🔍', 'Vulnerability assessment tool', '{"scans_completed": 156, "vulnerabilities": 2847}'),
    ('Wireshark', 'Network Analyzer', 'Wireshark Foundation', 'active', 88, '🌊', 'Network protocol analyzer', '{"packets_captured": 9847562, "protocols": 847}'),
    ('YARA', 'Malware Scanner', 'VirusTotal', 'active', 94, '🦠', 'Malware identification and classification', '{"rules": 15420, "scans": 8934}'),
    ('TheHive', 'Case Management', 'TheHive Project', 'active', 91, '🗂️', 'Security incident response platform', '{"cases": 234, "observables": 5678}')
ON CONFLICT (name) DO UPDATE SET
    type = EXCLUDED.type,
    vendor = EXCLUDED.vendor,
    status = EXCLUDED.status,
    performance = EXCLUDED.performance,
    description = EXCLUDED.description,
    metrics = EXCLUDED.metrics;

-- ================================================================
-- SAMPLE TRAINING MODULES (Additional modules)
-- ================================================================
INSERT INTO training_modules (title, description, category, difficulty, duration, type, content, is_published, learning_objectives, tags) VALUES
    ('Network Security Fundamentals', 'Essential concepts of network security including firewalls, IDS/IPS, and network segmentation', 'networking', 'Beginner', '60 minutes', 'Tutorial', '{}', true, 
     ARRAY['Understand firewall configurations', 'Learn IDS/IPS deployment', 'Master network segmentation'], 
     ARRAY['networking', 'firewall', 'ids', 'ips']),
    
    ('Cloud Security Best Practices', 'Security considerations for AWS, Azure, and GCP environments', 'cloud', 'Intermediate', '90 minutes', 'Interactive Lab', '{}', true,
     ARRAY['Implement IAM policies', 'Configure cloud monitoring', 'Secure cloud storage'], 
     ARRAY['cloud', 'aws', 'azure', 'gcp', 'iam']),
    
    ('Social Engineering Detection', 'Recognizing and preventing social engineering attacks', 'awareness', 'Beginner', '30 minutes', 'Simulation', '{}', true,
     ARRAY['Identify phishing attempts', 'Understand pretexting', 'Report suspicious activities'], 
     ARRAY['phishing', 'social-engineering', 'awareness']),
    
    ('Advanced Persistent Threats (APT)', 'Understanding APT groups, their TTPs, and detection strategies', 'threat-intelligence', 'Expert', '120 minutes', 'Tutorial', '{}', true,
     ARRAY['Analyze APT campaigns', 'Map TTPs to MITRE ATT&CK', 'Develop detection rules'], 
     ARRAY['apt', 'ttp', 'mitre', 'detection']),
    
    ('Crypto and Ransomware Analysis', 'Analyzing cryptocurrency transactions and ransomware behaviors', 'malware', 'Expert', '105 minutes', 'Hands-on Lab', '{}', true,
     ARRAY['Trace crypto transactions', 'Analyze ransomware samples', 'Develop recovery strategies'], 
     ARRAY['ransomware', 'cryptocurrency', 'blockchain', 'recovery'])
ON CONFLICT DO NOTHING;

-- ================================================================
-- SAMPLE USER PROGRESS
-- ================================================================
INSERT INTO user_progress (user_id, module_id, status, progress_percentage, score, time_spent, attempts) VALUES
    -- Shadow Admin progress
    ('11111111-1111-1111-1111-111111111111', 
     (SELECT id FROM training_modules WHERE title = 'Advanced Threat Hunting' LIMIT 1), 
     'completed', 100, 95, 42, 1),
    
    ('11111111-1111-1111-1111-111111111111', 
     (SELECT id FROM training_modules WHERE title = 'Incident Response Procedures' LIMIT 1), 
     'completed', 100, 98, 28, 1),
    
    -- Ghost Operator progress
    ('22222222-2222-2222-2222-222222222222', 
     (SELECT id FROM training_modules WHERE title = 'Advanced Threat Hunting' LIMIT 1), 
     'in_progress', 75, NULL, 35, 1),
    
    ('22222222-2222-2222-2222-222222222222', 
     (SELECT id FROM training_modules WHERE title = 'Advanced Persistent Threats (APT)' LIMIT 1), 
     'completed', 100, 92, 115, 1),
    
    -- Agent 47 progress
    ('33333333-3333-3333-3333-333333333333', 
     (SELECT id FROM training_modules WHERE title = 'Red Team Operations' LIMIT 1), 
     'in_progress', 25, NULL, 18, 1),
    
    -- Analyst progress
    ('44444444-4444-4444-4444-444444444444', 
     (SELECT id FROM training_modules WHERE title = 'Digital Forensics Fundamentals' LIMIT 1), 
     'in_progress', 60, NULL, 38, 1),
    
    ('44444444-4444-4444-4444-444444444444', 
     (SELECT id FROM training_modules WHERE title = 'Network Security Fundamentals' LIMIT 1), 
     'completed', 100, 87, 58, 2)
ON CONFLICT (user_id, module_id) DO UPDATE SET
    status = EXCLUDED.status,
    progress_percentage = EXCLUDED.progress_percentage,
    score = EXCLUDED.score,
    time_spent = EXCLUDED.time_spent,
    attempts = EXCLUDED.attempts;

-- ================================================================
-- SAMPLE SYSTEM METRICS
-- ================================================================
-- Generate metrics for the last 24 hours
INSERT INTO system_metrics (metric_type, metric_name, value, unit, source, timestamp) 
SELECT 
    metric_types.type,
    metric_types.name,
    (random() * metric_types.max_val + metric_types.min_val)::numeric(10,2),
    metric_types.unit,
    metric_types.source,
    NOW() - (interval '1 minute' * generate_series(0, 1440, 5)) -- Every 5 minutes for 24 hours
FROM (
    VALUES 
        ('threat_count', 'threats_detected', 0, 50, 'count', 'suricata'),
        ('threat_count', 'threats_blocked', 0, 45, 'count', 'firewall'),
        ('system_performance', 'cpu_usage', 10, 90, 'percentage', 'monitoring'),
        ('system_performance', 'memory_usage', 30, 80, 'percentage', 'monitoring'),
        ('system_performance', 'disk_usage', 40, 85, 'percentage', 'monitoring'),
        ('network_traffic', 'bytes_in', 1000000, 10000000, 'bytes', 'network_monitor'),
        ('network_traffic', 'bytes_out', 500000, 5000000, 'bytes', 'network_monitor'),
        ('tool_performance', 'suricata_performance', 85, 100, 'percentage', 'suricata'),
        ('tool_performance', 'elasticsearch_performance', 85, 100, 'percentage', 'elasticsearch'),
        ('security_events', 'login_attempts', 50, 500, 'count', 'auth_system'),
        ('security_events', 'failed_logins', 0, 25, 'count', 'auth_system')
) AS metric_types(type, name, min_val, max_val, unit, source);

-- ================================================================
-- DATA SEEDING COMPLETE
-- ================================================================

-- Update statistics for query optimization
ANALYZE user_profiles;
ANALYZE security_threats;
ANALYZE security_tools;
ANALYZE training_modules;
ANALYZE user_progress;
ANALYZE system_metrics;

-- Display summary of inserted data
SELECT 'Data Summary' as info;
SELECT 'User Profiles: ' || count(*) as count FROM user_profiles;
SELECT 'Security Threats: ' || count(*) as count FROM security_threats;
SELECT 'Security Tools: ' || count(*) as count FROM security_tools;
SELECT 'Training Modules: ' || count(*) as count FROM training_modules;
SELECT 'User Progress Records: ' || count(*) as count FROM user_progress;
SELECT 'System Metrics: ' || count(*) as count FROM system_metrics;
