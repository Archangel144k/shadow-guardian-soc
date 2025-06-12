import { useEffect, useState } from 'react'
import { supabase, SecurityThreat, SecurityTool, TrainingModule, UserProgress, SystemMetrics } from '../lib/supabase'

// Hook for managing security threats
export function useThreats() {
  const [threats, setThreats] = useState<SecurityThreat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
    } finally {
      setLoading(false)
    }
  }

  const addThreat = async (threat: Omit<SecurityThreat, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const { data, error } = await supabase
        .from('security_threats')
        .insert(threat)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const updateThreatStatus = async (id: string, status: SecurityThreat['status']) => {
    try {
      const { data, error } = await supabase
        .from('security_threats')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  return {
    threats,
    loading,
    addThreat,
    updateThreatStatus,
    refetch: fetchThreats,
  }
}

// Hook for managing security tools
export function useSecurityTools() {
  const [tools, setTools] = useState<SecurityTool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTools()

    // Set up real-time subscription
    const subscription = supabase
      .channel('tools')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'security_tools' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setTools(prev => prev.map(tool => 
              tool.id === payload.new.id ? payload.new as SecurityTool : tool
            ))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchTools = async () => {
    try {
      const { data, error } = await supabase
        .from('security_tools')
        .select('*')
        .order('name')

      if (error) throw error
      setTools(data)
    } catch (error) {
      console.error('Error fetching tools:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateToolStatus = async (id: string, status: SecurityTool['status'], performance?: number) => {
    try {
      const updates: any = { status, updated_at: new Date().toISOString() }
      if (performance !== undefined) updates.performance = performance

      const { data, error } = await supabase
        .from('security_tools')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  return {
    tools,
    loading,
    updateToolStatus,
    refetch: fetchTools,
  }
}

// Hook for training modules and user progress
export function useTraining(userId?: string) {
  const [modules, setModules] = useState<TrainingModule[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchModules()
    if (userId) {
      fetchUserProgress(userId)
    }
  }, [userId])

  const fetchModules = async () => {
    try {
      const { data, error } = await supabase
        .from('training_modules')
        .select('*')
        .order('difficulty', { ascending: true })

      if (error) throw error
      setModules(data)
    } catch (error) {
      console.error('Error fetching training modules:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserProgress = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)

      if (error) throw error
      setUserProgress(data)
    } catch (error) {
      console.error('Error fetching user progress:', error)
    }
  }

  const updateProgress = async (moduleId: string, progress: number) => {
    if (!userId) return { data: null, error: new Error('No user ID provided') }

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          module_id: moduleId,
          progress,
          completed: progress >= 100,
          completed_at: progress >= 100 ? new Date().toISOString() : null,
        })
        .select()
        .single()

      if (error) throw error
      
      // Update local state
      setUserProgress(prev => {
        const existing = prev.find(p => p.module_id === moduleId)
        if (existing) {
          return prev.map(p => p.module_id === moduleId ? data : p)
        } else {
          return [...prev, data]
        }
      })

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  return {
    modules,
    userProgress,
    loading,
    updateProgress,
    refetch: () => {
      fetchModules()
      if (userId) fetchUserProgress(userId)
    },
  }
}

// Hook for system metrics
export function useMetrics() {
  const [metrics, setMetrics] = useState<SystemMetrics[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()

    // Set up real-time subscription
    const subscription = supabase
      .channel('metrics')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'system_metrics' },
        (payload) => {
          setMetrics(prev => [payload.new as SystemMetrics, ...prev.slice(0, 99)]) // Keep only latest 100
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100)

      if (error) throw error
      setMetrics(data)
    } catch (error) {
      console.error('Error fetching metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const addMetric = async (metric: Omit<SystemMetrics, 'id' | 'timestamp'>) => {
    try {
      const { data, error } = await supabase
        .from('system_metrics')
        .insert(metric)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  return {
    metrics,
    loading,
    addMetric,
    refetch: fetchMetrics,
  }
}
