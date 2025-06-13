# Interactive Learning Test Guide

## Testing Steps:

1. **Open the Shadow Guardian App**
   - Go to http://localhost:5175/
   - Navigate to "Training Academy" tab

2. **Select a Module with Interactive Content**
   - Look for modules with types: "Interactive Lab", "Simulation", etc.
   - Click "START MODULE" or "CONTINUE" on any module

3. **Test Interactive Features**
   - Navigate through text lessons using NEXT button
   - When you reach an interactive/lab/simulation lesson:
     - You should see a colored button (blue for lab, purple for simulation, orange for interactive)
     - Click the button to launch the interactive content
     - Complete the interactive activities
     - Progress should update when completed

4. **Expected Behavior:**
   - **Lab lessons**: Step-by-step virtual lab environment with terminal commands
   - **Simulation lessons**: Incident response scenarios with multiple choice questions
   - **Interactive lessons**: Hands-on exercises with log analysis and input fields
   - **Exercise lessons**: Same as interactive content

5. **Progress Tracking:**
   - Lesson completion should update progress percentage
   - Interactive completion should mark lesson as done
   - Quiz at the end should calculate final score
   - Overall module progress should reflect completion

## Debug Console Output:
Watch the browser console for debug messages like:
- "InteractiveLearning mounted:"
- "Lab completed, calling onComplete"
- "Simulation completed, calling onComplete"
- "Interactive exercises completed, calling onComplete"

## Demo Data Available:
The app uses demo training modules with these interactive lessons:
- Module 2: "Incident Response Procedures" - has simulation
- Module 3: "Digital Forensics Fundamentals" - has interactive and lab
- Module 4: "Red Team Operations" - has interactive and lab  
- Module 5: "MITRE ATT&CK Framework" - has interactive and exercise
- Module 6: "Malware Analysis Basics" - has interactive and lab
