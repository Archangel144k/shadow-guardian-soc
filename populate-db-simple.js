#!/usr/bin/env node

// Simple and robust database populator for Shadow Guardian SOC
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🚀 Shadow Guardian - Simple Database Populator\n');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Environment variables not found');
  process.exit(1);
}

console.log('✅ Connecting to Supabase...');
const supabase = createClient(supabaseUrl, supabaseKey);

async function populateData() {
  try {
    console.log('\n📊 Starting data population...\n');

    // 1. Populate Security Tools
    console.log('1. Adding security tools...');
    const toolsData = [
      {
        name: 'Suricata IDS',
        type: 'IDS',
        vendor: 'Suricata',
        status: 'active',
        performance: 98,
        icon: '🛡️',
        description: 'Network intrusion detection system',
        metrics: { threats: 156, events_per_day: 25000 }
      },
      {
        name: 'Elasticsearch',
        type: 'SIEM',
        vendor: 'Elastic',
        status: 'active',
        performance: 95,
        icon: '🔍',
        description: 'Search and analytics engine for security data',
        metrics: { events: 2847, indices: 45, storage_gb: 2500 }
      },
      {
        name: 'Graylog SIEM',
        type: 'SIEM',
        vendor: 'Graylog',
        status: 'active',
        performance: 97,
        icon: '📊',
        description: 'Centralized log management and analysis',
        metrics: { logs: 15420, sources: 156, throughput: '50k/sec' }
      },
      {
        name: 'Wazuh HIDS',
        type: 'HIDS',
        vendor: 'Wazuh',
        status: 'active',
        performance: 94,
        icon: '🔒',
        description: 'Host-based intrusion detection system',
        metrics: { agents: 847, rules: 3200, alerts_today: 234 }
      },
      {
        name: 'NMAP Scanner',
        type: 'Scanner',
        vendor: 'Nmap',
        status: 'scanning',
        performance: 89,
        icon: '🌐',
        description: 'Network discovery and security auditing',
        metrics: { targets: 256, ports_scanned: 65535, completion: 67 }
      },
      {
        name: 'Metasploit Framework',
        type: 'Penetration Testing',
        vendor: 'Rapid7',
        status: 'standby',
        performance: 100,
        icon: '💥',
        description: 'Penetration testing framework',
        metrics: { exploits: 2134, modules: 2000, payloads: 500 }
      }
    ];

    for (const tool of toolsData) {
      try {
        const { data, error } = await supabase
          .from('security_tools')
          .insert(tool)
          .select();
        
        if (error) {
          console.log(`   ⚠️  ${tool.name}: ${error.message}`);
        } else {
          console.log(`   ✅ ${tool.name}: Added successfully`);
        }
      } catch (err) {
        console.log(`   ❌ ${tool.name}: ${err.message}`);
      }
    }

    // 2. Populate Training Modules
    console.log('\n2. Adding training modules...');
    const modulesData = [
      {
        title: 'Advanced Threat Hunting',
        description: 'Learn advanced techniques for proactive threat hunting using MITRE ATT&CK framework',
        category: 'threat-hunting',
        difficulty: 'Expert',
        duration: '45 minutes',
        type: 'Interactive Lab',
        content: {
          modules: ['MITRE ATT&CK Overview', 'Hunt Hypothesis', 'Data Analysis', 'IOC Development'],
          exercises: 3,
          labs: 2
        },
        learning_objectives: [
          'Understand MITRE ATT&CK framework',
          'Develop threat hunting hypotheses',
          'Analyze security logs effectively',
          'Create custom detection rules'
        ],
        tags: ['mitre', 'attack', 'hunting', 'detection'],
        is_published: true
      },
      {
        title: 'Incident Response Procedures',
        description: 'Practice incident response workflows and containment strategies',
        category: 'incident-response',
        difficulty: 'Intermediate',
        duration: '30 minutes',
        type: 'Simulation',
        content: {
          scenarios: ['Malware Outbreak', 'Data Breach', 'DDoS Attack'],
          playbooks: 4,
          checklists: 6
        },
        learning_objectives: [
          'Follow IR procedures',
          'Contain security incidents',
          'Coordinate response teams',
          'Document incident details'
        ],
        tags: ['incident', 'response', 'containment', 'forensics'],
        is_published: true
      },
      {
        title: 'Digital Forensics Fundamentals',
        description: 'Master the basics of digital forensics and evidence collection',
        category: 'forensics',
        difficulty: 'Beginner',
        duration: '60 minutes',
        type: 'Tutorial',
        content: {
          topics: ['Evidence Handling', 'File System Analysis', 'Memory Forensics', 'Network Forensics'],
          tools: ['Autopsy', 'Volatility', 'Wireshark'],
          exercises: 5
        },
        learning_objectives: [
          'Understand forensic methodology',
          'Preserve digital evidence',
          'Analyze file systems',
          'Extract artifacts from memory'
        ],
        tags: ['forensics', 'evidence', 'analysis', 'investigation'],
        is_published: true
      },
      {
        title: 'Red Team Operations',
        description: 'Offensive security techniques and penetration testing methodologies',
        category: 'red-team',
        difficulty: 'Expert',
        duration: '90 minutes',
        type: 'Hands-on Lab',
        content: {
          phases: ['Reconnaissance', 'Initial Access', 'Persistence', 'Lateral Movement', 'Exfiltration'],
          tools: ['Metasploit', 'Cobalt Strike', 'Empire', 'BloodHound'],
          labs: 8
        },
        learning_objectives: [
          'Plan red team operations',
          'Execute attack scenarios',
          'Maintain persistence',
          'Simulate advanced threats'
        ],
        tags: ['red-team', 'penetration', 'testing', 'offensive'],
        is_published: true
      }
    ];

    for (const module of modulesData) {
      try {
        const { data, error } = await supabase
          .from('training_modules')
          .insert(module)
          .select();
        
        if (error) {
          console.log(`   ⚠️  ${module.title}: ${error.message}`);
        } else {
          console.log(`   ✅ ${module.title}: Added successfully`);
        }
      } catch (err) {
        console.log(`   ❌ ${module.title}: ${err.message}`);
      }
    }

    // 3. Populate Security Threats
    console.log('\n3. Adding security threats...');
    const threatsData = [
      {
        type: 'Malware',
        severity: 'High',
        status: 'Blocked',
        source_ip: '192.168.1.45',
        target_ip: '10.0.0.100',
        source_port: 49152,
        target_port: 443,
        protocol: 'HTTPS',
        description: 'Suspicious executable detected attempting to establish C2 communication',
        details: {
          file_hash: 'a1b2c3d4e5f67890abcdef1234567890',
          file_name: 'invoice.exe',
          file_size: '2.3MB',
          detection_engine: 'Windows Defender',
          c2_domain: 'malicious-domain.com',
          encryption: 'AES-256'
        },
        indicators: {
          file_hashes: ['a1b2c3d4e5f67890abcdef1234567890'],
          domains: ['malicious-domain.com'],
          ips: ['192.168.1.45']
        },
        mitre_tactics: ['Execution', 'Command and Control'],
        mitre_techniques: ['T1059.001', 'T1071.001'],
        affected_systems: ['DESKTOP-ABC123'],
        response_actions: [
          { action: 'File quarantined', timestamp: '2024-01-15T10:23:45Z', user: 'system' },
          { action: 'Network blocked', timestamp: '2024-01-15T10:23:47Z', user: 'firewall' }
        ]
      },
      {
        type: 'DDoS',
        severity: 'Critical',
        status: 'Mitigating',
        source_ip: '203.45.67.89',
        target_ip: '10.0.0.50',
        target_port: 80,
        protocol: 'HTTP',
        description: 'High volume traffic detected from multiple sources targeting web server',
        details: {
          request_rate: '10000/sec',
          attack_type: 'HTTP flood',
          target_service: 'web_server',
          attack_duration: '15 minutes',
          source_countries: ['Unknown', 'Russia', 'China'],
          user_agents: ['curl/7.68.0', 'wget/1.20.3', 'custom_bot']
        },
        indicators: {
          ips: ['203.45.67.89', '198.51.100.42', '203.0.113.15'],
          patterns: ['GET /api/heavy-endpoint', 'POST /login'],
          user_agents: ['curl/7.68.0', 'wget/1.20.3']
        },
        mitre_tactics: ['Impact'],
        mitre_techniques: ['T1498.001'],
        affected_systems: ['WEB-SERVER-01', 'LOAD-BALANCER-01'],
        response_actions: [
          { action: 'Rate limiting enabled', timestamp: '2024-01-15T10:21:32Z', user: 'admin' },
          { action: 'CDN mitigation activated', timestamp: '2024-01-15T10:22:15Z', user: 'system' }
        ]
      },
      {
        type: 'Phishing',
        severity: 'Medium',
        status: 'Investigating',
        source_ip: '185.23.45.67',
        description: 'Suspicious email campaign targeting finance department',
        details: {
          sender: 'noreply@trusted-bank.net',
          subject: 'Urgent: Account Security Alert - Action Required',
          attachment: 'security_update.docm',
          recipients: 15,
          opened: 8,
          clicked: 3,
          attachment_hash: 'def456789abcdef123456789abcdef12',
          spoofed_domain: 'trusted-bank.net'
        },
        indicators: {
          email_addresses: ['noreply@trusted-bank.net'],
          domains: ['trusted-bank.net'],
          file_hashes: ['def456789abcdef123456789abcdef12'],
          subjects: ['Account Security Alert']
        },
        mitre_tactics: ['Initial Access'],
        mitre_techniques: ['T1566.001'],
        affected_systems: ['EXCHANGE-SERVER', 'EMAIL-GATEWAY'],
        response_actions: [
          { action: 'Email quarantined', timestamp: '2024-01-15T10:19:15Z', user: 'security_team' },
          { action: 'Users notified', timestamp: '2024-01-15T10:25:30Z', user: 'it_admin' }
        ]
      },
      {
        type: 'SQL Injection',
        severity: 'High',
        status: 'Blocked',
        source_ip: '172.16.1.200',
        target_ip: '10.0.0.25',
        target_port: 443,
        protocol: 'HTTPS',
        description: 'SQL injection attempt detected on customer portal login endpoint',
        details: {
          payload: "admin' OR 1=1-- ",
          target_endpoint: '/api/v1/auth/login',
          parameter: 'username',
          user_agent: 'sqlmap/1.6.12#stable',
          attempts: 47,
          blocked_by: 'WAF',
          sql_error: 'Syntax error near OR'
        },
        indicators: {
          payloads: ["' OR 1=1--", "'; DROP TABLE users--", "' UNION SELECT * FROM users--"],
          endpoints: ['/api/v1/auth/login', '/api/v1/users'],
          user_agents: ['sqlmap/1.6.12#stable']
        },
        mitre_tactics: ['Initial Access'],
        mitre_techniques: ['T1190'],
        affected_systems: ['WEB-APP-01', 'DATABASE-01'],
        response_actions: [
          { action: 'WAF rule triggered', timestamp: '2024-01-15T10:17:28Z', user: 'waf' },
          { action: 'IP blocked', timestamp: '2024-01-15T10:17:30Z', user: 'firewall' }
        ]
      }
    ];

    for (const threat of threatsData) {
      try {
        const { data, error } = await supabase
          .from('security_threats')
          .insert(threat)
          .select();
        
        if (error) {
          console.log(`   ⚠️  ${threat.type}: ${error.message}`);
        } else {
          console.log(`   ✅ ${threat.type} threat: Added successfully`);
        }
      } catch (err) {
        console.log(`   ❌ ${threat.type}: ${err.message}`);
      }
    }

    // 4. Generate System Metrics
    console.log('\n4. Adding system metrics...');
    const now = new Date();
    let metricsAdded = 0;

    // Generate metrics for the last 2 hours (every 5 minutes)
    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(now.getTime() - (i * 5 * 60 * 1000));
      
      const metricsData = [
        {
          metric_type: 'threat_count',
          metric_name: 'threats_detected',
          value: Math.floor(Math.random() * 20) + 5,
          unit: 'count',
          source: 'suricata',
          timestamp: timestamp.toISOString()
        },
        {
          metric_type: 'threat_count',
          metric_name: 'threats_blocked',
          value: Math.floor(Math.random() * 15) + 3,
          unit: 'count',
          source: 'firewall',
          timestamp: timestamp.toISOString()
        },
        {
          metric_type: 'system_performance',
          metric_name: 'cpu_usage',
          value: Math.floor(Math.random() * 40) + 30,
          unit: 'percentage',
          source: 'monitoring_agent',
          timestamp: timestamp.toISOString()
        },
        {
          metric_type: 'system_performance',
          metric_name: 'memory_usage',
          value: Math.floor(Math.random() * 30) + 50,
          unit: 'percentage',
          source: 'monitoring_agent',
          timestamp: timestamp.toISOString()
        },
        {
          metric_type: 'tool_performance',
          metric_name: 'suricata_performance',
          value: Math.floor(Math.random() * 15) + 85,
          unit: 'percentage',
          source: 'suricata',
          timestamp: timestamp.toISOString()
        }
      ];

      try {
        const { data, error } = await supabase
          .from('system_metrics')
          .insert(metricsData)
          .select();
        
        if (error) {
          console.log(`   ⚠️  Metrics batch ${i}: ${error.message}`);
        } else {
          metricsAdded += metricsData.length;
        }
      } catch (err) {
        console.log(`   ❌ Metrics batch ${i}: ${err.message}`);
      }
    }

    console.log(`   ✅ System metrics: Added ${metricsAdded} records`);

    // 5. Final Summary
    console.log('\n📊 Data population summary:');
    
    const { count: toolsCount } = await supabase
      .from('security_tools')
      .select('*', { count: 'exact', head: true });
    
    const { count: threatsCount } = await supabase
      .from('security_threats')
      .select('*', { count: 'exact', head: true });
    
    const { count: modulesCount } = await supabase
      .from('training_modules')
      .select('*', { count: 'exact', head: true });
    
    const { count: metricsCount } = await supabase
      .from('system_metrics')
      .select('*', { count: 'exact', head: true });

    console.log(`✅ Security Tools: ${toolsCount || 0}`);
    console.log(`✅ Security Threats: ${threatsCount || 0}`);
    console.log(`✅ Training Modules: ${modulesCount || 0}`);
    console.log(`✅ System Metrics: ${metricsCount || 0}`);

    console.log('\n🎉 Database population completed successfully!');
    console.log('💡 Your Shadow Guardian SOC platform now has realistic sample data.');
    console.log('🚀 Refresh your application to see the new data in action!');

  } catch (error) {
    console.log(`❌ Population failed: ${error.message}`);
    console.log('Stack trace:', error.stack);
  }
}

// Run the population
populateData();
