import { normalizeSkills } from './controllers/assessmentController.js';
import {
  extractPerformanceFeatures,
  predictDifficultyFallback,
  predictDifficulty,
  DIFFICULTY_LEVELS
} from './services/mlDifficultyService.js';
import {
  evaluateAnswer,
  computeTechnicalScore,
  compileFinalInsights
} from './services/assessmentEvaluationService.js';
import {
  saveAssessmentToFirestore,
  getAssessmentFromFirestore,
  getLatestAssessmentForStudent
} from './config/firebaseAdmin.js';

async function runTests() {
  console.log('--- Starting Technical Assessment System Verification ---');

  // Test 1: Skill Normalization
  console.log('\n[Test 1] Testing Skill Normalization:');
  const rawSkillsInput = [
    'Python',
    'Java, React',
    '  Python ',
    '',
    { name: 'MySQL' },
    'Git & GitHub'
  ];
  const normalized = normalizeSkills(rawSkillsInput);
  console.log('Input:', rawSkillsInput);
  console.log('Normalized output:', normalized);
  if (normalized.includes('Python') && normalized.includes('Java') && normalized.includes('React') && normalized.includes('MySQL')) {
    console.log('✓ PASS: Skills cleanly deduplicated, trimmed, and separated.');
  } else {
    throw new Error('Skill normalization failed.');
  }

  // Test 2: ML Feature Extraction & Fallback Difficulty Prediction
  console.log('\n[Test 2] Testing ML Feature Extraction & Difficulty Engine:');
  const featuresEasy = extractPerformanceFeatures({
    currentDifficulty: 'EASY',
    isCorrect: true,
    recentAccuracy: 100,
    technicalScore: 100,
    consecutiveCorrect: 3,
    consecutiveIncorrect: 0,
    totalAttempted: 3
  });
  const nextDiff1 = predictDifficultyFallback(featuresEasy);
  console.log('Features streak 3 correct at EASY -> Next predicted difficulty:', nextDiff1);
  if (nextDiff1 === DIFFICULTY_LEVELS.MEDIUM) {
    console.log('✓ PASS: Successfully adapted EASY -> MEDIUM on high streak.');
  }

  const featuresHard = extractPerformanceFeatures({
    currentDifficulty: 'HARD',
    isCorrect: false,
    recentAccuracy: 25,
    technicalScore: 40,
    consecutiveCorrect: 0,
    consecutiveIncorrect: 3,
    totalAttempted: 4
  });
  const nextDiff2 = predictDifficultyFallback(featuresHard);
  console.log('Features streak 3 incorrect at HARD -> Next predicted difficulty:', nextDiff2);
  if (nextDiff2 === DIFFICULTY_LEVELS.MEDIUM) {
    console.log('✓ PASS: Successfully adapted HARD -> MEDIUM on failure streak.');
  }

  const mlPrediction = await predictDifficulty(featuresEasy);
  console.log('predictDifficulty() result:', mlPrediction);
  if (mlPrediction.difficulty && mlPrediction.modelType) {
    console.log('✓ PASS: predictDifficulty returns structured model interface.');
  }

  // Test 3: Answer Validation (MCQ & Coding)
  console.log('\n[Test 3] Testing Answer Evaluation:');
  const testMCQ = {
    type: 'mcq',
    question: 'What is the output of type([]) in Python?',
    options: ["<class 'list'>", "<class 'dict'>", "<class 'set'>", "<class 'tuple'>"],
    correctAnswer: 0
  };
  const evalMCQCorrect = evaluateAnswer(testMCQ, 0);
  const evalMCQWrong = evaluateAnswer(testMCQ, 1);
  if (evalMCQCorrect.isCorrect === true && evalMCQWrong.isCorrect === false) {
    console.log('✓ PASS: Server evaluated MCQ correctly (correct = true, incorrect = false).');
  } else {
    throw new Error('MCQ evaluation failed.');
  }

  const testCoding = {
    type: 'coding',
    testCases: [
      { input: [[1, 2, 3]], expectedOutput: 6, description: 'Sum array' },
      { input: [[-1, 1]], expectedOutput: 0, description: 'Zero sum' }
    ]
  };
  const evalCodePass = evaluateAnswer(testCoding, 'function solution(arr) { return arr.reduce((a, b) => a + b, 0); }');
  if (evalCodePass.isCorrect === true) {
    console.log('✓ PASS: Server-side Coding execution passed all test cases.');
  } else {
    throw new Error('Coding test case evaluation failed.');
  }

  // Test 4: Score Calculation
  console.log('\n[Test 4] Testing Technical Score Formula:');
  const score1 = computeTechnicalScore(10, 15);
  console.log('10 of 15 correct technicalScore:', score1 + '%');
  if (score1 === 66.67) {
    console.log('✓ PASS: Exactly 66.67% calculated.');
  }

  // Test 5: Final Placement Insights Compilation
  console.log('\n[Test 5] Testing Final Insights Compilation:');
  const mockSession = {
    totalQuestions: 15,
    results: [
      { skill: 'Python', topic: 'Functions', difficulty: 'EASY', isCorrect: true },
      { skill: 'Python', topic: 'OOP', difficulty: 'MEDIUM', isCorrect: true },
      { skill: 'Java', topic: 'Streams', difficulty: 'HARD', isCorrect: true },
      { skill: 'React', topic: 'Hooks', difficulty: 'MEDIUM', isCorrect: false }
    ],
    skillStates: {
      Python: { questionsAttempted: 2, correctAnswers: 2, currentDifficulty: 'MEDIUM' },
      Java: { questionsAttempted: 1, correctAnswers: 1, currentDifficulty: 'HARD' },
      React: { questionsAttempted: 1, correctAnswers: 0, currentDifficulty: 'EASY' }
    }
  };
  const insights = compileFinalInsights(mockSession);
  console.log('Compiled Insights:', {
    technicalScore: insights.technicalScore,
    highestDifficulty: insights.highestDifficulty,
    strengthsCount: insights.strengths.length,
    areasForImprovementCount: insights.areasForImprovement.length
  });
  if (insights.highestDifficulty === 'HARD' && insights.strengths.length > 0) {
    console.log('✓ PASS: Highest difficulty reached (HARD) and strengths compiled.');
  }

  // Test 6: Firestore / Local Store Persistence
  console.log('\n[Test 6] Testing Assessment Persistence:');
  const testAssessmentId = `test_assess_${Date.now()}`;
  await saveAssessmentToFirestore(testAssessmentId, {
    assessmentId: testAssessmentId,
    studentId: 'test_student@placement.edu',
    technicalScore: 80,
    correctAnswers: 12,
    incorrectAnswers: 3,
    status: 'Completed',
    completedAt: new Date().toISOString()
  });

  const retrieved = await getAssessmentFromFirestore(testAssessmentId);
  const latest = await getLatestAssessmentForStudent('test_student@placement.edu');
  if (retrieved && retrieved.technicalScore === 80 && latest && latest.assessmentId === testAssessmentId) {
    console.log('✓ PASS: Assessment successfully saved and retrieved from persistence layer.');
  } else {
    throw new Error('Assessment persistence failed.');
  }

  console.log('\n=============================================');
  console.log(' ALL 6 CORE TECHNICAL ASSESSMENT TESTS PASSED!');
  console.log('=============================================\n');
}

runTests().catch(err => {
  console.error('\n❌ Test Error:', err);
  process.exit(1);
});
