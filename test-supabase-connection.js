#!/usr/bin/env node

// Test Supabase connection and check existing schema
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Shadow Guardian - Supabase Connection Test\n');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Environment variables not found');
  console.log('VITE_SUPABASE_URL:', supabaseUrl || 'Not set');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? `Set (${supabaseKey.length} chars)` : 'Not set');
  process.exit(1);
}

console.log('✅ Environment variables loaded:');
console.log('URL:', supabaseUrl);
console.log('Key:', `${supabaseKey.substring(0, 20)}...${supabaseKey.substring(supabaseKey.length - 10)}`);
console.log('');

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection and check schema
async function testConnection() {
  console.log('🚀 Testing Supabase connection...\n');

  // Required tables for Shadow Guardian SOC
  const requiredTables = [
    'user_profiles',
    'security_threats', 
    'security_tools',
    'training_modules',
    'user_progress',
    'system_metrics'
  ];

  const results = {
    connection: false,
    tables: {},
    errors: []
  };

  try {
    // Test basic connection by trying to query one of our expected tables
    console.log('1. Testing basic connection...');
    
    // Simple connection test
    let connectionWorking = false;
    try {
      // Try a simple query that should work even if table doesn't exist
      const { error: testError } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(0);
      
      // If we get a "relation does not exist" error, connection is working but table is missing
      // If we get other errors, there might be connection issues
      if (!testError || testError.message.includes('relation') || testError.message.includes('does not exist')) {
        connectionWorking = true;
      }
    } catch (err) {
      // Connection test failed
    }

    if (!connectionWorking) {
      console.log('❌ Connection failed - unable to reach Supabase');
      results.errors.push('Connection failed');
      return results;
    }

    console.log('✅ Connection successful!\n');
    results.connection = true;

    // Check each required table
    console.log('2. Checking required tables...');
    for (const tableName of requiredTables) {
      try {
        console.log(`   Checking table: ${tableName}`);
        
        // Try to query the table
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.log(`   ❌ ${tableName}: ${error.message}`);
          results.tables[tableName] = { 
            exists: false, 
            error: error.message,
            count: 0 
          };
        } else {
          console.log(`   ✅ ${tableName}: Found (${count || 0} records)`);
          results.tables[tableName] = { 
            exists: true, 
            count: count || 0 
          };
        }
      } catch (err) {
        console.log(`   ❌ ${tableName}: ${err.message}`);
        results.tables[tableName] = { 
          exists: false, 
          error: err.message,
          count: 0 
        };
      }
    }

    console.log('');

    // Check authentication
    console.log('3. Testing authentication...');
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.log('ℹ️  No authenticated user (this is normal for anon key)');
      } else if (user) {
        console.log('✅ Authenticated user found:', user.email);
      } else {
        console.log('ℹ️  No authenticated user');
      }
    } catch (err) {
      console.log('ℹ️  Auth check skipped:', err.message);
    }

    console.log('');

    // Summary
    console.log('📊 Summary:');
    console.log('Connection:', results.connection ? '✅ Working' : '❌ Failed');
    
    const existingTables = Object.entries(results.tables)
      .filter(([, info]) => info.exists)
      .map(([name]) => name);
    
    const missingTables = Object.entries(results.tables)
      .filter(([, info]) => !info.exists)
      .map(([name]) => name);

    console.log(`Tables found: ${existingTables.length}/${requiredTables.length}`);
    
    if (existingTables.length > 0) {
      console.log('✅ Existing tables:', existingTables.join(', '));
    }
    
    if (missingTables.length > 0) {
      console.log('❌ Missing tables:', missingTables.join(', '));
    }

    return results;

  } catch (error) {
    console.log('❌ Test failed:', error.message);
    results.errors.push(`Test failed: ${error.message}`);
    return results;
  }
}

// Run the test
testConnection()
  .then(results => {
    console.log('\n🏁 Test completed!');
    
    if (results.connection) {
      const missingCount = Object.values(results.tables).filter(t => !t.exists).length;
      if (missingCount === 0) {
        console.log('🎉 All tables are set up! Your Supabase project is ready.');
      } else {
        console.log(`⚠️  ${missingCount} tables need to be created. Check the SQL scripts.`);
      }
    } else {
      console.log('🔧 Connection issues detected. Check your credentials and project settings.');
    }
  })
  .catch(error => {
    console.log('💥 Test crashed:', error.message);
  });
