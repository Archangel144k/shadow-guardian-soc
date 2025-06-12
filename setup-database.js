#!/usr/bin/env node

// Database Setup and Population Script for Shadow Guardian SOC
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

console.log('🚀 Shadow Guardian - Database Setup & Population\n');
console.log('🔗 Supabase URL:', supabaseUrl);
console.log('🔑 API Key:', `${supabaseKey.substring(0, 20)}...`);

async function executeSQL(sqlContent, description) {
  console.log(`\n📝 ${description}...`);
  
  try {
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`   Found ${statements.length} SQL statements to execute`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length < 10) continue; // Skip very short statements
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement });
        
        if (error) {
          console.log(`   ⚠️  Statement ${i + 1}: ${error.message}`);
          errorCount++;
        } else {
          console.log(`   ✅ Statement ${i + 1}: Executed successfully`);
          successCount++;
        }
      } catch (err) {
        console.log(`   ❌ Statement ${i + 1}: ${err.message}`);
        errorCount++;
      }
    }
    
    console.log(`   📊 Results: ${successCount} succeeded, ${errorCount} failed`);
    return successCount > 0;
    
  } catch (error) {
    console.log(`   💥 Error executing SQL: ${error.message}`);
    return false;
  }
}

async function createTablesDirectly() {
  console.log('\n🔨 Creating database tables directly...');
  
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
          vendor TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'active',
          performance INTEGER DEFAULT 0,
          icon TEXT,
          description TEXT,
          metrics JSONB DEFAULT '{}',
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
          tags TEXT[] DEFAULT '{}',
          is_published BOOLEAN DEFAULT false,
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
          user_id UUID REFERENCES user_profiles(id),
          module_id UUID REFERENCES training_modules(id),
          progress_percentage INTEGER DEFAULT 0,
          completed_at TIMESTAMPTZ,
          score INTEGER,
          time_spent INTEGER DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
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
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    }
  ];
  
  let successCount = 0;
  
  for (const table of tables) {
    try {
      console.log(`   Creating table: ${table.name}`);
      
      // First try using raw SQL execution
      const { data, error } = await supabase.rpc('exec', { sql: table.sql });
      
      if (error) {
        console.log(`   ❌ Failed to create ${table.name}: ${error.message}`);
      } else {
        console.log(`   ✅ Table ${table.name}: Created successfully`);
        successCount++;
      }
    } catch (err) {
      console.log(`   ❌ Exception creating ${table.name}: ${err.message}`);
    }
  }
  
  console.log(`\n📊 Tables created: ${successCount}/${tables.length}`);
  return successCount === tables.length;
}

async function testTableCreation() {
  console.log('\n🧪 Testing manual table creation...');
  
  try {
    // Try creating a simple test table
    const testSQL = `
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    
    const { data, error } = await supabase.rpc('exec', { sql: testSQL });
    
    if (error) {
      console.log(`   ❌ Test table creation failed: ${error.message}`);
      console.log('   This suggests the database user may not have CREATE permissions');
      return false;
    } else {
      console.log(`   ✅ Test table created successfully`);
      
      // Clean up test table
      await supabase.rpc('exec', { sql: 'DROP TABLE IF EXISTS test_table;' });
      console.log(`   🧹 Test table cleaned up`);
      return true;
    }
  } catch (err) {
    console.log(`   ❌ Test failed: ${err.message}`);
    return false;
  }
}

async function checkPermissions() {
  console.log('\n🔐 Checking database permissions...');
  
  try {
    // Try to check what permissions we have
    const { data, error } = await supabase.rpc('current_user');
    
    if (error) {
      console.log(`   ⚠️  Cannot check current user: ${error.message}`);
    } else {
      console.log(`   👤 Current user: ${data || 'Unknown'}`);
    }
    
    // Try to see if we can create tables
    const testResult = await testTableCreation();
    return testResult;
    
  } catch (err) {
    console.log(`   ❌ Permission check failed: ${err.message}`);
    return false;
  }
}

async function populateWithMinimalData() {
  console.log('\n📊 Populating database with minimal sample data...');
  
  try {
    // Add a few security tools
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
          description: 'Network intrusion detection system'
        },
        {
          name: 'Elasticsearch',
          type: 'SIEM',
          vendor: 'Elastic',
          status: 'active',
          performance: 95,
          icon: '🔍',
          description: 'Search and analytics engine'
        }
      ])
      .select();
    
    if (toolError) {
      console.log(`   ❌ Failed to add security tools: ${toolError.message}`);
    } else {
      console.log(`   ✅ Added ${toolData?.length || 0} security tools`);
    }
    
    // Add a training module
    const { data: moduleData, error: moduleError } = await supabase
      .from('training_modules')
      .insert([
        {
          title: 'Threat Hunting Basics',
          description: 'Introduction to threat hunting concepts',
          category: 'threat-hunting',
          difficulty: 'Beginner',
          duration: '30 minutes',
          type: 'Tutorial',
          is_published: true
        }
      ])
      .select();
    
    if (moduleError) {
      console.log(`   ❌ Failed to add training module: ${moduleError.message}`);
    } else {
      console.log(`   ✅ Added ${moduleData?.length || 0} training modules`);
    }
    
    // Add a system metric
    const { data: metricData, error: metricError } = await supabase
      .from('system_metrics')
      .insert([
        {
          metric_name: 'threat_detection_rate',
          metric_value: 98.5,
          metric_unit: 'percentage',
          category: 'security'
        }
      ])
      .select();
    
    if (metricError) {
      console.log(`   ❌ Failed to add system metric: ${metricError.message}`);
    } else {
      console.log(`   ✅ Added ${metricData?.length || 0} system metrics`);
    }
    
    return true;
  } catch (err) {
    console.log(`   ❌ Population failed: ${err.message}`);
    return false;
  }
}

async function main() {
  try {
    console.log('\n' + '='.repeat(60));
    console.log('🔧 SHADOW GUARDIAN DATABASE SETUP');
    console.log('='.repeat(60));
    
    // Step 1: Check permissions
    const hasPermissions = await checkPermissions();
    
    if (!hasPermissions) {
      console.log('\n⚠️  Database permissions issue detected.');
      console.log('📋 The tables may need to be created via the Supabase Dashboard SQL Editor.');
      console.log('🌐 Please visit: https://supabase.com/dashboard/project/qrgbhlujkjfbqvcybxbl/sql/new');
      console.log('\n📋 Copy and paste the schema.sql file contents into the SQL editor.');
      
      // Let's try anyway with direct table creation
      console.log('\n🔄 Attempting direct table creation anyway...');
    }
    
    // Step 2: Try to create tables
    const tablesCreated = await createTablesDirectly();
    
    if (!tablesCreated) {
      console.log('\n⚠️  Could not create tables programmatically.');
      console.log('📋 Please create the tables manually using the Supabase Dashboard.');
      return;
    }
    
    // Step 3: Populate with sample data
    console.log('\n🌱 Tables created successfully! Now populating with data...');
    await populateWithMinimalData();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 DATABASE SETUP COMPLETE!');
    console.log('='.repeat(60));
    console.log('✅ Tables have been created and populated with sample data.');
    console.log('🌐 The Shadow Guardian SOC platform is ready to use!');
    
  } catch (error) {
    console.error('\n💥 Fatal error:', error);
  }
}

main();
