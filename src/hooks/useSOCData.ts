import { useEffect, useState, useCallback } from 'react'
import { supabase, type SecurityThreat, type SecurityTool, type TrainingModule, type UserProgress, type SystemMetrics, isSupabaseConfigured } from '../lib/supabase'

// Demo data for when Supabase is not available
const demoThreats: SecurityThreat[] = [
  {
    id: '1',
    type: 'Malware',
    severity: 'High',
    source_ip: '192.168.1.45',
    target_ip: '10.0.0.100',
    status: 'Blocked',
    description: 'Suspicious executable detected',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'demo-user'
  },
  {
    id: '2',
    type: 'DDoS',
    severity: 'Critical',
    source_ip: '203.45.67.89',
    status: 'Mitigated',
    description: 'High volume traffic detected',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'demo-user'
  }
]

const demoTools: SecurityTool[] = [
  {
    id: '1',
    name: 'Suricata IDS',
    status: 'active',
    performance: 98,
    icon: '🛡️',
    metrics: { threats: 156 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Elasticsearch',
    status: 'active',
    performance: 95,
    icon: '🔍',
    metrics: { events: 2847 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const demoModules: TrainingModule[] = [
  {
    id: '1',
    title: 'Advanced Threat Hunting',
    description: 'Learn advanced techniques for proactive threat hunting using MITRE ATT&CK framework',
    difficulty: 'Expert',
    duration: '45 minutes',
    type: 'Interactive Lab',
    content: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Hook for managing security threats
export function useThreats() {
  const [threats, setThreats] = useState<SecurityThreat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      // Use demo data
      setThreats(demoThreats)
      setLoading(false)
      return
    }

    fetchThreats()

    // Set up real-time subscription
    const subscription = supabase
      .channel('threats')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'security_threats' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setThreats(prev => [payload.new as SecurityThreat, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setThreats(prev => prev.map(threat => 
              threat.id === payload.new.id ? payload.new as SecurityThreat : threat
            ))
          } else if (payload.eventType === 'DELETE') {
            setThreats(prev => prev.filter(threat => threat.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchThreats = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('security_threats')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setThreats(data)
    } catch (error) {
      console.error('Error fetching threats:', error)
      setThreats(demoThreats)
    } finally {
      setLoading(false)
    }
  }

  return {
    threats,
    loading,
    refetch: fetchThreats
  }
}

// Hook for managing security tools
export function useSecurityTools() {
  const [tools, setTools] = useState<SecurityTool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      // Use demo data
      setTools(demoTools)
      setLoading(false)
      return
    }

    fetchTools()
  }, [])

  const fetchTools = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('security_tools')
        .select('*')
        .order('name')

      if (error) throw error
      setTools(data)
    } catch (error) {
      console.error('Error fetching security tools:', error)
      setTools(demoTools)
    } finally {
      setLoading(false)
    }
  }

  return {
    tools,
    loading,
    refetch: fetchTools
  }
}

// Hook for managing training modules
export function useTrainingModules() {
  const [modules, setModules] = useState<TrainingModule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      // Use demo data
      setModules(demoModules)
      setLoading(false)
      return
    }

    fetchModules()
  }, [])

  const fetchModules = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('training_modules')
        .select('*')
        .order('title')

      if (error) throw error
      setModules(data)
    } catch (error) {
      console.error('Error fetching training modules:', error)
      setModules(demoModules)
    } finally {
      setLoading(false)
    }
  }

  return {
    modules,
    loading,
    refetch: fetchModules
  }
}

// Hook for managing user progress
export function useUserProgress(userId?: string) {
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProgress = useCallback(async () => {
    if (!userId || !isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)

      if (error) throw error
      setProgress(data)
    } catch (error) {
      console.error('Error fetching user progress:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (!userId || !isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    fetchProgress()
  }, [userId, fetchProgress])

  return {
    progress,
    loading,
    refetch: fetchProgress
  }
}

// Hook for system metrics
export function useSystemMetrics() {
  const [metrics, setMetrics] = useState<SystemMetrics[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100)

      if (error) throw error
      setMetrics(data)
    } catch (error) {
      console.error('Error fetching system metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    metrics,
    loading,
    refetch: fetchMetrics
  }
}
