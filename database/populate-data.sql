-- ================================================================
-- SHADOW GUARDIAN SOC PLATFORM - SAMPLE DATA POPULATION
-- ================================================================
-- Execute this AFTER running create-tables.sql
-- This will populate the database with realistic sample data

-- ================================================================
-- SAMPLE SECURITY TOOLS
-- ================================================================
INSERT INTO security_tools (name, type, vendor, status, performance, icon, description, metrics) VALUES
('Suricata IDS', 'IDS', 'Suricata', 'active', 98, '🛡️', 'Network intrusion detection system', '{"threats": 156, "events_per_day": 25000}'),
('Elasticsearch', 'SIEM', 'Elastic', 'active', 95, '🔍', 'Search and analytics engine for security data', '{"events": 2847, "indices": 45, "storage_gb": 2500}'),
('Graylog SIEM', 'SIEM', 'Graylog', 'active', 92, '📊', 'Centralized log management platform', '{"logs_per_second": 50000, "dashboards": 28, "alerts": 15}'),
('Wazuh HIDS', 'HIDS', 'Wazuh', 'active', 94, '🖥️', 'Host-based intrusion detection system', '{"agents": 500, "rules": 2500, "integrity_checks": 1500}'),
('Nessus Scanner', 'Scanner', 'Tenable', 'active', 89, '🔎', 'Vulnerability assessment scanner', '{"scans_completed": 45, "vulnerabilities": 234, "assets": 1200}'),
('Wireshark', 'Analyzer', 'Wireshark', 'active', 96, '📡', 'Network protocol analyzer', '{"packets_analyzed": 5000000, "protocols": 150, "sessions": 2500}'),
('OSSEC', 'HIDS', 'OSSEC', 'maintenance', 85, '🛠️', 'Open source host-based intrusion detection', '{"agents": 300, "active_rules": 1800, "alerts_today": 67}'),
('Splunk', 'SIEM', 'Splunk', 'active', 97, '⚡', 'Data platform for security operations', '{"data_indexed_gb": 5000, "searches_today": 1500, "dashboards": 85}');

-- ================================================================
-- SAMPLE TRAINING MODULES
-- ================================================================
INSERT INTO training_modules (title, description, category, difficulty, duration, type, content, learning_objectives, tags, is_published) VALUES
('Advanced Threat Hunting', 'Learn advanced techniques for proactive threat hunting using MITRE ATT&CK framework', 'threat-hunting', 'Expert', '45 minutes', 'Interactive Lab', '{"modules": ["MITRE ATT&CK Overview", "Hunt Hypothesis", "Data Analysis", "IOC Development"], "exercises": 3, "labs": 2}', ARRAY['Understand MITRE ATT&CK framework', 'Develop threat hunting hypotheses', 'Analyze security logs effectively', 'Create custom detection rules'], ARRAY['mitre', 'attack', 'hunting', 'detection'], true),

('Incident Response Procedures', 'Practice incident response workflows and containment strategies', 'incident-response', 'Intermediate', '30 minutes', 'Simulation', '{"scenarios": ["Malware Outbreak", "Data Breach", "DDoS Attack"], "playbooks": 4, "checklists": 6}', ARRAY['Follow IR procedures', 'Contain security incidents', 'Coordinate response teams', 'Document incident details'], ARRAY['incident', 'response', 'containment', 'forensics'], true),

('Digital Forensics Fundamentals', 'Master the basics of digital forensics and evidence collection', 'forensics', 'Beginner', '60 minutes', 'Tutorial', '{"topics": ["Evidence Handling", "File System Analysis", "Memory Forensics", "Network Forensics"], "tools": ["Autopsy", "Volatility", "Wireshark"], "exercises": 5}', ARRAY['Understand forensic methodology', 'Preserve digital evidence', 'Analyze file systems', 'Extract artifacts from memory'], ARRAY['forensics', 'evidence', 'analysis', 'investigation'], true),

('Red Team Operations', 'Offensive security techniques and penetration testing methodologies', 'red-team', 'Expert', '90 minutes', 'Hands-on Lab', '{"phases": ["Reconnaissance", "Initial Access", "Persistence", "Lateral Movement", "Exfiltration"], "tools": ["Metasploit", "Cobalt Strike", "Empire", "BloodHound"], "labs": 8}', ARRAY['Plan red team operations', 'Execute attack scenarios', 'Maintain persistence', 'Simulate advanced threats'], ARRAY['red-team', 'penetration', 'testing', 'offensive'], true),

('SIEM Administration', 'Configure and manage Security Information and Event Management systems', 'siem', 'Intermediate', '50 minutes', 'Tutorial', '{"sections": ["SIEM Architecture", "Log Sources", "Correlation Rules", "Dashboard Creation"], "tools": ["Splunk", "Elasticsearch", "Graylog"], "exercises": 4}', ARRAY['Configure SIEM platforms', 'Create correlation rules', 'Design security dashboards', 'Manage log sources'], ARRAY['siem', 'logs', 'correlation', 'monitoring'], true),

('Malware Analysis Basics', 'Introduction to static and dynamic malware analysis techniques', 'malware', 'Intermediate', '75 minutes', 'Lab Exercise', '{"techniques": ["Static Analysis", "Dynamic Analysis", "Behavioral Analysis", "Reverse Engineering"], "tools": ["IDA Pro", "Ghidra", "Wireshark", "Process Monitor"], "samples": 6}', ARRAY['Analyze malware samples', 'Use reverse engineering tools', 'Identify malware behavior', 'Create detection signatures'], ARRAY['malware', 'analysis', 'reverse-engineering', 'detection'], true);

-- ================================================================
-- SAMPLE SECURITY THREATS
-- ================================================================
INSERT INTO security_threats (type, severity, status, source_ip, target_ip, source_port, target_port, protocol, description, details, indicators, mitre_tactics, mitre_techniques, affected_systems, response_actions) VALUES
('Malware', 'High', 'Blocked', '192.168.1.45', '10.0.0.100', 49152, 443, 'HTTPS', 'Suspicious executable detected attempting to establish C2 communication', '{"file_hash": "a1b2c3d4e5f67890abcdef1234567890", "file_name": "invoice.exe", "file_size": "2.3MB", "detection_engine": "Windows Defender", "c2_domain": "malicious-domain.com", "encryption": "AES-256"}', '{"file_hashes": ["a1b2c3d4e5f67890abcdef1234567890"], "domains": ["malicious-domain.com"], "ips": ["192.168.1.45"]}', ARRAY['Execution', 'Command and Control'], ARRAY['T1059.001', 'T1071.001'], ARRAY['DESKTOP-ABC123'], '[{"action": "File quarantined", "timestamp": "2024-01-15T10:23:45Z", "user": "system"}, {"action": "Network blocked", "timestamp": "2024-01-15T10:23:47Z", "user": "firewall"}]'),

('DDoS', 'Critical', 'Mitigated', '203.0.113.45', '198.51.100.10', 80, 443, 'TCP', 'Large-scale DDoS attack targeting web infrastructure', '{"attack_type": "SYN Flood", "packets_per_second": 500000, "bandwidth": "2.5 Gbps", "attack_duration": "45 minutes", "geolocation": "Multiple countries", "botnet_size": "Estimated 50,000 bots"}', '{"ips": ["203.0.113.45", "203.0.113.46", "203.0.113.47"], "patterns": ["SYN_FLOOD", "HIGH_VOLUME"]}', ARRAY['Impact'], ARRAY['T1498.001'], ARRAY['WEB-SERVER-01', 'LOAD-BALANCER-01'], '[{"action": "Rate limiting activated", "timestamp": "2024-01-15T14:30:00Z", "user": "auto-defense"}, {"action": "Traffic filtered", "timestamp": "2024-01-15T14:30:15Z", "user": "firewall"}, {"action": "CDN protection enabled", "timestamp": "2024-01-15T14:32:00Z", "user": "ops-team"}]'),

('Phishing', 'Medium', 'Investigating', '172.16.0.25', '10.0.0.50', 587, 25, 'SMTP', 'Phishing email campaign targeting employee credentials', '{"sender": "noreply@fake-bank.com", "subject": "Urgent: Account Verification Required", "attachment": "account_verification.pdf", "recipients": 45, "click_rate": "12%", "credential_harvesting": "Active"}', '{"domains": ["fake-bank.com", "phishing-site.net"], "email_headers": ["X-Mailer: Mass Mailer Pro"], "urls": ["http://phishing-site.net/login"]}', ARRAY['Initial Access', 'Credential Access'], ARRAY['T1566.001', 'T1589.002'], ARRAY['MAIL-SERVER-01'], '[{"action": "Email quarantined", "timestamp": "2024-01-15T09:15:00Z", "user": "mail-filter"}, {"action": "Users notified", "timestamp": "2024-01-15T09:20:00Z", "user": "security-team"}]'),

('SQL Injection', 'High', 'Blocked', '203.0.113.100', '192.168.1.200', 3389, 3306, 'MySQL', 'SQL injection attack detected on web application database', '{"injection_type": "Union-based", "payload": "UNION SELECT username,password FROM users", "affected_table": "user_accounts", "vulnerability": "Unsanitized input field", "tool_detected": "WAF"}', '{"payloads": ["UNION SELECT", "OR 1=1", "DROP TABLE"], "user_agents": ["sqlmap/1.6.12"], "request_patterns": ["admin'\''OR 1=1--"]}', ARRAY['Initial Access'], ARRAY['T1190'], ARRAY['WEB-APP-01', 'DB-SERVER-01'], '[{"action": "Request blocked", "timestamp": "2024-01-15T16:45:00Z", "user": "waf"}, {"action": "IP blacklisted", "timestamp": "2024-01-15T16:45:02Z", "user": "firewall"}, {"action": "Security team alerted", "timestamp": "2024-01-15T16:45:05Z", "user": "system"}]'),

('Ransomware', 'Critical', 'Investigating', '10.0.0.75', '10.0.0.0/24', 445, 445, 'SMB', 'Ransomware encryption detected across multiple systems', '{"ransomware_family": "Conti", "encryption_algorithm": "AES-256", "ransom_note": "YOUR_FILES_ARE_ENCRYPTED.txt", "encrypted_files": 15000, "lateral_movement": "SMB shares", "payment_demand": "5 BTC"}', '{"file_extensions": [".conti", ".encrypted"], "ransom_notes": ["YOUR_FILES_ARE_ENCRYPTED.txt"], "processes": ["conti.exe", "encrypt.bat"], "registry_keys": ["HKLM\\\\SOFTWARE\\\\Conti"]}', ARRAY['Impact', 'Lateral Movement'], ARRAY['T1486', 'T1021.002'], ARRAY['FILE-SERVER-01', 'WORKSTATION-15', 'WORKSTATION-23', 'WORKSTATION-31'], '[{"action": "Network isolation", "timestamp": "2024-01-15T20:15:00Z", "user": "incident-response"}, {"action": "Backup verification", "timestamp": "2024-01-15T20:20:00Z", "user": "backup-team"}, {"action": "Forensic imaging", "timestamp": "2024-01-15T20:30:00Z", "user": "forensics-team"}]'),

('Privilege Escalation', 'High', 'Resolved', '10.0.0.45', '10.0.0.45', 0, 0, 'Local', 'Local privilege escalation attempt using kernel exploit', '{"exploit_name": "CVE-2021-34527", "vulnerability": "Print Spooler", "method": "DLL injection", "target_service": "spoolsv.exe", "success": false, "mitigation": "Patch applied"}', '{"cve_ids": ["CVE-2021-34527"], "processes": ["spoolsv.exe"], "dll_files": ["malicious.dll"], "registry_changes": ["HKLM\\\\SYSTEM\\\\CurrentControlSet\\\\Services\\\\Spooler"]}', ARRAY['Privilege Escalation'], ARRAY['T1068'], ARRAY['WORKSTATION-08'], '[{"action": "Process terminated", "timestamp": "2024-01-15T11:30:00Z", "user": "edr-agent"}, {"action": "Patch applied", "timestamp": "2024-01-15T11:45:00Z", "user": "patch-management"}, {"action": "System hardened", "timestamp": "2024-01-15T12:00:00Z", "user": "security-team"}]');

-- ================================================================
-- SAMPLE SYSTEM METRICS
-- ================================================================
INSERT INTO system_metrics (metric_name, metric_value, metric_unit, category, metadata) VALUES
('threat_detection_rate', 98.5, 'percentage', 'security', '{"threats_detected": 2847, "threats_blocked": 2805, "false_positives": 12, "detection_engines": ["Suricata", "Wazuh", "ClamAV"]}'),
('system_uptime', 99.97, 'percentage', 'performance', '{"total_uptime_hours": 8759.7, "downtime_minutes": 15.8, "last_outage": "2024-01-10T03:22:00Z", "sla_target": 99.9}'),
('log_processing_rate', 125000, 'events_per_second', 'performance', '{"total_events_today": 10800000, "storage_used_gb": 2500, "retention_days": 90, "compression_ratio": 4.2}'),
('incident_response_time', 8.5, 'minutes', 'security', '{"average_response_time": 8.5, "target_response_time": 15, "fastest_response": 2.1, "slowest_response": 22.3, "incidents_this_month": 23}'),
('vulnerability_scan_coverage', 95.2, 'percentage', 'security', '{"assets_scanned": 1142, "total_assets": 1200, "high_vulnerabilities": 23, "medium_vulnerabilities": 156, "low_vulnerabilities": 445}'),
('network_throughput', 2.8, 'gbps', 'performance', '{"peak_throughput": 4.2, "average_throughput": 2.8, "utilization_percentage": 67, "packet_loss": 0.02}'),
('disk_usage', 78.5, 'percentage', 'performance', '{"total_storage_tb": 50, "used_storage_tb": 39.25, "available_storage_tb": 10.75, "growth_rate_gb_per_day": 125}'),
('threat_hunting_sessions', 15, 'count', 'security', '{"active_hunts": 3, "completed_hunts": 12, "threats_found": 8, "false_positives": 4, "avg_hunt_duration": 45}'),
('security_training_completion', 87.3, 'percentage', 'training', '{"total_users": 150, "completed_training": 131, "in_progress": 12, "not_started": 7, "avg_score": 92.5}'),
('firewall_blocked_connections', 2847, 'count', 'security', '{"blocked_ips": 1245, "blocked_domains": 456, "blocked_ports": 23, "top_blocked_country": "Unknown", "blocked_protocols": ["TCP", "UDP", "ICMP"]}}');

-- ================================================================
-- COMPLETION MESSAGE
-- ================================================================
-- Database population complete! All sample data has been inserted.
-- You can now use the Shadow Guardian SOC platform with realistic data.
