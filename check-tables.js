#!/usr/bin/env node

// Check current database tables
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  try {
    console.log('🔍 Checking database tables...\n');
    
    // Try to get table information using a more direct approach
    const { data, error } = await supabase.rpc('check_table_exists', { table_name: 'security_tools' });
    
    if (error) {
      console.log('Error checking tables with RPC:', error.message);
      
      // Alternative: try to query information_schema
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (tablesError) {
        console.log('Error querying information_schema:', tablesError.message);
        
        // Last resort: try each table individually
        const tablesToCheck = ['security_tools', 'training_modules', 'security_threats', 'system_metrics', 'user_profiles', 'user_progress'];
        
        for (const table of tablesToCheck) {
          try {
            const { data, error } = await supabase.from(table).select('*').limit(1);
            if (error) {
              console.log(`❌ Table '${table}': ${error.message}`);
            } else {
              console.log(`✅ Table '${table}': Exists (${data?.length || 0} rows checked)`);
            }
          } catch (err) {
            console.log(`❌ Table '${table}': ${err.message}`);
          }
        }
      } else {
        console.log('📋 Found tables:', tables.map(t => t.table_name));
      }
    } else {
      console.log('✅ Table check successful:', data);
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

checkTables();
