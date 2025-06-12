#!/usr/bin/env node

// Fixed Database Populator for Shadow Guardian SOC
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🚀 Shadow Guardian - Fixed Database Populator\n');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Environment variables not found');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Found' : 'Missing');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Found' : 'Missing');
  process.exit(1);
}

console.log('✅ Environment variables loaded');
console.log('🔗 Supabase URL:', supabaseUrl);
console.log('🔑 API Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'Missing');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n🔌 Testing Supabase connection...');
    const { data, error } = await supabase.from('security_tools').select('count').limit(1);
    
    if (error) {
      console.log('❌ Connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Connection successful');
    return true;
  } catch (err) {
    console.log('❌ Connection error:', err.message);
    return false;
  }
}

async function populateSecurityTools() {
  console.log('\n🛠️  Populating Security Tools...');
  
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
      performance: 92,
      icon: '📊',
      description: 'Centralized log management platform',
      metrics: { logs_per_second: 50000, dashboards: 28, alerts: 15 }
    },
    {
      name: 'Wazuh HIDS',
      type: 'HIDS',
      vendor: 'Wazuh',
      status: 'active',
      performance: 94,
      icon: '🖥️',
      description: 'Host-based intrusion detection system',
      metrics: { agents: 500, rules: 2500, integrity_checks: 1500 }
    }
  ];

  let successCount = 0;
  for (const tool of toolsData) {
    try {
      console.log(`   Processing: ${tool.name}`);
      
      const { data, error } = await supabase
        .from('security_tools')
        .insert(tool)
        .select();
      
      if (error) {
        console.log(`   ❌ ${tool.name}: ${error.message}`);
        console.log(`   Error details:`, error);
      } else if (data && data.length > 0) {
        console.log(`   ✅ ${tool.name}: Added successfully (ID: ${data[0].id})`);
        successCount++;
      } else {
        console.log(`   ⚠️  ${tool.name}: No data returned (possible duplicate)`);
      }
    } catch (err) {
      console.log(`   ❌ ${tool.name}: Caught exception:`, err.message);
      console.log(`   Full error:`, err);
    }
  }
  
  console.log(`\n📊 Security Tools: ${successCount}/${toolsData.length} added successfully`);
  return successCount > 0;
}

async function populateTrainingModules() {
  console.log('\n📚 Populating Training Modules...');
  
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
    }
  ];

  let successCount = 0;
  for (const module of modulesData) {
    try {
      console.log(`   Processing: ${module.title}`);
      
      const { data, error } = await supabase
        .from('training_modules')
        .insert(module)
        .select();
      
      if (error) {
        console.log(`   ❌ ${module.title}: ${error.message}`);
        console.log(`   Error details:`, error);
      } else if (data && data.length > 0) {
        console.log(`   ✅ ${module.title}: Added successfully (ID: ${data[0].id})`);
        successCount++;
      } else {
        console.log(`   ⚠️  ${module.title}: No data returned (possible duplicate)`);
      }
    } catch (err) {
      console.log(`   ❌ ${module.title}: Caught exception:`, err.message);
      console.log(`   Full error:`, err);
    }
  }
  
  console.log(`\n📊 Training Modules: ${successCount}/${modulesData.length} added successfully`);
  return successCount > 0;
}

async function populateSecurityThreats() {
  console.log('\n🚨 Populating Security Threats...');
  
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
      status: 'Mitigated',
      source_ip: '203.0.113.45',
      target_ip: '198.51.100.10',
      source_port: 80,
      target_port: 443,
      protocol: 'TCP',
      description: 'Large-scale DDoS attack targeting web infrastructure',
      details: {
        attack_type: 'SYN Flood',
        packets_per_second: 500000,
        bandwidth: '2.5 Gbps',
        attack_duration: '45 minutes',
        geolocation: 'Multiple countries',
        botnet_size: 'Estimated 50,000 bots'
      },
      indicators: {
        ips: ['203.0.113.45', '203.0.113.46', '203.0.113.47'],
        patterns: ['SYN_FLOOD', 'HIGH_VOLUME']
      },
      mitre_tactics: ['Impact'],
      mitre_techniques: ['T1498.001'],
      affected_systems: ['WEB-SERVER-01', 'LOAD-BALANCER-01'],
      response_actions: [
        { action: 'Rate limiting activated', timestamp: '2024-01-15T14:30:00Z', user: 'auto-defense' },
        { action: 'Traffic filtered', timestamp: '2024-01-15T14:30:15Z', user: 'firewall' },
        { action: 'CDN protection enabled', timestamp: '2024-01-15T14:32:00Z', user: 'ops-team' }
      ]
    },
    {
      type: 'Phishing',
      severity: 'Medium',
      status: 'Investigating',
      source_ip: '172.16.0.25',
      target_ip: '10.0.0.50',
      source_port: 587,
      target_port: 25,
      protocol: 'SMTP',
      description: 'Phishing email campaign targeting employee credentials',
      details: {
        sender: 'noreply@fake-bank.com',
        subject: 'Urgent: Account Verification Required',
        attachment: 'account_verification.pdf',
        recipients: 45,
        click_rate: '12%',
        credential_harvesting: 'Active'
      },
      indicators: {
        domains: ['fake-bank.com', 'phishing-site.net'],
        email_headers: ['X-Mailer: Mass Mailer Pro'],
        urls: ['http://phishing-site.net/login']
      },
      mitre_tactics: ['Initial Access', 'Credential Access'],
      mitre_techniques: ['T1566.001', 'T1589.002'],
      affected_systems: ['MAIL-SERVER-01'],
      response_actions: [
        { action: 'Email quarantined', timestamp: '2024-01-15T09:15:00Z', user: 'mail-filter' },
        { action: 'Users notified', timestamp: '2024-01-15T09:20:00Z', user: 'security-team' }
      ]
    }
  ];

  let successCount = 0;
  for (const threat of threatsData) {
    try {
      console.log(`   Processing: ${threat.type} - ${threat.description.substring(0, 50)}...`);
      
      const { data, error } = await supabase
        .from('security_threats')
        .insert(threat)
        .select();
      
      if (error) {
        console.log(`   ❌ ${threat.type}: ${error.message}`);
        console.log(`   Error details:`, error);
      } else if (data && data.length > 0) {
        console.log(`   ✅ ${threat.type}: Added successfully (ID: ${data[0].id})`);
        successCount++;
      } else {
        console.log(`   ⚠️  ${threat.type}: No data returned (possible duplicate)`);
      }
    } catch (err) {
      console.log(`   ❌ ${threat.type}: Caught exception:`, err.message);
      console.log(`   Full error:`, err);
    }
  }
  
  console.log(`\n📊 Security Threats: ${successCount}/${threatsData.length} added successfully`);
  return successCount > 0;
}

async function populateSystemMetrics() {
  console.log('\n📈 Populating System Metrics...');
  
  const metricsData = [
    {
      metric_name: 'threat_detection_rate',
      metric_value: 98.5,
      metric_unit: 'percentage',
      category: 'security',
      metadata: {
        threats_detected: 2847,
        threats_blocked: 2805,
        false_positives: 12,
        detection_engines: ['Suricata', 'Wazuh', 'ClamAV']
      }
    },
    {
      metric_name: 'system_uptime',
      metric_value: 99.97,
      metric_unit: 'percentage',
      category: 'performance',
      metadata: {
        total_uptime_hours: 8759.7,
        downtime_minutes: 15.8,
        last_outage: '2024-01-10T03:22:00Z',
        sla_target: 99.9
      }
    },
    {
      metric_name: 'log_processing_rate',
      metric_value: 125000,
      metric_unit: 'events_per_second',
      category: 'performance',
      metadata: {
        total_events_today: 10800000,
        storage_used_gb: 2500,
        retention_days: 90,
        compression_ratio: 4.2
      }
    },
    {
      metric_name: 'incident_response_time',
      metric_value: 8.5,
      metric_unit: 'minutes',
      category: 'security',
      metadata: {
        average_response_time: 8.5,
        target_response_time: 15,
        fastest_response: 2.1,
        slowest_response: 22.3,
        incidents_this_month: 23
      }
    }
  ];

  let successCount = 0;
  for (const metric of metricsData) {
    try {
      console.log(`   Processing: ${metric.metric_name}`);
      
      const { data, error } = await supabase
        .from('system_metrics')
        .insert(metric)
        .select();
      
      if (error) {
        console.log(`   ❌ ${metric.metric_name}: ${error.message}`);
        console.log(`   Error details:`, error);
      } else if (data && data.length > 0) {
        console.log(`   ✅ ${metric.metric_name}: Added successfully (ID: ${data[0].id})`);
        successCount++;
      } else {
        console.log(`   ⚠️  ${metric.metric_name}: No data returned (possible duplicate)`);
      }
    } catch (err) {
      console.log(`   ❌ ${metric.metric_name}: Caught exception:`, err.message);
      console.log(`   Full error:`, err);
    }
  }
  
  console.log(`\n📊 System Metrics: ${successCount}/${metricsData.length} added successfully`);
  return successCount > 0;
}

async function main() {
  try {
    // Test connection first
    const connected = await testConnection();
    if (!connected) {
      console.log('\n❌ Cannot proceed without a working database connection');
      process.exit(1);
    }
    
    console.log('\n🚀 Starting database population...');
    
    // Populate all tables
    const results = await Promise.all([
      populateSecurityTools(),
      populateTrainingModules(),
      populateSecurityThreats(),
      populateSystemMetrics()
    ]);
    
    const successfulTables = results.filter(result => result).length;
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 DATABASE POPULATION COMPLETE');
    console.log('='.repeat(50));
    console.log(`✅ Tables populated successfully: ${successfulTables}/4`);
    
    if (successfulTables === 4) {
      console.log('\n🎊 All data has been successfully added to the database!');
      console.log('🌐 You can now use the Shadow Guardian SOC platform with live data.');
    } else {
      console.log('\n⚠️  Some tables failed to populate. Check the errors above.');
    }
    
  } catch (error) {
    console.error('\n💥 Fatal error during population:', error);
    process.exit(1);
  }
}

// Run the population
main();
