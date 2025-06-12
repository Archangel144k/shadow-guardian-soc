#!/usr/bin/env node

// Quick script to verify Supabase configuration
console.log('🔍 Checking Supabase Configuration...\n');

// Read environment variables
const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

console.log('VITE_SUPABASE_URL:', url || '❌ Not set');
console.log('VITE_SUPABASE_ANON_KEY:', key ? `✅ Set (${key.length} characters)` : '❌ Not set');

// Check if they're placeholder values
const isPlaceholderUrl = !url || url.includes('your-project-ref') || url.includes('localhost');
const isPlaceholderKey = !key || key.includes('your-anon-key') || key.length < 100;

console.log('\n📊 Configuration Status:');
console.log('URL Valid:', isPlaceholderUrl ? '❌ Placeholder detected' : '✅ Looks valid');
console.log('Key Valid:', isPlaceholderKey ? '❌ Placeholder detected' : '✅ Looks valid');

if (isPlaceholderUrl || isPlaceholderKey) {
  console.log('\n⚠️  Supabase appears to be using placeholder values');
  console.log('📝 Please update .env file with your actual Supabase credentials');
} else {
  console.log('\n✅ Supabase configuration looks valid!');
}

console.log('\n🚀 Application will run in', (isPlaceholderUrl || isPlaceholderKey) ? 'DEMO mode' : 'LIVE mode');
