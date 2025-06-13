// Simple debug script to test training module functionality
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Testing Shadow Guardian Training System...');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? 'Set' : 'Not set');

if (supabaseUrl && supabaseKey) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Test connection
  supabase.from('training_modules').select('count', { count: 'exact' })
    .then(({ count, error }) => {
      if (error) {
        console.error('Database connection error:', error);
      } else {
        console.log('Training modules in database:', count);
      }
    });
} else {
  console.log('Using demo mode (no Supabase configuration)');
}
