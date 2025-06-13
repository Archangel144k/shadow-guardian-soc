// Shadow Guardian - Training Module Population Script
// This script populates training modules with enhanced content

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Enhanced training modules with full content
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
          content: 'Threat hunting is a proactive cybersecurity practice that involves actively searching for cyber threats that are lurking undetected in a network...',
          type: 'text',
          duration: 10
        },
        {
          id: 'lesson-2',
          title: 'MITRE ATT&CK Framework Deep Dive',
          content: 'The MITRE ATT&CK framework is essential for modern threat hunting...',
          type: 'interactive',
          duration: 20
        },
        {
          id: 'lesson-3',
          title: 'Practical Hunting Exercise',
          content: 'Time for hands-on threat hunting! In this exercise, you will analyze real network logs...',
          type: 'lab',
          duration: 25
        }
      ],
      quiz: {
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
          }
        ]
      }
    },
    learning_objectives: [
      'Understand MITRE ATT&CK framework',
      'Develop threat hunting hypotheses',
      'Analyze security logs effectively',
      'Create custom detection rules'
    ],
    tags: ['mitre', 'attack', 'hunting', 'detection'],
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
          title: 'IR Framework and Methodology',
          content: 'Incident Response (IR) is a structured approach to handling security incidents...',
          type: 'text',
          duration: 8
        },
        {
          id: 'lesson-2',
          title: 'Containment Strategies',
          content: 'Containment is critical to prevent further damage during an incident...',
          type: 'interactive',
          duration: 15
        },
        {
          id: 'lesson-3',
          title: 'Ransomware Response Simulation',
          content: 'You are the incident commander responding to a ransomware attack...',
          type: 'simulation',
          duration: 12
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'What is the first phase of the NIST incident response framework?',
            options: ['Identification', 'Preparation', 'Containment', 'Recovery'],
            correct: 1
          }
        ]
      }
    },
    learning_objectives: [
      'Follow IR procedures',
      'Contain security incidents',
      'Coordinate response teams',
      'Document incident details'
    ],
    tags: ['incident', 'response', 'containment', 'forensics'],
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
          content: 'Digital forensics is the process of uncovering and interpreting electronic data...',
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
    learning_objectives: [
      'Understand forensic methodology',
      'Preserve digital evidence',
      'Analyze file systems',
      'Extract artifacts from memory'
    ],
    tags: ['forensics', 'evidence', 'analysis', 'investigation'],
    is_published: true
  }
];

async function populateTrainingModules() {
  console.log('🚀 Populating Enhanced Training Modules...\n');

  try {
    for (const module of trainingModules) {
      console.log(`📚 Adding: ${module.title}`);
      
      const { data, error } = await supabase
        .from('training_modules')
        .insert(module)
        .select();

      if (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        if (error.code === '42501') {
          console.log('   ℹ️  RLS Policy Issue - Module will use demo content instead');
        }
      } else {
        console.log(`   ✅ Success! ID: ${data[0].id}`);
      }
    }

    // Test query to see what's in the database
    console.log('\n🔍 Checking database content...');
    const { data: modules, error: queryError } = await supabase
      .from('training_modules')
      .select('id, title, is_published');

    if (queryError) {
      console.log(`❌ Query failed: ${queryError.message}`);
    } else {
      console.log(`✅ Found ${modules.length} training modules in database`);
      modules.forEach(m => console.log(`   📖 ${m.title} (${m.id})`));
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

console.log('🏫 Shadow Guardian Training Module Setup');
console.log('=======================================\n');

populateTrainingModules().then(() => {
  console.log('\n🎉 Training module setup complete!');
  console.log('\n💡 Note: If RLS policies prevented database insertion,');
  console.log('   the app will automatically use enhanced demo content.');
  process.exit(0);
});
