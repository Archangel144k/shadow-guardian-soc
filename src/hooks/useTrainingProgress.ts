import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured, type UserProgress } from '../lib/supabase'

export interface TrainingProgressManager {
  progress: UserProgress[]
  loading: boolean
  updateModuleProgress: (moduleId: string, progress: number) => Promise<boolean>
  startModule: (moduleId: string) => Promise<boolean>
  completeModule: (moduleId: string, score?: number) => Promise<boolean>
  submitQuiz: (moduleId: string, answers: number[], questions: any[], score: number) => Promise<boolean>
  getModuleProgress: (moduleId: string) => number
  isModuleCompleted: (moduleId: string) => boolean
  getQuizScore: (moduleId: string) => number | undefined
  refetch: () => Promise<void>
}

export function useTrainingProgress(userId?: string): TrainingProgressManager {
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
      setProgress(data || [])
    } catch (error) {
      console.error('Error fetching user progress:', error)
      setProgress([])
    } finally {
      setLoading(false)
    }
  }, [userId])

  const updateProgressInDB = useCallback(async (
    moduleId: string,
    updates: Partial<UserProgress>
  ): Promise<boolean> => {
    if (!userId || !isSupabaseConfigured || !supabase) {
      return false
    }

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          module_id: moduleId,
          ...updates,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,module_id'
        })
        .select()

      if (error) throw error

      // Update local state
      setProgress(prev => {
        const existingIndex = prev.findIndex(p => p.module_id === moduleId)
        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = { ...updated[existingIndex], ...updates }
          return updated
        } else {
          return [...prev, data[0]]
        }
      })

      return true
    } catch (error) {
      console.error('Error updating progress:', error)
      return false
    }
  }, [userId])

  const updateModuleProgress = useCallback(async (
    moduleId: string,
    progressPercentage: number
  ): Promise<boolean> => {
    const status = progressPercentage === 100 ? 'completed' : 
                   progressPercentage > 0 ? 'in_progress' : 'not_started'
    
    const updates: Partial<UserProgress> = {
      progress_percentage: progressPercentage,
      status,
      last_activity: new Date().toISOString()
    }

    if (progressPercentage === 100) {
      updates.completed_at = new Date().toISOString()
    }

    return updateProgressInDB(moduleId, updates)
  }, [updateProgressInDB])

  const startModule = useCallback(async (moduleId: string): Promise<boolean> => {
    const updates: Partial<UserProgress> = {
      status: 'in_progress',
      progress_percentage: 0,
      started_at: new Date().toISOString(),
      last_activity: new Date().toISOString(),
      attempts: 1
    }

    return updateProgressInDB(moduleId, updates)
  }, [updateProgressInDB])

  const completeModule = useCallback(async (
    moduleId: string,
    score?: number
  ): Promise<boolean> => {
    const updates: Partial<UserProgress> = {
      status: 'completed',
      progress_percentage: 100,
      completed_at: new Date().toISOString(),
      last_activity: new Date().toISOString()
    }

    if (score !== undefined) {
      updates.score = score
    }

    return updateProgressInDB(moduleId, updates)
  }, [updateProgressInDB])

  const submitQuiz = useCallback(async (
    moduleId: string,
    answers: number[],
    questions: any[],
    score: number
  ): Promise<boolean> => {
    const completion_data = {
      quiz_answers: answers,
      quiz_questions: questions.length,
      quiz_score: score,
      submitted_at: new Date().toISOString()
    }

    const updates: Partial<UserProgress> = {
      score,
      completion_data,
      last_activity: new Date().toISOString()
    }

    return updateProgressInDB(moduleId, updates)
  }, [updateProgressInDB])

  const getModuleProgress = useCallback((moduleId: string): number => {
    const moduleProgress = progress.find(p => p.module_id === moduleId)
    return moduleProgress?.progress_percentage || 0
  }, [progress])

  const isModuleCompleted = useCallback((moduleId: string): boolean => {
    const moduleProgress = progress.find(p => p.module_id === moduleId)
    return moduleProgress?.status === 'completed'
  }, [progress])

  const getQuizScore = useCallback((moduleId: string): number | undefined => {
    const moduleProgress = progress.find(p => p.module_id === moduleId)
    return moduleProgress?.score
  }, [progress])

  useEffect(() => {
    fetchProgress()
  }, [fetchProgress])

  return {
    progress,
    loading,
    updateModuleProgress,
    startModule,
    completeModule,
    submitQuiz,
    getModuleProgress,
    isModuleCompleted,
    getQuizScore,
    refetch: fetchProgress
  }
}
