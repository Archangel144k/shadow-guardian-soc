import { useState, useEffect } from 'react'
import { 
  Book, 
  Play, 
  CheckCircle, 
  Clock, 
  Award, 
  ArrowLeft, 
  ArrowRight,
  Target,
  Brain,
  Monitor,
  FileText
} from 'lucide-react'
import type { TrainingModule } from '../../lib/supabase'
import InteractiveLearning from './InteractiveLearning'

interface ModuleViewerProps {
  module: TrainingModule
  progress: number
  onComplete: (moduleId: string, lessonIndex: number) => void
  onQuizSubmit: (moduleId: string, answers: number[], questions: unknown[]) => number
  currentLesson: number
  onLessonChange: (lessonIndex: number) => void
  onClose: () => void
}

const ModuleViewer = ({ 
  module, 
  progress, 
  onComplete, 
  onQuizSubmit, 
  currentLesson, 
  onLessonChange, 
  onClose 
}: ModuleViewerProps) => {
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [showInteractive, setShowInteractive] = useState(false)
  const [interactiveCompleted, setInteractiveCompleted] = useState(false)

  const lessons = module.content?.lessons || []
  const quiz = module.content?.quiz
  const currentLessonData = lessons[currentLesson]

  // Debug logging
  console.log('ModuleViewer Props:', {
    moduleTitle: module.title,
    lessonsCount: lessons.length,
    hasQuiz: !!quiz,
    currentLesson,
    currentLessonData: currentLessonData?.title
  })

  useEffect(() => {
    if (quiz) {
      setQuizAnswers(new Array(quiz.questions.length).fill(-1))
    }
  }, [quiz])

  // Reset interactive states when lesson changes
  useEffect(() => {
    setShowInteractive(false)
    setInteractiveCompleted(false)
  }, [currentLesson])

  const handleNextLesson = () => {
    if (currentLesson < lessons.length - 1) {
      onComplete(module.id, currentLesson)
      onLessonChange(currentLesson + 1)
    } else if (quiz && !showQuiz) {
      onComplete(module.id, currentLesson)
      setShowQuiz(true)
    }
  }

  const handlePrevLesson = () => {
    if (showQuiz) {
      setShowQuiz(false)
    } else if (currentLesson > 0) {
      onLessonChange(currentLesson - 1)
    }
  }

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers]
    newAnswers[questionIndex] = answerIndex
    setQuizAnswers(newAnswers)
  }

  const handleQuizSubmit = () => {
    if (quiz && quizAnswers.every(answer => answer !== -1)) {
      const score = onQuizSubmit(module.id, quizAnswers, quiz.questions)
      setQuizScore(score)
      setQuizSubmitted(true)
    }
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="w-4 h-4" />
      case 'interactive': return <Monitor className="w-4 h-4" />
      case 'lab': return <Target className="w-4 h-4" />
      case 'simulation': return <Play className="w-4 h-4" />
      case 'exercise': return <Brain className="w-4 h-4" />
      default: return <Book className="w-4 h-4" />
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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/80 backdrop-blur-md rounded-xl border border-green-500/30 shadow-lg shadow-green-500/10 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="p-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-2xl font-bold text-green-400 font-mono">{module.title}</h2>
            </div>
            <div className={`px-3 py-1 rounded border font-mono text-sm ${getDifficultyColor(module.difficulty)}`}>
              {module.difficulty}
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400 font-mono">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{module.duration}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Book className="w-4 h-4" />
              <span>{module.type}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>{progress}% Complete</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {!showQuiz ? (
            /* Lesson Content */
            <div className="space-y-6">
              {/* Lesson Navigation */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white font-mono flex items-center space-x-2">
                  {getLessonIcon(currentLessonData?.type || 'text')}
                  <span>Lesson {currentLesson + 1}: {currentLessonData?.title || 'Loading...'}</span>
                </h3>
                <div className="text-sm text-gray-400 font-mono">
                  {currentLesson + 1} of {lessons.length}
                </div>
              </div>

              {/* Lesson Content */}
              {currentLessonData ? (
              <div className="bg-black/40 rounded-lg p-6 border border-gray-700/50">
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 leading-relaxed font-mono text-sm whitespace-pre-line">
                    {currentLessonData?.content}
                  </div>
                </div>

                {/* Interactive Elements */}
                {(currentLessonData?.type === 'lab' || currentLessonData?.type === 'simulation' || currentLessonData?.type === 'interactive' || currentLessonData?.type === 'exercise') && !showInteractive && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowInteractive(true)}
                      className={`w-full px-4 py-3 rounded border transition-all text-sm font-mono flex items-center justify-center space-x-2 ${
                        currentLessonData?.type === 'lab' 
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30'
                          : currentLessonData?.type === 'simulation'
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/50 hover:bg-purple-500/30'
                          : 'bg-orange-500/20 text-orange-400 border-orange-500/50 hover:bg-orange-500/30'
                      }`}
                    >
                      {currentLessonData?.type === 'lab' && <Target className="w-4 h-4" />}
                      {currentLessonData?.type === 'simulation' && <Play className="w-4 h-4" />}
                      {(currentLessonData?.type === 'interactive' || currentLessonData?.type === 'exercise') && <Monitor className="w-4 h-4" />}
                      <span>
                        {currentLessonData?.type === 'lab' && 'LAUNCH LAB ENVIRONMENT'}
                        {currentLessonData?.type === 'simulation' && 'START SIMULATION'}
                        {currentLessonData?.type === 'interactive' && 'BEGIN INTERACTIVE SESSION'}
                        {currentLessonData?.type === 'exercise' && 'START EXERCISE'}
                      </span>
                    </button>
                  </div>
                )}

                {/* Interactive Learning Component */}
                {showInteractive && (
                  <div className="mt-6">
                    <InteractiveLearning
                      lessonType={currentLessonData?.type || 'text'}
                      content={currentLessonData?.content || ''}
                      onComplete={() => {
                        setInteractiveCompleted(true)
                        setShowInteractive(false)
                        // Mark lesson as completed
                        onComplete(module.id, currentLesson)
                      }}
                    />
                  </div>
                )}

                {/* Completion Status */}
                {interactiveCompleted && !showInteractive && (
                  <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-mono font-medium">INTERACTIVE CONTENT COMPLETED</span>
                    </div>
                    <p className="text-sm text-gray-300 font-mono mt-2">
                      Great job! You've successfully completed the interactive portion of this lesson.
                    </p>
                  </div>
                )}
              </div>
              ) : (
                <div className="bg-red-500/20 rounded-lg p-6 border border-red-500/30">
                  <div className="text-red-400 font-mono">
                    Error: Lesson content not found. Please check the module configuration.
                  </div>
                  <div className="text-xs text-gray-400 font-mono mt-2">
                    Module: {module.title}, Lesson Index: {currentLesson}, Total Lessons: {lessons.length}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Content */
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold text-yellow-400 font-mono">Knowledge Assessment</h3>
              </div>

              {!quizSubmitted ? (
                <div className="space-y-6">
                  {quiz?.questions.map((question, qIndex) => (
                    <div key={question.id} className="bg-black/40 rounded-lg p-6 border border-gray-700/50">
                      <h4 className="text-lg font-medium text-white font-mono mb-4">
                        {qIndex + 1}. {question.question}
                      </h4>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <label key={oIndex} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name={`question-${qIndex}`}
                              value={oIndex}
                              checked={quizAnswers[qIndex] === oIndex}
                              onChange={() => handleQuizAnswer(qIndex, oIndex)}
                              className="text-yellow-400 focus:ring-yellow-400"
                            />
                            <span className="text-gray-300 font-mono text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={handleQuizSubmit}
                    disabled={quizAnswers.some(answer => answer === -1)}
                    className="w-full py-3 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-all font-mono border border-yellow-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    SUBMIT QUIZ
                  </button>
                </div>
              ) : (
                /* Quiz Results */
                <div className="text-center space-y-6">
                  <div className={`text-6xl font-bold font-mono ${quizScore && quizScore >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                    {quizScore}%
                  </div>
                  <div className={`text-lg font-mono ${quizScore && quizScore >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                    {quizScore && quizScore >= 70 ? 'PASSED' : 'FAILED'}
                  </div>
                  <p className="text-gray-300 font-mono">
                    {quizScore && quizScore >= 70 
                      ? 'Congratulations! You have successfully completed this module.' 
                      : 'You need 70% or higher to pass. Review the material and try again.'}
                  </p>
                  {quizScore && quizScore >= 70 && (
                    <div className="flex items-center justify-center space-x-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-mono">MODULE COMPLETED</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="p-6 border-t border-gray-700/50 flex items-center justify-between">
          <button
            onClick={handlePrevLesson}
            disabled={currentLesson === 0 && !showQuiz}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>PREVIOUS</span>
          </button>

          <div className="text-sm text-gray-400 font-mono">
            {showQuiz ? 'Quiz' : `Lesson ${currentLesson + 1} of ${lessons.length}`}
          </div>

          <button
            onClick={handleNextLesson}
            disabled={showQuiz && (!quizSubmitted || (quizScore !== null && quizScore < 70))}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{currentLesson === lessons.length - 1 && !showQuiz ? 'QUIZ' : 'NEXT'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModuleViewer
