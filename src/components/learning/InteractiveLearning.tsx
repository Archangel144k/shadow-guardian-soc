import { useState } from 'react'
import { Play, CheckCircle, Award, Target, Code, Terminal } from 'lucide-react'

interface InteractiveLearningProps {
  lessonType: string
  content: string
  onComplete: () => void
}

const InteractiveLearning = ({ lessonType, content, onComplete }: InteractiveLearningProps) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [userAnswers, setUserAnswers] = useState<string[]>([])

  // Debug logging
  console.log('InteractiveLearning mounted:', { lessonType, content: content.substring(0, 50) + '...', currentStep, completed })

  const renderLabEnvironment = () => {
    const labSteps = [
      {
        title: "Initialize Lab Environment",
        description: "Setting up your virtual security lab...",
        command: "docker run -d --name security-lab kali-linux",
        expectedOutput: "Container started successfully"
      },
      {
        title: "Scan Network",
        description: "Perform a network scan to identify live hosts",
        command: "nmap -sn 192.168.1.0/24",
        expectedOutput: "Found 12 live hosts"
      },
      {
        title: "Analyze Results",
        description: "Review the scan results and identify potential targets",
        command: "nmap -A 192.168.1.10",
        expectedOutput: "Open ports: 22, 80, 443, 3389"
      }
    ]

    return (
      <div className="space-y-4">
        <div className="bg-black rounded-lg p-4 border border-green-500/30">
          <div className="flex items-center space-x-2 mb-3">
            <Terminal className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-mono font-bold">VIRTUAL LAB ENVIRONMENT</span>
          </div>
          
          <div className="space-y-3">
            {labSteps.map((step, index) => (
              <div key={index} className={`p-3 rounded border ${
                index === currentStep ? 'border-green-500/50 bg-green-500/10' :
                index < currentStep ? 'border-green-500/30 bg-green-500/5' :
                'border-gray-500/30 bg-gray-500/5'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-mono text-sm">{step.title}</h4>
                  {index < currentStep && <CheckCircle className="w-4 h-4 text-green-400" />}
                </div>
                <p className="text-gray-300 text-xs font-mono mb-2">{step.description}</p>
                
                {index === currentStep && (
                  <div className="space-y-2">
                    <div className="bg-black/50 p-2 rounded font-mono text-xs">
                      <span className="text-green-400">$ </span>
                      <span className="text-white">{step.command}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (currentStep < labSteps.length - 1) {
                          setCurrentStep(currentStep + 1)
                        } else {
                          setCompleted(true)
                          console.log('Lab completed, calling onComplete')
                          onComplete()
                        }
                      }}
                      className="px-3 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/50 hover:bg-green-500/30 transition-all text-xs font-mono"
                    >
                      EXECUTE COMMAND
                    </button>
                    {currentStep > 0 && (
                      <div className="text-xs text-gray-400 font-mono">
                        Expected: {step.expectedOutput}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {completed && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-green-400">
              <Award className="w-5 h-5" />
              <span className="font-mono font-bold">LAB COMPLETED!</span>
            </div>
            <p className="text-gray-300 text-sm font-mono mt-2">
              Excellent work! You've successfully completed the hands-on lab exercise.
            </p>
          </div>
        )}
      </div>
    )
  }

  const renderSimulation = () => {
    const scenarios = [
      {
        situation: "🚨 ALERT: Suspicious network activity detected",
        question: "What is your immediate response?",
        options: [
          "Shut down the entire network",
          "Isolate the affected system",
          "Wait and monitor",
          "Restart the firewall"
        ],
        correct: 1,
        explanation: "Isolating the affected system prevents lateral movement while preserving evidence."
      },
      {
        situation: "📧 Phishing email reported by user",
        question: "What should be your first action?",
        options: [
          "Delete the email",
          "Quarantine and analyze",
          "Reply to sender",
          "Forward to all users"
        ],
        correct: 1,
        explanation: "Quarantining preserves evidence while preventing further spread."
      }
    ]

    return (
      <div className="space-y-4">
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Play className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-mono font-bold">INCIDENT RESPONSE SIMULATION</span>
          </div>
          
          {currentStep < scenarios.length ? (
            <div className="space-y-4">
              <div className="bg-black/50 p-4 rounded">
                <div className="text-lg font-mono text-white mb-2">
                  {scenarios[currentStep].situation}
                </div>
                <div className="text-gray-300 font-mono">
                  {scenarios[currentStep].question}
                </div>
              </div>
              
              <div className="space-y-2">
                {scenarios[currentStep].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setUserAnswers([...userAnswers, index.toString()])
                      setCurrentStep(currentStep + 1)
                    }}
                    className="w-full text-left p-3 bg-gray-500/20 text-gray-300 rounded border border-gray-500/50 hover:bg-gray-500/30 transition-all font-mono text-sm"
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-green-400 font-mono font-bold">SIMULATION COMPLETE!</div>
              {scenarios.map((scenario, index) => (
                <div key={index} className="bg-black/50 p-3 rounded">
                  <div className="text-sm text-gray-300 font-mono mb-1">
                    Scenario {index + 1}: {scenario.situation}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    Your answer: {scenario.options[parseInt(userAnswers[index])]}
                  </div>
                  <div className="text-xs text-green-400 font-mono">
                    Correct: {scenario.options[scenario.correct]}
                  </div>
                  <div className="text-xs text-blue-400 font-mono">
                    {scenario.explanation}
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  setCompleted(true)
                  console.log('Simulation completed, calling onComplete')
                  onComplete()
                }}
                className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded border border-purple-500/50 hover:bg-purple-500/30 transition-all font-mono"
              >
                COMPLETE SIMULATION
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderInteractiveContent = () => {
    const exercises = [
      {
        title: "Identify the Attack Vector",
        description: "Analyze this log entry and identify the attack type:",
        logEntry: "192.168.1.100 - - [25/Dec/2024:10:15:32] \"GET /admin' OR '1'='1 HTTP/1.1\" 200 1234",
        hint: "Look for SQL injection patterns",
        answer: "SQL Injection"
      },
      {
        title: "Decode the IOC",
        description: "What type of indicator is this?",
        logEntry: "MD5: d41d8cd98f00b204e9800998ecf8427e",
        hint: "This is a hash value",
        answer: "File Hash"
      }
    ]

    return (
      <div className="space-y-4">
        <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Code className="w-5 h-5 text-orange-400" />
            <span className="text-orange-400 font-mono font-bold">INTERACTIVE EXERCISES</span>
          </div>
          
          {currentStep < exercises.length ? (
            <div className="space-y-4">
              <div className="bg-black/50 p-4 rounded">
                <h4 className="text-white font-mono mb-2">{exercises[currentStep].title}</h4>
                <p className="text-gray-300 font-mono text-sm mb-3">{exercises[currentStep].description}</p>
                <div className="bg-black p-3 rounded font-mono text-xs text-green-400">
                  {exercises[currentStep].logEntry}
                </div>
              </div>
              
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter your answer..."
                  className="w-full p-3 bg-gray-800 text-white rounded border border-gray-600 font-mono"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setCurrentStep(currentStep + 1)
                    }
                  }}
                />
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded border border-orange-500/50 hover:bg-orange-500/30 transition-all font-mono"
                >
                  SUBMIT ANSWER
                </button>
                <div className="text-xs text-gray-400 font-mono">
                  Hint: {exercises[currentStep].hint}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <div className="text-green-400 font-mono font-bold mb-2">ALL EXERCISES COMPLETED!</div>
              <p className="text-gray-300 text-sm font-mono">
                Great job! You've successfully completed all interactive exercises.
              </p>
              <button
                onClick={() => {
                  setCompleted(true)
                  console.log('Interactive exercises completed, calling onComplete')
                  onComplete()
                }}
                className="mt-3 px-4 py-2 bg-green-500/20 text-green-400 rounded border border-green-500/50 hover:bg-green-500/30 transition-all font-mono"
              >
                FINISH LESSON
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  switch (lessonType) {
    case 'lab':
      return renderLabEnvironment()
    case 'simulation':
      return renderSimulation()
    case 'interactive':
    case 'exercise':
      return renderInteractiveContent()
    default:
      return (
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
          <div className="text-blue-400 font-mono">
            Interactive content for {lessonType} lessons coming soon!
          </div>
        </div>
      )
  }
}

export default InteractiveLearning
