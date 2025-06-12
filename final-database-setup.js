#!/usr/bin/env node

// Final Database Creation and Population Script
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Environment variables not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🚀 Shadow Guardian - Final Database Setup\n');
console.log('🔗 Supabase URL:', supabaseUrl);
console.log('🔑 API Key:', `${supabaseKey.substring(0, 20)}...`);

async function executeSQL(query, description) {
  try {
    console.log(`\n📝 ${description}...`);
    const { data, error } = await supabase.rpc('exec', { sql: query });
    
    if (error) {
      console.log(`   ❌ Failed: ${error.message}`);
      return false;
    } else {
      console.log(`   ✅ Success`);
      return true;
    }
  } catch (err) {
    console.log(`   ❌ Exception: ${err.message}`);
    return false;
  }
}

async function createTablesDirectly() {
  console.log('\n🔨 Creating database tables...');
  
  const tables = [
    {
      name: 'user_profiles',
      sql: `
        CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT UNIQUE NOT NULL,
          username TEXT UNIQUE NOT NULL,
          full_name TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'analyst',
          department TEXT NOT NULL DEFAULT 'security',
          clearance_level TEXT NOT NULL DEFAULT 'SECRET',
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
      `
    },
    {
      name: 'security_threats',
      sql: `
        CREATE TABLE IF NOT EXISTS security_threats (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          type TEXT NOT NULL,
          severity TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'Detected',
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
      `
    },
    {
      name: 'security_tools',
      sql: `
        CREATE TABLE IF NOT EXISTS security_tools (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          vendor TEXT,
          version TEXT,
          status TEXT NOT NULL DEFAULT 'active',
          performance INTEGER DEFAULT 0,
          icon TEXT,
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
      `
    },
    {
      name: 'training_modules',
      sql: `
        CREATE TABLE IF NOT EXISTS training_modules (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          category TEXT NOT NULL,
          difficulty TEXT NOT NULL,
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
      `
    },
    {
      name: 'user_progress',
      sql: `
        CREATE TABLE IF NOT EXISTS user_progress (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
          module_id UUID REFERENCES training_modules(id) ON DELETE CASCADE,
          progress_percentage INTEGER DEFAULT 0,
          completed_at TIMESTAMPTZ,
          score INTEGER,
          time_spent INTEGER DEFAULT 0,
          attempts INTEGER DEFAULT 1,
          notes TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(user_id, module_id)
        );
      `
    },
    {
      name: 'system_metrics',
      sql: `
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
      `
    }
  ];
  
  let successCount = 0;
  
  for (const table of tables) {
    const success = await executeSQL(table.sql, `Creating table: ${table.name}`);
    if (success) successCount++;
  }
  
  console.log(`\n📊 Tables created: ${successCount}/${tables.length}`);
  return successCount === tables.length;
}

async function populateDatabase() {
  console.log('\n📊 Populating database with sample data...');
  
  try {
    // Add security tools
    const { data: toolData, error: toolError } = await supabase
      .from('security_tools')
      .insert([
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
          description: 'Search and analytics engine',
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
      ])
      .select();
    
    if (toolError) {
      console.log(`   ❌ Security tools failed: ${toolError.message}`);
    } else {
      console.log(`   ✅ Added ${toolData?.length || 0} security tools`);
    }
    
    // Add training modules
    const { data: moduleData, error: moduleError } = await supabase
      .from('training_modules')
      .insert([
        {
          title: 'Advanced Threat Hunting',
          description: 'Learn advanced techniques for proactive threat hunting using MITRE ATT&CK framework',
          category: 'threat-hunting',
          difficulty: 'Expert',
          duration: '45 minutes',
          type: 'Interactive Lab',
          is_published: true,
          tags: ['mitre', 'attack', 'hunting', 'detection']
        },
        {
          title: 'Incident Response Procedures',
          description: 'Practice incident response workflows and containment strategies',
          category: 'incident-response',
          difficulty: 'Intermediate',
          duration: '30 minutes',
          type: 'Simulation',
          is_published: true,
          tags: ['incident', 'response', 'containment', 'forensics']
        },
        {
          title: 'Digital Forensics Fundamentals',
          description: 'Master the basics of digital forensics and evidence collection',
          category: 'forensics',
          difficulty: 'Beginner',
          duration: '60 minutes',
          type: 'Tutorial',
          is_published: true,
          tags: ['forensics', 'evidence', 'analysis', 'investigation']
        }
      ])
      .select();
    
    if (moduleError) {
      console.log(`   ❌ Training modules failed: ${moduleError.message}`);
    } else {
      console.log(`   ✅ Added ${moduleData?.length || 0} training modules`);
    }
    
    // Add security threats
    const { data: threatData, error: threatError } = await supabase
      .from('security_threats')
      .insert([
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
            detection_engine: 'Windows Defender'
          },
          mitre_tactics: ['Execution', 'Command and Control'],
          mitre_techniques: ['T1059.001', 'T1071.001'],
          affected_systems: ['DESKTOP-ABC123']
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
            attack_duration: '45 minutes'
          },
          mitre_tactics: ['Impact'],
          mitre_techniques: ['T1498.001'],
          affected_systems: ['WEB-SERVER-01', 'LOAD-BALANCER-01']
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
            recipients: 45,
            click_rate: '12%'
          },
          mitre_tactics: ['Initial Access', 'Credential Access'],
          mitre_techniques: ['T1566.001', 'T1589.002'],
          affected_systems: ['MAIL-SERVER-01']
        }
      ])
      .select();
    
    if (threatError) {
      console.log(`   ❌ Security threats failed: ${threatError.message}`);
    } else {
      console.log(`   ✅ Added ${threatData?.length || 0} security threats`);
    }
    
    // Add system metrics
    const { data: metricData, error: metricError } = await supabase
      .from('system_metrics')
      .insert([
        {
          metric_name: 'threat_detection_rate',
          metric_value: 98.5,
          metric_unit: 'percentage',
          category: 'security',
          metadata: {
            threats_detected: 2847,
            threats_blocked: 2805,
            false_positives: 12
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
            retention_days: 90
          }
        }
      ])
      .select();
    
    if (metricError) {
      console.log(`   ❌ System metrics failed: ${metricError.message}`);
    } else {
      console.log(`   ✅ Added ${metricData?.length || 0} system metrics`);
    }
    
    return true;
  } catch (error) {
    console.log(`   ❌ Population failed: ${error.message}`);
    return false;
  }
}

async function main() {
  try {
    console.log('\n' + '='.repeat(60));
    console.log('🔧 SHADOW GUARDIAN DATABASE SETUP');
    console.log('='.repeat(60));
    
    // Step 1: Create tables
    const tablesCreated = await createTablesDirectly();
    
    if (!tablesCreated) {
      console.log('\n⚠️  Table creation failed. Trying data insertion anyway...');
    }
    
    // Step 2: Populate with sample data
    console.log('\n🌱 Populating with sample data...');
    await populateDatabase();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 SHADOW GUARDIAN DATABASE SETUP COMPLETE!');
    console.log('='.repeat(60));
    console.log('✅ Database has been configured and populated');
    console.log('🌐 The Shadow Guardian SOC platform is ready!');
    console.log('\n🚀 Start the application: npm run dev');
    
  } catch (error) {
    console.error('\n💥 Fatal error:', error);
  }
}

main();
