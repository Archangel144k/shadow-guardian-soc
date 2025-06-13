import { useState } from 'react'
import { 
  Route, 
  Shield, 
  Search, 
  Zap, 
  Target, 
  Brain, 
  Lock,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react'
import type { TrainingModule } from '../../lib/supabase'

interface LearningPath {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  estimatedTime: string
  modules: string[]
  prerequisites?: string[]
  color: string
}

interface LearningPathsProps {
  modules: TrainingModule[]
  moduleProgress: Record<string, number>
  completedModules: Set<string>
  onStartPath: (pathId: string) => void
  onSelectModule: (module: TrainingModule) => void
}

const LearningPaths = ({ 
  modules, 
  moduleProgress, 
  completedModules, 
  onStartPath, 
  onSelectModule 
}: LearningPathsProps) => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)

  const learningPaths: LearningPath[] = [
    {
      id: 'security-fundamentals',
      title: 'Security Fundamentals',
      description: 'Essential cybersecurity concepts and practices for beginners',
      icon: <Shield className="w-6 h-6" />,
      difficulty: 'Beginner',
      estimatedTime: '4-6 hours',
      modules: ['3', '5'], // Digital Forensics, MITRE ATT&CK
      color: 'green'
    },
    {
      id: 'incident-response',
      title: 'Incident Response Specialist',
      description: 'Master incident response procedures and crisis management',
      icon: <Zap className="w-6 h-6" />,
      difficulty: 'Intermediate',
      estimatedTime: '6-8 hours',
      modules: ['2', '3', '5'], // IR Procedures, Digital Forensics, MITRE ATT&CK
      prerequisites: ['security-fundamentals'],
      color: 'orange'
    },
    {
      id: 'threat-hunter',
      title: 'Threat Hunter',
      description: 'Advanced threat hunting and proactive security monitoring',
      icon: <Search className="w-6 h-6" />,
      difficulty: 'Advanced',
      estimatedTime: '8-10 hours',
      modules: ['1', '5', '6'], // Advanced Threat Hunting, MITRE ATT&CK, Malware Analysis
      prerequisites: ['incident-response'],
      color: 'blue'
    },
    {
      id: 'red-team-operator',
      title: 'Red Team Operator',
      description: 'Offensive security and penetration testing expertise',
      icon: <Target className="w-6 h-6" />,
      difficulty: 'Expert',
      estimatedTime: '10-12 hours',
      modules: ['4', '6', '1'], // Red Team Operations, Malware Analysis, Advanced Threat Hunting
      prerequisites: ['threat-hunter'],
      color: 'red'
    },
    {
      id: 'security-analyst',
      title: 'Security Analyst Track',
      description: 'Comprehensive security analysis and monitoring skills',
      icon: <Brain className="w-6 h-6" />,
      difficulty: 'Intermediate',
      estimatedTime: '7-9 hours',
      modules: ['2', '3', '5', '6'], // IR, Forensics, MITRE, Malware Analysis
      prerequisites: ['security-fundamentals'],
      color: 'purple'
    }
  ]

  const getPathProgress = (path: LearningPath) => {
    const pathModules = path.modules
    const completedInPath = pathModules.filter(moduleId => completedModules.has(moduleId)).length
    return Math.round((completedInPath / pathModules.length) * 100)
  }

  const isPathUnlocked = (path: LearningPath) => {
    if (!path.prerequisites) return true
    return path.prerequisites.every(prereqId => {
      const prereqPath = learningPaths.find(p => p.id === prereqId)
      return prereqPath ? getPathProgress(prereqPath) === 100 : false
    })
  }

  const getColorClasses = (color: string, unlocked: boolean = true) => {
    if (!unlocked) return 'border-gray-700/50 bg-gray-800/20 text-gray-500'
    
    switch (color) {
      case 'green': return 'border-green-500/30 bg-green-500/10 text-green-400'
      case 'orange': return 'border-orange-500/30 bg-orange-500/10 text-orange-400'
      case 'blue': return 'border-blue-500/30 bg-blue-500/10 text-blue-400'
      case 'red': return 'border-red-500/30 bg-red-500/10 text-red-400'
      case 'purple': return 'border-purple-500/30 bg-purple-500/10 text-purple-400'
      default: return 'border-gray-500/30 bg-gray-500/10 text-gray-400'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 border-green-500/50 bg-green-500/10'
      case 'Intermediate': return 'text-orange-400 border-orange-500/50 bg-orange-500/10'
      case 'Advanced': return 'text-red-400 border-red-500/50 bg-red-500/10'
      case 'Expert': return 'text-purple-400 border-purple-500/50 bg-purple-500/10'
      default: return 'text-gray-400 border-gray-500/50 bg-gray-500/10'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-blue-400 font-mono flex items-center space-x-2">
          <Route className="w-5 h-5" />
          <span>LEARNING PATHS</span>
        </h3>
        <div className="text-sm text-gray-400 font-mono">
          Choose your specialization track
        </div>
      </div>

      {/* Learning Paths Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {learningPaths.map((path) => {
          const progress = getPathProgress(path)
          const unlocked = isPathUnlocked(path)
          const isCompleted = progress === 100

          return (
            <div 
              key={path.id}
              className={`rounded-xl p-6 border shadow-lg transition-all cursor-pointer hover:scale-105 ${
                getColorClasses(path.color, unlocked)
              } ${selectedPath === path.id ? 'ring-2 ring-blue-400' : ''}`}
              onClick={() => unlocked && setSelectedPath(selectedPath === path.id ? null : path.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`${unlocked ? '' : 'grayscale opacity-50'}`}>
                    {path.icon}
                  </div>
                  <div>
                    <h4 className={`text-lg font-bold font-mono ${unlocked ? '' : 'text-gray-500'}`}>
                      {path.title}
                    </h4>
                    <div className={`px-2 py-1 rounded text-xs font-mono border ${getDifficultyColor(path.difficulty)}`}>
                      {path.difficulty}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {isCompleted && <CheckCircle className="w-5 h-5 text-green-400" />}
                  {!unlocked && <Lock className="w-5 h-5 text-gray-500" />}
                </div>
              </div>

              <p className={`text-sm font-mono mb-4 ${unlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                {path.description}
              </p>

              <div className="flex items-center space-x-4 text-xs font-mono mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{path.estimatedTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>{path.modules.length} modules</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      unlocked ? `bg-${path.color}-400` : 'bg-gray-600'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Prerequisites */}
              {path.prerequisites && (
                <div className="mb-4 p-2 bg-black/40 rounded border border-gray-700/50">
                  <div className="text-xs font-mono text-gray-400 mb-1">Prerequisites:</div>
                  <div className="text-xs font-mono">
                    {path.prerequisites.map(prereqId => {
                      const prereqPath = learningPaths.find(p => p.id === prereqId)
                      const prereqCompleted = prereqPath ? getPathProgress(prereqPath) === 100 : false
                      return (
                        <span key={prereqId} className={prereqCompleted ? 'text-green-400' : 'text-red-400'}>
                          {prereqPath?.title} {prereqCompleted ? '✓' : '✗'}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (unlocked) onStartPath(path.id)
                }}
                disabled={!unlocked}
                className={`w-full py-2 px-4 rounded font-mono text-sm transition-all ${
                  unlocked 
                    ? `bg-${path.color}-500/20 text-${path.color}-400 border border-${path.color}-500/50 hover:bg-${path.color}-500/30`
                    : 'bg-gray-700/50 text-gray-500 border border-gray-700/50 cursor-not-allowed'
                }`}
              >
                {!unlocked ? 'LOCKED' : isCompleted ? 'REVIEW PATH' : 'START PATH'}
              </button>

              {/* Expanded Module List */}
              {selectedPath === path.id && unlocked && (
                <div className="mt-4 space-y-2 border-t border-gray-700/50 pt-4">
                  <div className="text-sm font-mono text-gray-300 mb-2">Modules in this path:</div>
                  {path.modules.map(moduleId => {
                    const module = modules.find(m => m.id === moduleId)
                    if (!module) return null

                    const moduleCompleted = completedModules.has(moduleId)
                    const moduleProgressValue = moduleProgress[moduleId] || 0

                    return (
                      <div 
                        key={moduleId}
                        className="p-3 bg-black/40 rounded border border-gray-700/50 hover:border-gray-600/50 transition-all cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectModule(module)
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {moduleCompleted && <CheckCircle className="w-4 h-4 text-green-400" />}
                            <span className="text-sm font-mono text-white">{module.title}</span>
                          </div>
                          <span className="text-xs font-mono text-gray-400">{moduleProgressValue}%</span>
                        </div>
                        <div className="mt-1 w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-400 transition-all duration-500"
                            style={{ width: `${moduleProgressValue}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LearningPaths
