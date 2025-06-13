import { useState, useEffect } from 'react'
import { Award, Star, Trophy, Target, Brain, Shield, Zap } from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  unlocked?: boolean
  unlockedAt?: string
}

interface AchievementSystemProps {
  achievements: string[]
  achievementDefinitions: Record<string, Achievement>
  overallProgress: number
  completedModules: Set<string>
  quizScores: Record<string, number>
}

const AchievementSystem = ({ 
  achievements, 
  achievementDefinitions, 
  overallProgress, 
  completedModules,
  quizScores 
}: AchievementSystemProps) => {
  const [newAchievements, setNewAchievements] = useState<string[]>([])
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    // Check for new achievements
    const newUnlocked = achievements.filter(id => !newAchievements.includes(id))
    if (newUnlocked.length > 0) {
      setNewAchievements(prev => [...prev, ...newUnlocked])
      setShowNotification(true)
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false)
      }, 5000)
    }
  }, [achievements, newAchievements])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500/50 bg-gray-500/10 text-gray-400'
      case 'uncommon': return 'border-green-500/50 bg-green-500/10 text-green-400'
      case 'rare': return 'border-blue-500/50 bg-blue-500/10 text-blue-400'
      case 'epic': return 'border-purple-500/50 bg-purple-500/10 text-purple-400'
      case 'legendary': return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400'
      default: return 'border-gray-500/50 bg-gray-500/10 text-gray-400'
    }
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Star className="w-4 h-4" />
      case 'uncommon': return <Target className="w-4 h-4" />
      case 'rare': return <Trophy className="w-4 h-4" />
      case 'epic': return <Shield className="w-4 h-4" />
      case 'legendary': return <Zap className="w-4 h-4" />
      default: return <Award className="w-4 h-4" />
    }
  }

  const getProgressStats = () => {
    const totalAchievements = Object.keys(achievementDefinitions).length
    const unlockedCount = achievements.length
    const averageQuizScore = Object.values(quizScores).length > 0 
      ? Math.round(Object.values(quizScores).reduce((a, b) => a + b, 0) / Object.values(quizScores).length)
      : 0

    return {
      totalAchievements,
      unlockedCount,
      averageQuizScore,
      completionRate: Math.round((unlockedCount / totalAchievements) * 100)
    }
  }

  const stats = getProgressStats()

  return (
    <div className="space-y-6">
      {/* Achievement Notification */}
      {showNotification && newAchievements.length > 0 && (
        <div className="fixed top-4 right-4 z-50 bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 backdrop-blur-sm animate-pulse">
          <div className="flex items-center space-x-3">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <div>
              <div className="text-yellow-400 font-mono font-bold">ACHIEVEMENT UNLOCKED!</div>
              <div className="text-sm text-gray-300 font-mono">
                {achievementDefinitions[newAchievements[newAchievements.length - 1]]?.title}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Overview */}
      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-lg shadow-purple-500/10">
        <h3 className="text-lg font-bold text-purple-400 font-mono mb-4 flex items-center space-x-2">
          <Award className="w-5 h-5" />
          <span>ACHIEVEMENT PROGRESS</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 font-mono">{stats.unlockedCount}</div>
            <div className="text-xs text-gray-400 font-mono">UNLOCKED</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 font-mono">{stats.totalAchievements}</div>
            <div className="text-xs text-gray-400 font-mono">TOTAL</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 font-mono">{completedModules.size}</div>
            <div className="text-xs text-gray-400 font-mono">MODULES</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 font-mono">{stats.averageQuizScore}%</div>
            <div className="text-xs text-gray-400 font-mono">AVG SCORE</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 font-mono mb-1">
            <span>Achievement Progress</span>
            <span>{stats.completionRate}%</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-400 transition-all duration-1000"
              style={{ width: `${stats.completionRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(achievementDefinitions).map((achievement) => {
          const isUnlocked = achievements.includes(achievement.id)
          const isNew = newAchievements.includes(achievement.id)
          
          return (
            <div 
              key={achievement.id} 
              className={`p-4 rounded-lg border transition-all ${
                isUnlocked 
                  ? getRarityColor(achievement.rarity) + (isNew ? ' animate-pulse' : '')
                  : 'border-gray-700/50 bg-gray-800/20 text-gray-500'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`text-2xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className={`font-mono font-bold text-sm ${isUnlocked ? '' : 'text-gray-500'}`}>
                      {achievement.title}
                    </h4>
                    {isUnlocked && getRarityIcon(achievement.rarity)}
                  </div>
                  <p className={`text-xs font-mono ${isUnlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                    {achievement.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-xs font-mono px-2 py-1 rounded ${
                      isUnlocked ? getRarityColor(achievement.rarity) : 'bg-gray-700/50 text-gray-500'
                    }`}>
                      {achievement.rarity.toUpperCase()}
                    </span>
                    {isUnlocked && (
                      <div className="text-xs text-gray-400 font-mono">
                        ✓ UNLOCKED
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Skill Level Badge */}
      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 shadow-lg shadow-green-500/10">
        <h3 className="text-lg font-bold text-green-400 font-mono mb-4 flex items-center space-x-2">
          <Brain className="w-5 h-5" />
          <span>SKILL ASSESSMENT</span>
        </h3>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-green-400 font-mono">
              {overallProgress >= 80 ? 'EXPERT' : 
               overallProgress >= 60 ? 'ADVANCED' : 
               overallProgress >= 30 ? 'INTERMEDIATE' : 'BEGINNER'}
            </div>
            <div className="text-sm text-gray-400 font-mono">Current Skill Level</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-400 font-mono">{overallProgress}%</div>
            <div className="text-xs text-gray-400 font-mono">Overall Progress</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${
                overallProgress >= 80 ? 'bg-purple-400' :
                overallProgress >= 60 ? 'bg-red-400' :
                overallProgress >= 30 ? 'bg-orange-400' : 'bg-green-400'
              }`}
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Next Level Progress */}
        <div className="mt-4 p-3 bg-black/40 rounded-lg border border-gray-700/50">
          <div className="text-sm font-mono text-gray-300 mb-2">
            {overallProgress >= 80 ? 'Maximum level reached!' :
             overallProgress >= 60 ? `${80 - overallProgress}% to Expert` :
             overallProgress >= 30 ? `${60 - overallProgress}% to Advanced` :
             `${30 - overallProgress}% to Intermediate`}
          </div>
          {overallProgress < 80 && (
            <div className="text-xs text-gray-400 font-mono">
              Complete more modules to advance your skill level
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AchievementSystem
