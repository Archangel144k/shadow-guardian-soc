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
    content: {
      lessons: [
        {
          id: 'lesson-1',
          title: 'Introduction to Threat Hunting',
          content: 'Threat hunting is a proactive security practice that involves searching for threats that may have evaded traditional security measures...',
          type: 'text',
          duration: 10
        },
        {
          id: 'lesson-2',
          title: 'MITRE ATT&CK Framework',
          content: 'The MITRE ATT&CK framework is a globally-accessible knowledge base of adversary tactics and techniques...',
          type: 'interactive',
          duration: 15
        },
        {
          id: 'lesson-3',
          title: 'Hands-on Lab: Hunt for APT29',
          content: 'In this lab, you will hunt for indicators of APT29 (Cozy Bear) activity in a simulated environment...',
          type: 'lab',
          duration: 20
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'What is the primary goal of threat hunting?',
            options: ['Incident response', 'Proactive threat detection', 'Compliance', 'Vulnerability scanning'],
            correct: 1
          },
          {
            id: 'q2',
            question: 'Which MITRE ATT&CK tactic involves establishing persistence?',
            options: ['Initial Access', 'Persistence', 'Privilege Escalation', 'Defense Evasion'],
            correct: 1
          }
        ]
      }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Incident Response Procedures',
    description: 'Practice incident response workflows and containment strategies',
    difficulty: 'Intermediate',
    duration: '30 minutes',
    type: 'Simulation',
    content: {
      lessons: [
        {
          id: 'lesson-1',
          title: 'IR Framework Overview',
          content: 'Incident response follows a structured approach: Preparation, Identification, Containment, Eradication, Recovery, and Lessons Learned...',
          type: 'text',
          duration: 8
        },
        {
          id: 'lesson-2',
          title: 'Containment Strategies',
          content: 'Learn different containment approaches for various incident types...',
          type: 'interactive',
          duration: 12
        },
        {
          id: 'lesson-3',
          title: 'Simulation: Ransomware Response',
          content: 'Respond to a simulated ransomware attack following proper IR procedures...',
          type: 'simulation',
          duration: 10
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'What is the first phase of incident response?',
            options: ['Identification', 'Preparation', 'Containment', 'Recovery'],
            correct: 1
          }
        ]
      }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Digital Forensics Fundamentals',
    description: 'Master the basics of digital forensics and evidence collection',
    difficulty: 'Beginner',
    duration: '60 minutes',
    type: 'Tutorial',
    content: {
      lessons: [
        {
          id: 'lesson-1',
          title: 'Forensics Principles',
          content: 'Digital forensics is the process of uncovering and interpreting electronic data for use in legal proceedings...',
          type: 'text',
          duration: 15
        },
        {
          id: 'lesson-2',
          title: 'Evidence Collection',
          content: 'Learn proper evidence collection techniques to maintain chain of custody...',
          type: 'interactive',
          duration: 20
        },
        {
          id: 'lesson-3',
          title: 'Lab: Memory Analysis',
          content: 'Analyze a memory dump to identify malicious processes and network connections...',
          type: 'lab',
          duration: 25
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'What is the most important aspect of digital evidence?',
            options: ['Speed of collection', 'Chain of custody', 'File size', 'Encryption'],
            correct: 1
          }
        ]
      }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Red Team Operations',
    description: 'Offensive security techniques and penetration testing methodologies',
    difficulty: 'Expert',
    duration: '90 minutes',
    type: 'Hands-on Lab',
    content: {
      lessons: [
        {
          id: 'lesson-1',
          title: 'Red Team Methodology',
          content: 'Red team operations simulate real-world attacks to test organizational defenses...',
          type: 'text',
          duration: 20
        },
        {
          id: 'lesson-2',
          title: 'Reconnaissance Techniques',
          content: 'Learn OSINT and active reconnaissance methods used by attackers...',
          type: 'interactive',
          duration: 25
        },
        {
          id: 'lesson-3',
          title: 'Lab: Full Attack Chain',
          content: 'Execute a complete attack chain from reconnaissance to data exfiltration...',
          type: 'lab',
          duration: 45
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'What is the primary goal of red team operations?',
            options: ['Find vulnerabilities', 'Test defenses', 'Cause damage', 'Steal data'],
            correct: 1
          }
        ]
      }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    title: 'MITRE ATT&CK Framework',
    description: 'Understanding adversary tactics, techniques, and procedures',
    difficulty: 'Intermediate',
    duration: '45 minutes',
    type: 'Tutorial',
    content: {
      lessons: [
        {
          id: 'lesson-1',
          title: 'ATT&CK Matrix Overview',
          content: 'The ATT&CK matrix organizes known adversary tactics and techniques into a comprehensive framework...',
          type: 'text',
          duration: 15
        },
        {
          id: 'lesson-2',
          title: 'Tactics vs Techniques',
          content: 'Understand the difference between tactics (why) and techniques (how) in the ATT&CK framework...',
          type: 'interactive',
          duration: 15
        },
        {
          id: 'lesson-3',
          title: 'Mapping Threats to ATT&CK',
          content: 'Practice mapping real-world threats to ATT&CK techniques...',
          type: 'exercise',
          duration: 15
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'How many tactics are in the Enterprise ATT&CK matrix?',
            options: ['12', '14', '16', '18'],
            correct: 1
          }
        ]
      }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    title: 'Malware Analysis Basics',
    description: 'Static and dynamic malware analysis techniques',
    difficulty: 'Advanced',
    duration: '75 minutes',
    type: 'Interactive Lab',
    content: {
      lessons: [
        {
          id: 'lesson-1',
          title: 'Static Analysis Fundamentals',
          content: 'Static analysis examines malware without executing it, using tools like strings, file, and disassemblers...',
          type: 'text',
          duration: 20
        },
        {
          id: 'lesson-2',
          title: 'Dynamic Analysis Setup',
          content: 'Learn to set up a safe dynamic analysis environment using virtual machines and sandboxes...',
          type: 'interactive',
          duration: 25
        },
        {
          id: 'lesson-3',
          title: 'Lab: Analyze Real Malware',
          content: 'Analyze a real malware sample using both static and dynamic techniques...',
          type: 'lab',
          duration: 30
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'What is the main advantage of static analysis?',
            options: ['Shows runtime behavior', 'Safe to perform', 'Reveals network traffic', 'Shows file system changes'],
            correct: 1
          }
        ]
      }
    },
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
      // Use demo data with full content structure
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
        .eq('is_published', true)
        .order('title')

      if (error) throw error
      
      // Enhance modules with detailed content if they don't have it
      const enhancedModules = (data || []).map(module => {
        return enhanceModuleContent(module)
      })
      
      setModules(enhancedModules.length > 0 ? enhancedModules : demoModules)
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

// Function to enhance modules with proper lesson content
function enhanceModuleContent(module: TrainingModule): TrainingModule {
  if (module.content && module.content.lessons && module.content.lessons.length > 0) {
    return module // Already has detailed content
  }

  // Generate lesson content based on module category and type
  const lessons = generateLessonsForModule(module)
  const quiz = generateQuizForModule(module)

  return {
    ...module,
    content: {
      lessons,
      quiz
    }
  }
}

function generateLessonsForModule(module: TrainingModule) {
  const baseLessons: Record<string, any> = {
    'Advanced Threat Hunting': [
      {
        id: 'lesson-1',
        title: 'Introduction to Threat Hunting',
        content: 'Threat hunting is a proactive cybersecurity practice that involves actively searching for cyber threats that are lurking undetected in a network. Unlike traditional security monitoring that relies on automated tools to flag known threats, threat hunting assumes that adversaries have already breached the perimeter and are hiding within the network.\n\nKey concepts include:\n• Hypothesis-driven approach\n• Behavioral analysis\n• IOC and IOA development\n• MITRE ATT&CK framework integration\n\nThreat hunters use a combination of manual techniques and machine-assisted analysis to uncover threats that automated systems might miss.',
        type: 'text' as const,
        duration: 10
      },
      {
        id: 'lesson-2',
        title: 'MITRE ATT&CK Framework Deep Dive',
        content: 'The MITRE ATT&CK framework is essential for modern threat hunting. It provides a comprehensive matrix of adversary tactics, techniques, and procedures (TTPs) based on real-world observations.\n\nLab Exercise: Navigate the ATT&CK matrix and identify common techniques used by APT groups:\n1. Open the MITRE ATT&CK website\n2. Explore the Enterprise matrix\n3. Focus on Initial Access tactics\n4. Identify techniques used by APT29\n\nThis hands-on exploration will help you understand how adversaries operate and what to hunt for in your environment.',
        type: 'interactive' as const,
        duration: 20
      },
      {
        id: 'lesson-3',
        title: 'Practical Hunting Exercise',
        content: 'Time for hands-on threat hunting! In this exercise, you\'ll analyze real network logs and endpoint data to identify potential threats.\n\nScenario: Your organization has experienced unusual network activity. Use the provided tools and data to:\n\n1. Analyze DNS queries for suspicious domains\n2. Examine process execution logs for anomalies\n3. Investigate network connections to external IPs\n4. Create threat hunting hypotheses\n5. Develop custom detection rules\n\nThis practical exercise simulates real-world threat hunting scenarios you\'ll encounter in the field.',
        type: 'lab' as const,
        duration: 25
      }
    ],
    'Incident Response Procedures': [
      {
        id: 'lesson-1',
        title: 'IR Framework and Methodology',
        content: 'Incident Response (IR) is a structured approach to handling security incidents. The NIST framework defines six key phases:\n\n1. Preparation - Establishing capabilities\n2. Identification - Detecting incidents\n3. Containment - Limiting damage\n4. Eradication - Removing threats\n5. Recovery - Restoring operations\n6. Lessons Learned - Improving processes\n\nEffective IR requires coordination between multiple teams, clear communication, and well-defined procedures.',
        type: 'text' as const,
        duration: 8
      },
      {
        id: 'lesson-2',
        title: 'Containment Strategies',
        content: 'Containment is critical to prevent further damage during an incident. Different types of incidents require different containment approaches:\n\nMalware Incident:\n• Isolate infected systems\n• Block malicious domains/IPs\n• Preserve evidence\n\nData Breach:\n• Secure compromised accounts\n• Monitor for data exfiltration\n• Coordinate with legal team\n\nDDoS Attack:\n• Implement rate limiting\n• Activate DDoS protection\n• Coordinate with ISP\n\nPractice these scenarios in our interactive simulator.',
        type: 'interactive' as const,
        duration: 15
      },
      {
        id: 'lesson-3',
        title: 'Ransomware Response Simulation',
        content: 'You are the incident commander responding to a ransomware attack affecting 50+ workstations.\n\nYour objectives:\n1. Contain the spread immediately\n2. Assess the scope of encryption\n3. Preserve forensic evidence\n4. Coordinate with stakeholders\n5. Plan recovery operations\n\nMake decisions quickly and justify your actions. Every minute counts in a ransomware incident!',
        type: 'simulation' as const,
        duration: 12
      }
    ]
  }

  return baseLessons[module.title] || [
    {
      id: 'lesson-1',
      title: `Introduction to ${module.title}`,
      content: `Welcome to ${module.title}. This training module will teach you essential concepts and practical skills in this area of cybersecurity.\n\nKey learning objectives:\n• Understand fundamental concepts\n• Learn industry best practices\n• Gain hands-on experience\n• Apply knowledge to real scenarios\n\nLet's begin your learning journey!`,
      type: 'text' as const,
      duration: 10
    },
    {
      id: 'lesson-2',
      title: 'Practical Application',
      content: `Now let's put theory into practice with hands-on exercises and real-world scenarios.\n\nThis interactive lesson will help you:\n• Practice key techniques\n• Work with industry tools\n• Solve realistic problems\n• Build practical skills\n\nComplete the exercises to demonstrate your understanding.`,
      type: 'interactive' as const,
      duration: 15
    },
    {
      id: 'lesson-3',
      title: 'Advanced Techniques',
      content: `In this final lesson, we'll explore advanced techniques and best practices.\n\nAdvanced topics include:\n• Expert-level methodologies\n• Complex scenario analysis\n• Tool integration\n• Performance optimization\n\nApply everything you've learned in this comprehensive exercise.`,
      type: 'lab' as const,
      duration: 20
    }
  ]
}

function generateQuizForModule(module: TrainingModule) {
  const baseQuizzes: Record<string, any> = {
    'Advanced Threat Hunting': {
      questions: [
        {
          id: 'q1',
          question: 'What is the primary goal of threat hunting?',
          options: ['Incident response', 'Proactive threat detection', 'Compliance monitoring', 'Vulnerability scanning'],
          correct: 1
        },
        {
          id: 'q2',
          question: 'Which MITRE ATT&CK tactic focuses on maintaining access?',
          options: ['Initial Access', 'Persistence', 'Privilege Escalation', 'Defense Evasion'],
          correct: 1
        },
        {
          id: 'q3',
          question: 'What type of analysis focuses on adversary behavior patterns?',
          options: ['Signature-based', 'Behavioral analysis', 'Heuristic analysis', 'Static analysis'],
          correct: 1
        }
      ]
    },
    'Incident Response Procedures': {
      questions: [
        {
          id: 'q1',
          question: 'What is the first phase of the NIST incident response framework?',
          options: ['Identification', 'Preparation', 'Containment', 'Recovery'],
          correct: 1
        },
        {
          id: 'q2',
          question: 'During a ransomware incident, what should be the immediate priority?',
          options: ['Pay the ransom', 'Contain the spread', 'Restore from backups', 'Contact law enforcement'],
          correct: 1
        }
      ]
    }
  }

  return baseQuizzes[module.title] || {
    questions: [
      {
        id: 'q1',
        question: `What is a key principle of ${module.title}?`,
        options: ['Speed over accuracy', 'Following best practices', 'Working in isolation', 'Avoiding documentation'],
        correct: 1
      },
      {
        id: 'q2',
        question: 'Which approach is most effective for learning cybersecurity skills?',
        options: ['Theory only', 'Hands-on practice', 'Memorization', 'Passive observation'],
        correct: 1
      }
    ]
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

  const updateProgress = useCallback(async (
    moduleId: string, 
    updates: Partial<Pick<UserProgress, 'status' | 'progress_percentage' | 'score' | 'time_spent' | 'completion_data' | 'completed_at' | 'started_at' | 'last_activity'>>
  ) => {
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
        })
        .select()

      if (error) throw error
      
      // Update local state
      setProgress(prev => {
        const existing = prev.find(p => p.module_id === moduleId)
        if (existing) {
          return prev.map(p => p.module_id === moduleId ? { ...p, ...updates } : p)
        } else {
          return [...prev, data[0]]
        }
      })

      return true
    } catch (error) {
      console.error('Error updating user progress:', error)
      return false
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
    refetch: fetchProgress,
    updateProgress
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

// Hook for managing learning progress and interactions
export function useLearning(userId?: string) {
  const [currentModule, setCurrentModule] = useState<TrainingModule | null>(null)
  const [currentLesson, setCurrentLesson] = useState<number>(0)
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>({})
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set())
  const [achievements, setAchievements] = useState<string[]>([])
  const [quizScores, setQuizScores] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  // Use the enhanced progress hook
  const { progress: userProgress, updateProgress } = useUserProgress(userId)

  // Initialize progress data from Supabase or demo data
  useEffect(() => {
    if (isSupabaseConfigured && userId && userProgress.length > 0) {
      // Load from Supabase data
      const progressMap: Record<string, number> = {}
      const completed = new Set<string>()
      const scores: Record<string, number> = {}

      userProgress.forEach(p => {
        progressMap[p.module_id] = p.progress_percentage
        if (p.status === 'completed') {
          completed.add(p.module_id)
        }
        if (p.score) {
          scores[p.module_id] = p.score
        }
      })

      setModuleProgress(progressMap)
      setCompletedModules(completed)
      setQuizScores(scores)
      setLoading(false)
    } else if (!isSupabaseConfigured) {
      // Demo progress data
      setModuleProgress({
        '1': 75,
        '2': 90,
        '3': 60,
        '4': 25,
        '5': 100,
        '6': 45
      })
      setCompletedModules(new Set(['5']))
      setAchievements(['threat_hunter_bronze', 'first_module_complete'])
      setQuizScores({
        '1': 85,
        '2': 92,
        '3': 78,
        '5': 95
      })
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [userProgress, userId])

  const startModule = useCallback(async (module: TrainingModule) => {
    console.log('useLearning: Starting module', module.title)
    setCurrentModule(module)
    setCurrentLesson(0)  // Always start from lesson 0

    // Update progress if not started
    if (!moduleProgress[module.id]) {
      setModuleProgress(prev => ({ ...prev, [module.id]: 0 }))
      
      // Update in Supabase if configured
      if (isSupabaseConfigured && userId) {
        await updateProgress(module.id, {
          status: 'in_progress',
          progress_percentage: 0,
          started_at: new Date().toISOString()
        })
      }
    }
  }, [moduleProgress, userId, updateProgress])

  const completeLesson = useCallback(async (moduleId: string, lessonIndex: number) => {
    if (!currentModule) return

    const lessons = currentModule.content?.lessons || []
    const progress = Math.round(((lessonIndex + 1) / lessons.length) * 100)

    setModuleProgress(prev => ({ ...prev, [moduleId]: progress }))

    // Update in Supabase if configured
    if (isSupabaseConfigured && userId) {
      const updates: any = {
        progress_percentage: progress,
        last_activity: new Date().toISOString()
      }

      if (progress === 100) {
        updates.status = 'completed'
        updates.completed_at = new Date().toISOString()
        setCompletedModules(prev => new Set([...prev, moduleId]))
      }

      await updateProgress(moduleId, updates)
    } else {
      // Demo mode
      if (progress === 100) {
        setCompletedModules(prev => new Set([...prev, moduleId]))
      }
    }

    // Check for achievements
    const completedCount = completedModules.size + (progress === 100 ? 1 : 0)
    if (completedCount === 1 && !achievements.includes('first_module_complete')) {
      setAchievements(prev => [...prev, 'first_module_complete'])
    }
    if (completedCount === 3 && !achievements.includes('learning_enthusiast')) {
      setAchievements(prev => [...prev, 'learning_enthusiast'])
    }
  }, [currentModule, completedModules, achievements, userId, updateProgress])

  const submitQuiz = useCallback((moduleId: string, answers: number[], questions: unknown[]) => {
    let correct = 0
    answers.forEach((answer, index) => {
      const question = questions[index] as { correct: number }
      if (answer === question?.correct) {
        correct++
      }
    })

    const score = Math.round((correct / questions.length) * 100)
    setQuizScores(prev => ({ ...prev, [moduleId]: score }))

    // Update in Supabase if configured (async in background)
    if (isSupabaseConfigured && userId) {
      updateProgress(moduleId, {
        score,
        completion_data: { quiz_answers: answers, quiz_score: score }
      })
    }

    // Achievement for high scores
    if (score >= 90 && !achievements.includes('quiz_master')) {
      setAchievements(prev => [...prev, 'quiz_master'])
    }

    return score
  }, [achievements, userId, updateProgress])

  const getOverallProgress = useCallback(() => {
    const totalModules = demoModules.length
    const completedCount = completedModules.size
    return Math.round((completedCount / totalModules) * 100)
  }, [completedModules])

  const getSkillLevel = useCallback(() => {
    const overallProgress = getOverallProgress()
    if (overallProgress >= 80) return 'Expert'
    if (overallProgress >= 60) return 'Advanced'
    if (overallProgress >= 30) return 'Intermediate'
    return 'Beginner'
  }, [getOverallProgress])

  const getModuleProgress = useCallback((moduleId: string) => {
    return moduleProgress[moduleId] || 0
  }, [moduleProgress])

  const isModuleCompleted = useCallback((moduleId: string) => {
    return completedModules.has(moduleId)
  }, [completedModules])

  const getQuizScore = useCallback((moduleId: string) => {
    return quizScores[moduleId]
  }, [quizScores])

  return {
    currentModule,
    currentLesson,
    moduleProgress,
    completedModules,
    achievements,
    quizScores,
    loading,
    startModule,
    completeLesson,
    submitQuiz,
    getOverallProgress,
    getSkillLevel,
    getModuleProgress,
    isModuleCompleted,
    getQuizScore,
    setCurrentLesson
  }
}

// Hook for achievement system
export function useAchievements() {
  const achievementDefinitions = {
    first_module_complete: {
      id: 'first_module_complete',
      title: 'First Steps',
      description: 'Complete your first training module',
      icon: '🎯',
      rarity: 'common' as const
    },
    learning_enthusiast: {
      id: 'learning_enthusiast',
      title: 'Learning Enthusiast',
      description: 'Complete 3 training modules',
      icon: '📚',
      rarity: 'uncommon' as const
    },
    threat_hunter_bronze: {
      id: 'threat_hunter_bronze',
      title: 'Threat Hunter (Bronze)',
      description: 'Complete threat hunting fundamentals',
      icon: '🏆',
      rarity: 'rare' as const
    },
    quiz_master: {
      id: 'quiz_master',
      title: 'Quiz Master',
      description: 'Score 90% or higher on any quiz',
      icon: '🧠',
      rarity: 'uncommon' as const
    },
    security_expert: {
      id: 'security_expert',
      title: 'Security Expert',
      description: 'Complete all training modules',
      icon: '🛡️',
      rarity: 'legendary' as const
    },
    lab_specialist: {
      id: 'lab_specialist',
      title: 'Lab Specialist',
      description: 'Complete 5 hands-on labs',
      icon: '⚗️',
      rarity: 'rare' as const
    }
  }

  return { achievementDefinitions }
}
