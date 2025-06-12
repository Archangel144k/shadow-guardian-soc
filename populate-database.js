#!/usr/bin/env node

// Populate Supabase database with sample data
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🚀 Shadow Guardian - Database Populator\n');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Environment variables not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function populateDatabase() {
  console.log('📊 Populating database with sample data...\n');

  try {
    // Sample Security Tools
    console.log('1. Adding security tools...');
    const tools = [
      { name: 'Suricata IDS', type: 'IDS', status: 'active', performance: 98, icon: '🛡️', metrics: { threats: 156 } },
      { name: 'Elasticsearch', type: 'SIEM', status: 'active', performance: 95, icon: '🔍', metrics: { events: 2847 } },
      { name: 'Graylog SIEM', type: 'SIEM', status: 'active', performance: 97, icon: '📊', metrics: { logs: 15420 } },
      { name: 'Wazuh HIDS', type: 'HIDS', status: 'active', performance: 94, icon: '🔒', metrics: { agents: 847 } },
      { name: 'NMAP Scanner', type: 'Scanner', status: 'scanning', performance: 89, icon: '🌐', metrics: { targets: 256 } },
      { name: 'Metasploit', type: 'Penetration Testing', status: 'standby', performance: 100, icon: '💥', metrics: { exploits: 2134 } }
    ];

    for (const tool of tools) {
      const { error } = await supabase
        .from('security_tools')
        .upsert(tool, { onConflict: 'name' });
      
      if (error) {
        console.log(`   ⚠️  ${tool.name}: ${error.message || 'Unknown error'}`);
      } else {
        console.log(`   ✅ ${tool.name}: Added`);
      }
    }

    // Sample Training Modules
    console.log('\n2. Adding training modules...');
    const modules = [
      {
        title: 'Advanced Threat Hunting',
        description: 'Learn advanced techniques for proactive threat hunting using MITRE ATT&CK framework',
        category: 'threat-hunting',
        difficulty: 'Expert',
        duration: '45 minutes',
        type: 'Interactive Lab',
        content: {},
        is_published: true
      },
      {
        title: 'Incident Response Procedures',
        description: 'Practice incident response workflows and containment strategies',
        category: 'incident-response',
        difficulty: 'Intermediate',
        duration: '30 minutes',
        type: 'Simulation',
        content: {},
        is_published: true
      },
      {
        title: 'Digital Forensics Fundamentals',
        description: 'Master the basics of digital forensics and evidence collection',
        category: 'forensics',
        difficulty: 'Beginner',
        duration: '60 minutes',
        type: 'Tutorial',
        content: {},
        is_published: true
      },
      {
        title: 'Red Team Operations',
        description: 'Offensive security techniques and penetration testing methodologies',
        category: 'red-team',
        difficulty: 'Expert',
        duration: '90 minutes',
        type: 'Hands-on Lab',
        content: {},
        is_published: true
      }
    ];

    for (const module of modules) {
      const { error } = await supabase
        .from('training_modules')
        .insert(module);
      
      if (error && error.message && !error.message.includes('duplicate')) {
        console.log(`   ⚠️  ${module.title}: ${error.message}`);
      } else {
        console.log(`   ✅ ${module.title}: Added`);
      }
    }

    // Sample Security Threats
    console.log('\n3. Adding security threats...');
    const threats = [
      {
        type: 'Malware',
        severity: 'High',
        status: 'Blocked',
        source_ip: '192.168.1.45',
        target_ip: '10.0.0.100',
        description: 'Suspicious executable detected attempting to establish C2 communication',
        details: { file_hash: 'a1b2c3d4e5f6', file_name: 'invoice.exe', detection_engine: 'Windows Defender' }
      },
      {
        type: 'DDoS',
        severity: 'Critical',
        status: 'Mitigating',
        source_ip: '203.45.67.89',
        target_ip: '10.0.0.50',
        description: 'High volume traffic detected from multiple sources',
        details: { request_rate: '10000/sec', attack_type: 'HTTP flood', target_service: 'web_server' }
      },
      {
        type: 'Phishing',
        severity: 'Medium',
        status: 'Investigating',
        source_ip: '185.23.45.67',
        description: 'Suspicious email campaign targeting finance department',
        details: { sender: 'noreply@trusted-bank.net', subject: 'Account Security Alert', attachment: 'update.docm' }
      },
      {
        type: 'SQL Injection',
        severity: 'High',
        status: 'Blocked',
        source_ip: '172.16.1.200',
        target_ip: '10.0.0.25',
        description: 'SQL injection attempt detected on customer portal',
        details: { payload: "1' OR 1=1--", target_endpoint: '/api/customers', user_agent: 'sqlmap/1.6' }
      }
    ];

    for (const threat of threats) {
      const { error } = await supabase
        .from('security_threats')
        .insert(threat);
      
      if (error) {
        console.log(`   ⚠️  ${threat.type}: ${error.message}`);
      } else {
        console.log(`   ✅ ${threat.type}: Added`);
      }
    }

    // Generate some system metrics
    console.log('\n4. Adding system metrics...');
    const now = new Date();
    const metrics = [];
    
    // Generate metrics for the last 2 hours (every 5 minutes)
    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(now.getTime() - (i * 5 * 60 * 1000));
      
      metrics.push(
        {
          metric_type: 'threat_count',
          metric_name: 'threats_detected',
          value: Math.floor(Math.random() * 20) + 5,
          unit: 'count',
          source: 'suricata',
          timestamp: timestamp.toISOString()
        },
        {
          metric_type: 'system_performance',
          metric_name: 'cpu_usage',
          value: Math.floor(Math.random() * 40) + 30,
          unit: 'percentage',
          source: 'monitoring',
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
      );
    }

    const { error: metricsError } = await supabase
      .from('system_metrics')
      .insert(metrics);
    
    if (metricsError) {
      console.log(`   ⚠️  System metrics: ${metricsError.message}`);
    } else {
      console.log(`   ✅ System metrics: Added ${metrics.length} records`);
    }

    // Summary
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
    console.log('💡 Your Shadow Guardian SOC platform now has sample data to work with.');

  } catch (error) {
    console.log('❌ Population failed:', error.message);
  }
}

populateDatabase();
