import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if we have valid Supabase configuration
const hasValidConfig = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.includes('supabase.co') &&
  supabaseAnonKey.length > 100 &&
  !supabaseUrl.includes('your-project-ref')
)

// Create Supabase client only if we have valid configuration
export const supabase = hasValidConfig 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null

// Export configuration status
export const isSupabaseConfigured = hasValidConfig

// Database Types
export interface UserProfile {
  id: string
  email: string
  username: string
  full_name: string
  clearance_level: 'PUBLIC' | 'SECRET' | 'CLASSIFIED' | 'APEX'
  role: string
  department: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface SecurityThreat {
  id: string
  type: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  source_ip: string
  target_ip?: string
  description: string
  status: 'Active' | 'Blocked' | 'Mitigated' | 'Investigating'
  created_at: string
  updated_at: string
  user_id: string
}

export interface SecurityTool {
  id: string
  name: string
  status: 'active' | 'inactive' | 'maintenance' | 'scanning' | 'standby'
  performance: number
  icon: string
  metrics: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface TrainingModule {
  id: string
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  duration: string
  type: string
  content?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  module_id: string
  progress: number
  completed: boolean
  started_at: string
  completed_at?: string
}

export interface SystemMetrics {
  id: string
  metric_type: string
  value: number
  timestamp: string
  metadata?: Record<string, unknown>
}
