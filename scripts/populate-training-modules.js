#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Check if we're running in a valid environment
if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  console.log('❌ Supabase environment variables not found');
  console.log('💡 This will run in demo mode with local data only');
  process.exit(0);
}

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const trainingModules = [
  {
    title: 'Advanced Threat Hunting',
    description: 'Learn advanced techniques for proactive threat hunting using MITRE ATT&CK framework',
    category: 'threat-hunting',
    difficulty: 'Expert',
    duration: '45 minutes',
    type: 'Interactive Lab',
    content: {
      lessons: [
        {
          id: 'lesson-1',
          title: 'Introduction to Threat Hunting',
          content: 'Threat hunting is a proactive security practice that involves searching for threats that may have evaded traditional security measures. This lesson covers the fundamentals of threat hunting, including methodologies, tools, and best practices.',
          type: 'text',
          duration: 10
        },
        {
          id: 'lesson-2',
          title: 'MITRE ATT&CK Framework',
          content: 'The MITRE ATT&CK framework is a globally-accessible knowledge base of adversary tactics and techniques based on real-world observations. Learn how to use this framework for threat hunting.',
          type: 'interactive',
          duration: 15
        },
        {
          id: 'lesson-3',
          title: 'Hands-on Lab: Hunt for APT29',
          content: 'In this lab, you will hunt for indicators of APT29 (Cozy Bear) activity in a simulated environment using various tools and techniques.',
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
    learning_objectives: [
      'Understand threat hunting fundamentals',
      'Master MITRE ATT&CK framework usage',
      'Apply hunting techniques to real scenarios'
    ],
    tags: ['threat-hunting', 'mitre-attack', 'advanced'],
    is_published: true
  },
  {
    title: 'Incident Response Procedures',
    description: 'Practice incident response workflows and containment strategies',
    category: 'incident-response',
    difficulty: 'Intermediate',
    duration: '30 minutes',
    type: 'Simulation',
    content: {
      lessons: [
        {
          id: 'lesson-1',
          title: 'IR Framework Overview',
          content: 'Incident response follows a structured approach: Preparation, Identification, Containment, Eradication, Recovery, and Lessons Learned (PICERL). This lesson covers each phase in detail.',
          type: 'text',
          duration: 8
        },
        {
          id: 'lesson-2',
          title: 'Containment Strategies',
          content: 'Learn different containment approaches for various incident types including network isolation, system quarantine, and user account restrictions.',
          type: 'interactive',
          duration: 12
        },
        {
          id: 'lesson-3',
          title: 'Simulation: Ransomware Response',
          content: 'Respond to a simulated ransomware attack following proper IR procedures including immediate containment, forensic preservation, and recovery planning.',
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
          },
          {
            id: 'q2',
            question: 'During containment, what should be prioritized?',
            options: ['Speed of resolution', 'Evidence preservation', 'System restoration', 'User communication'],
            correct: 1
          }
        ]
      }
    },
    learning_objectives: [
      'Master incident response procedures',
      'Learn containment strategies',
      'Practice real-world scenario response'
    ],
    tags: ['incident-response', 'containment', 'ransomware'],
    is_published: true
  },
  {
    title: 'Digital Forensics Fundamentals',
    description: 'Master the basics of digital forensics and evidence collection',
    category: 'forensics',
    difficulty: 'Beginner',
    duration: '60 minutes',
    type: 'Tutorial',
    content: {
      lessons: [
        {
          id: 'lesson-1',
          title: 'Forensics Principles',
          content: 'Digital forensics is the process of uncovering and interpreting electronic data for use in legal proceedings. This lesson covers fundamental principles including chain of custody, evidence integrity, and legal considerations.',
          type: 'text',
          duration: 15
        },
        {
          id: 'lesson-2',
          title: 'Evidence Collection',
          content: 'Learn proper evidence collection techniques including disk imaging, memory acquisition, and network packet capture while maintaining forensic integrity.',
          type: 'interactive',
          duration: 20
        },
        {
          id: 'lesson-3',
          title: 'Lab: Memory Analysis',
          content: 'Analyze a memory dump to identify malicious processes, network connections, and artifacts using tools like Volatility and other forensic utilities.',
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
          },
          {
            id: 'q2',
            question: 'Which tool is commonly used for memory analysis?',
            options: ['Wireshark', 'Volatility', 'Autopsy', 'EnCase'],
            correct: 1
          }
        ]
      }
    },
    learning_objectives: [
      'Understand forensics principles',
      'Master evidence collection techniques',
      'Learn memory analysis skills'
    ],
    tags: ['forensics', 'evidence', 'memory-analysis'],
    is_published: true
  },
  {
    title: 'Red Team Operations',
    description: 'Offensive security techniques and penetration testing methodologies',
    category: 'red-team',
    difficulty: 'Expert',
    duration: '90 minutes',
    type: 'Hands-on Lab',
    content: {
      lessons: [
        {
          id: 'lesson-1',
          title: 'Red Team Methodology',
          content: 'Red team operations simulate real-world attacks to test organizational defenses. This lesson covers planning, execution, and reporting phases of red team engagements.',
          type: 'text',
          duration: 20
        },
        {
          id: 'lesson-2',
          title: 'Reconnaissance Techniques',
          content: 'Learn OSINT and active reconnaissance methods used by attackers including social media analysis, DNS enumeration, and network scanning.',
          type: 'interactive',
          duration: 25
        },
        {
          id: 'lesson-3',
          title: 'Lab: Full Attack Chain',
          content: 'Execute a complete attack chain from reconnaissance to data exfiltration in a controlled environment, documenting findings and defensive gaps.',
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
          },
          {
            id: 'q2',
            question: 'Which phase comes first in a red team engagement?',
            options: ['Exploitation', 'Reconnaissance', 'Post-exploitation', 'Reporting'],
            correct: 1
          }
        ]
      }
    },
    learning_objectives: [
      'Understand red team methodologies',
      'Master reconnaissance techniques',
      'Execute full attack chains'
    ],
    tags: ['red-team', 'penetration-testing', 'attack-simulation'],
    is_published: true
  },
  {
    title: 'MITRE ATT&CK Framework',
    description: 'Understanding adversary tactics, techniques, and procedures',
    category: 'frameworks',
    difficulty: 'Intermediate',
    duration: '45 minutes',
    type: 'Tutorial',
    content: {
      lessons: [
        {
          id: 'lesson-1',
          title: 'ATT&CK Matrix Overview',
          content: 'The ATT&CK matrix organizes known adversary tactics and techniques into a comprehensive framework. Learn to navigate and understand the matrix structure.',
          type: 'text',
          duration: 15
        },
        {
          id: 'lesson-2',
          title: 'Tactics vs Techniques',
          content: 'Understand the difference between tactics (why) and techniques (how) in the ATT&CK framework, and how they relate to real-world adversary behavior.',
          type: 'interactive',
          duration: 15
        },
        {
          id: 'lesson-3',
          title: 'Mapping Threats to ATT&CK',
          content: 'Practice mapping real-world threats to ATT&CK techniques and learn to use this mapping for threat hunting and defense improvement.',
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
          },
          {
            id: 'q2',
            question: 'What does a technique represent in ATT&CK?',
            options: ['Why adversaries act', 'How adversaries act', 'When adversaries act', 'Where adversaries act'],
            correct: 1
          }
        ]
      }
    },
    learning_objectives: [
      'Navigate the ATT&CK matrix',
      'Distinguish tactics from techniques',
      'Map threats to ATT&CK framework'
    ],
    tags: ['mitre-attack', 'tactics', 'techniques'],
    is_published: true
  },
  {
    title: 'Malware Analysis Basics',
    description: 'Static and dynamic malware analysis techniques',
    category: 'malware',
    difficulty: 'Advanced',
    duration: '75 minutes',
    type: 'Interactive Lab',
    content: {
      lessons: [
        {
          id: 'lesson-1',
          title: 'Static Analysis Fundamentals',
          content: 'Static analysis examines malware without executing it, using tools like strings, file, and disassemblers to understand malware functionality and capabilities.',
          type: 'text',
          duration: 20
        },
        {
          id: 'lesson-2',
          title: 'Dynamic Analysis Setup',
          content: 'Learn to set up a safe dynamic analysis environment using virtual machines and sandboxes to observe malware behavior during execution.',
          type: 'interactive',
          duration: 25
        },
        {
          id: 'lesson-3',
          title: 'Lab: Analyze Real Malware',
          content: 'Analyze a real malware sample using both static and dynamic techniques to understand its functionality, network communications, and persistence mechanisms.',
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
          },
          {
            id: 'q2',
            question: 'Which environment is safest for dynamic analysis?',
            options: ['Production system', 'Isolated VM', 'Development machine', 'Network share'],
            correct: 1
          }
        ]
      }
    },
    learning_objectives: [
      'Master static analysis techniques',
      'Set up dynamic analysis environments',
      'Analyze real malware samples'
    ],
    tags: ['malware-analysis', 'static-analysis', 'dynamic-analysis'],
    is_published: true
  }
];

async function populateTrainingModules() {
  console.log('🔄 Populating training modules...');
  
  try {
    // Insert training modules
    const { data, error } = await supabase
      .from('training_modules')
      .upsert(trainingModules, { 
        onConflict: 'title',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error('❌ Error inserting training modules:', error);
      return;
    }

    console.log(`✅ Successfully inserted ${data.length} training modules`);
    
    // Display summary
    console.log('\n📚 Training Modules Created:');
    data.forEach((module, index) => {
      console.log(`  ${index + 1}. ${module.title} (${module.difficulty}) - ${module.duration}`);
    });

    console.log('\n🎯 Training Academy Backend Integration Complete!');
    console.log('📱 You can now test the enhanced training features at http://localhost:5175');
    console.log('🔑 Login credentials:');
    console.log('   - shadowadmin / StealthOp2024!');
    console.log('   - ghostoperator / Phantom2024#');
    console.log('   - agent47 / Assassin2024$');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the population
populateTrainingModules();
