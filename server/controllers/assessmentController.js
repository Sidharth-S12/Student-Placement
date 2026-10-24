import { generateQuestionFromGroq } from '../services/groqQuestionService.js';
import { predictDifficulty, DIFFICULTY_LEVELS } from '../services/mlDifficultyService.js';
import {
  evaluateAnswer,
  evaluateCodingTestCases,
  computeTechnicalScore,
  compileFinalInsights
} from '../services/assessmentEvaluationService.js';
import {
  saveAssessmentToFirestore,
  getAssessmentFromFirestore,
  getLatestAssessmentForStudent,
  getStudentQuestionHistory,
  recordStudentQuestions,
  verifyAuthToken
} from '../config/firebaseAdmin.js';

// In-memory active session store (for fast validation and securing correct answers during the 15-question run)
const activeSessions = new Map();

/**
 * Cleans and normalizes skill strings from student dashboard.
 * - removes duplicates
 * - trims spaces
 * - ignores empty values
 */
export function normalizeSkills(rawSkills) {
  if (!rawSkills) return [];
  const list = Array.isArray(rawSkills) ? rawSkills : [rawSkills];
  const uniqueSet = new Set();
  const result = [];

  list.forEach(item => {
    let text = '';
    if (typeof item === 'string') {
      text = item;
    } else if (item && typeof item === 'object' && item.name) {
      text = item.name;
    }

    if (text) {
      // Split commas if multiple skills were entered in one input
      const parts = text.split(/[,&]/).map(p => p.trim());
      parts.forEach(p => {
        if (p && p.length > 0) {
          const key = p.toLowerCase();
          if (!uniqueSet.has(key)) {
            uniqueSet.add(key);
            result.push(p);
          }
        }
      });
    }
  });

  return result;
}

/**
 * Strips sensitive evaluation fields (correctAnswer, explanation) so the student cannot inspect it in DevTools.
 */
function sanitizeQuestionForClient(question, questionIndex, totalQuestions = 15) {
  if (!question) return null;
  return {
    id: question.id,
    skill: question.skill,
    topic: question.topic || 'Core Concept',
    difficulty: question.difficulty,
    type: question.type,
    question: question.question,
    options: question.options || null,
    starterCode: question.starterCode || null,
    testCases: question.testCases ? question.testCases.map(tc => ({
      description: tc.description,
      input: tc.input,
      expectedOutput: tc.expectedOutput
    })) : null,
    questionIndex,
    totalQuestions
  };
}

/**
 * POST /api/technical-assessment/start
 * Initializes a new 15-question assessment starting at 0% and EASY difficulty.
 */
export async function startAssessment(req, res) {
  try {
    const user = await verifyAuthToken(req);
    const studentId = user.uid || req.body.studentId || 'default_student';

    const normalizedSkills = normalizeSkills(req.body.skills);

    if (normalizedSkills.length === 0) {
      return res.status(400).json({
        error: 'No technical skills provided. Please add programming languages, frameworks, or databases in your profile before starting.'
      });
    }

    const assessmentId = `assess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const totalQuestions = 15;

    // Per-skill state initialization starting at EASY
    const skillStates = {};
    normalizedSkills.forEach(s => {
      skillStates[s] = {
        skill: s,
        currentDifficulty: DIFFICULTY_LEVELS.EASY,
        questionsAttempted: 0,
        correctAnswers: 0,
        consecutiveCorrect: 0,
        consecutiveIncorrect: 0,
        score: 0,
        history: []
      };
    });

    // Select skill for Question 1
    const firstSkill = normalizedSkills[0];
    const initialDifficulty = DIFFICULTY_LEVELS.EASY;

    // Load lifetime question history for this student across past assessments to prevent repetition
    const studentPastQuestions = await getStudentQuestionHistory(studentId);

    // Generate Question 1 dynamically via Groq
    const question1 = await generateQuestionFromGroq({
      studentSkills: normalizedSkills,
      skill: firstSkill,
      difficulty: initialDifficulty,
      questionNumber: 1,
      totalQuestions,
      questionHistory: studentPastQuestions || [],
      recentPerformance: { recentAccuracy: 0, technicalScore: 0 },
      skillPerformance: skillStates
    });

    // Record question 1 in student's lifetime question history immediately
    await recordStudentQuestions(studentId, [question1]);

    const session = {
      assessmentId,
      studentId,
      skills: normalizedSkills,
      totalQuestions,
      currentQuestionNumber: 1,
      currentSkillIndex: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      attemptedQuestions: 0,
      technicalScore: 0,
      currentQuestion: question1,
      questionHistory: [],
      studentPastQuestions: studentPastQuestions || [],
      skillStates,
      results: [],
      startedAt: new Date().toISOString(),
      isCompleted: false
    };

    activeSessions.set(assessmentId, session);

    return res.status(200).json({
      success: true,
      assessmentId,
      totalQuestions,
      currentQuestionNumber: 1,
      technicalScore: 0,
      skills: normalizedSkills,
      question: sanitizeQuestionForClient(question1, 1, totalQuestions)
    });
  } catch (err) {
    console.error('[AssessmentController:start]', err);
    return res.status(500).json({
      error: err.message || 'Failed to initialize assessment.'
    });
  }
}

/**
 * POST /api/technical-assessment/answer
 * Evaluates student answer on backend, predicts adaptive difficulty with ML engine,
 * updates live score, and returns immediate result & explanation.
 */
export async function submitAnswer(req, res) {
  try {
    const user = await verifyAuthToken(req);
    const { assessmentId, studentAnswer, responseTimeMs } = req.body;

    const session = activeSessions.get(assessmentId);
    if (!session) {
      return res.status(404).json({
        error: 'Active assessment session not found. Please start a new assessment.'
      });
    }

    if (session.isCompleted) {
      return res.status(400).json({
        error: 'This assessment has already concluded.'
      });
    }

    const currentQuestion = session.currentQuestion;
    if (!currentQuestion) {
      return res.status(400).json({ error: 'No active question waiting for an answer.' });
    }

    // 1. Server-side validation
    const { isCorrect, evalDetails } = evaluateAnswer(currentQuestion, studentAnswer);

    // Check if the current question was already submitted in this session (retry/update)
    const existingIndex = session.results.findIndex(r => r.question?.id === currentQuestion.id);
    const isRetry = existingIndex !== -1;

    // 2. Update session counters
    if (!isRetry) {
      session.attemptedQuestions += 1;
      if (isCorrect) {
        session.correctAnswers += 1;
      } else {
        session.incorrectAnswers += 1;
      }
    } else {
      const prevResult = session.results[existingIndex];
      if (prevResult.isCorrect !== isCorrect) {
        if (isCorrect) {
          session.correctAnswers += 1;
          session.incorrectAnswers = Math.max(0, session.incorrectAnswers - 1);
        } else {
          session.correctAnswers = Math.max(0, session.correctAnswers - 1);
          session.incorrectAnswers += 1;
        }
      }
    }

    session.technicalScore = computeTechnicalScore(session.correctAnswers, session.attemptedQuestions);

    // 3. Update skill specific metrics
    const skill = currentQuestion.skill;
    const skillState = session.skillStates[skill] || {
      skill,
      currentDifficulty: DIFFICULTY_LEVELS.EASY,
      questionsAttempted: 0,
      correctAnswers: 0,
      consecutiveCorrect: 0,
      consecutiveIncorrect: 0,
      score: 0,
      history: []
    };

    if (!isRetry) {
      skillState.questionsAttempted += 1;
      if (isCorrect) {
        skillState.correctAnswers += 1;
        skillState.consecutiveCorrect += 1;
        skillState.consecutiveIncorrect = 0;
      } else {
        skillState.consecutiveIncorrect += 1;
        skillState.consecutiveCorrect = 0;
      }
    } else {
      const prevResult = session.results[existingIndex];
      if (prevResult.isCorrect !== isCorrect) {
        if (isCorrect) {
          skillState.correctAnswers += 1;
        } else {
          skillState.correctAnswers = Math.max(0, skillState.correctAnswers - 1);
        }
      }
    }
    skillState.score = Math.round((skillState.correctAnswers / (skillState.questionsAttempted || 1)) * 100);

    // Record question in session history (temporary for this assessment to prevent Groq repeats)
    const historyItem = {
      questionId: currentQuestion.id,
      skill: currentQuestion.skill,
      topic: currentQuestion.topic,
      difficulty: currentQuestion.difficulty,
      type: currentQuestion.type,
      questionText: currentQuestion.question,
      studentAnswer,
      isCorrect,
      timestamp: new Date().toISOString()
    };
    if (!isRetry) {
      session.questionHistory.push(historyItem);
      skillState.history.push(historyItem);
    } else {
      session.questionHistory[session.questionHistory.length - 1] = historyItem;
      skillState.history[skillState.history.length - 1] = historyItem;
    }

    // 4. ML Adaptive Difficulty Prediction
    const recentWindow = session.questionHistory.slice(-4);
    const recentAccuracy = recentWindow.length > 0
      ? Math.round((recentWindow.filter(q => q.isCorrect).length / recentWindow.length) * 100)
      : 0;

    const mlPrediction = await predictDifficulty({
      currentDifficulty: skillState.currentDifficulty,
      isCorrect,
      recentAccuracy,
      technicalScore: session.technicalScore,
      skillAccuracy: skillState.score,
      topicAccuracy: isCorrect ? 100 : 0,
      consecutiveCorrect: skillState.consecutiveCorrect,
      consecutiveIncorrect: skillState.consecutiveIncorrect,
      questionNumber: session.attemptedQuestions,
      totalAttempted: skillState.questionsAttempted,
      responseTimeMs
    });

    // Update difficulty for this skill
    skillState.currentDifficulty = mlPrediction.difficulty;
    session.skillStates[skill] = skillState;

    // Record result details
    const resultItem = {
      question: currentQuestion,
      isCorrect,
      studentAnswer,
      evalDetails,
      skill,
      topic: currentQuestion.topic,
      difficulty: currentQuestion.difficulty,
      nextPredictedDifficulty: mlPrediction.difficulty,
      mlModelType: mlPrediction.modelType
    };

    if (isRetry) {
      session.results[existingIndex] = resultItem;
    } else {
      session.results.push(resultItem);
    }

    // Format human-readable yourAnswer and correctAnswer
    let formattedYourAnswer = '';
    let formattedCorrectAnswer = '';
    const studentIdx = Number(studentAnswer);
    const correctIdx = Number(currentQuestion.correctAnswer);

    if (currentQuestion.type === 'mcq') {
      if (!isNaN(studentIdx) && Array.isArray(currentQuestion.options) && studentIdx >= 0 && studentIdx < currentQuestion.options.length) {
        formattedYourAnswer = `${String.fromCharCode(65 + studentIdx)}. ${currentQuestion.options[studentIdx]}`;
      } else {
        formattedYourAnswer = String(studentAnswer ?? 'No answer provided');
      }

      if (!isNaN(correctIdx) && Array.isArray(currentQuestion.options) && correctIdx >= 0 && correctIdx < currentQuestion.options.length) {
        formattedCorrectAnswer = `${String.fromCharCode(65 + correctIdx)}. ${currentQuestion.options[correctIdx]}`;
      } else {
        formattedCorrectAnswer = String(currentQuestion.correctAnswer ?? '');
      }
    } else {
      formattedYourAnswer = typeof studentAnswer === 'string' ? studentAnswer : JSON.stringify(studentAnswer);
      formattedCorrectAnswer = currentQuestion.starterCode || 'Correct implementation satisfying all test cases';
    }

    // 5. Check if assessment is finished (Exactly 15 Questions)
    if (session.attemptedQuestions >= session.totalQuestions) {
      session.isCompleted = true;
      session.completedAt = new Date().toISOString();

      const finalInsights = compileFinalInsights(session);

      const firestoreRecord = {
        assessmentId: session.assessmentId,
        studentId: session.studentId,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        totalQuestions: session.totalQuestions,
        correctAnswers: session.correctAnswers,
        incorrectAnswers: session.incorrectAnswers,
        technicalScore: session.technicalScore,
        skillsAssessed: session.skills,
        skillPerformance: finalInsights.skillPerformance,
        topicPerformance: finalInsights.topicPerformance,
        highestDifficulty: finalInsights.highestDifficulty,
        strengths: finalInsights.strengths,
        areasForImprovement: finalInsights.areasForImprovement,
        status: 'Completed'
      };

      // Persist question history and assessment record to Firebase Firestore
      await recordStudentQuestions(session.studentId, session.questionHistory);
      await saveAssessmentToFirestore(session.assessmentId, firestoreRecord);

      return res.status(200).json({
        success: true,
        isCompleted: true,
        correct: isCorrect,
        isCorrect,
        yourAnswer: formattedYourAnswer,
        correctAnswer: formattedCorrectAnswer,
        correctAnswerIndex: correctIdx,
        yourAnswerIndex: studentIdx,
        explanation: currentQuestion.explanation,
        evalDetails,
        score: session.technicalScore,
        liveScore: session.technicalScore,
        correctAnswers: session.correctAnswers,
        incorrectAnswers: session.incorrectAnswers,
        attemptedQuestions: session.attemptedQuestions,
        questionNumber: session.attemptedQuestions,
        totalQuestions: session.totalQuestions,
        finalResult: finalInsights
      });
    }

    // 6. Return evaluation result immediately (<50ms) without waiting for Groq
    return res.status(200).json({
      success: true,
      isCompleted: false,
      correct: isCorrect,
      isCorrect,
      yourAnswer: formattedYourAnswer,
      correctAnswer: formattedCorrectAnswer,
      correctAnswerIndex: correctIdx,
      yourAnswerIndex: studentIdx,
      explanation: currentQuestion.explanation,
      evalDetails,
      score: session.technicalScore,
      liveScore: session.technicalScore,
      correctAnswers: session.correctAnswers,
      incorrectAnswers: session.incorrectAnswers,
      attemptedQuestions: session.attemptedQuestions,
      questionNumber: session.attemptedQuestions,
      totalQuestions: session.totalQuestions,
      mlInsights: {
        predictedDifficulty: mlPrediction.difficulty,
        usedML: mlPrediction.usedML,
        modelType: mlPrediction.modelType
      }
    });
  } catch (err) {
    console.error('[AssessmentController:submitAnswer]', err);
    return res.status(500).json({
      error: err.message || 'Failed to evaluate answer.'
    });
  }
}

/**
 * POST /api/technical-assessment/next-question
 * Generates the next question on-demand via Groq AI using updated ML difficulty.
 * Includes deduplication guards and robust error handling.
 */
export async function getNextQuestion(req, res) {
  try {
    const user = await verifyAuthToken(req);
    const { assessmentId } = req.body;

    const session = activeSessions.get(assessmentId);
    if (!session) {
      return res.status(404).json({
        error: 'Active assessment session not found. Please start a new assessment.'
      });
    }

    if (session.isCompleted) {
      return res.status(400).json({
        error: 'This assessment has already concluded.'
      });
    }

    // Deduplication check: if a generation request is currently in-flight for this session, wait for it
    if (session.isGeneratingNextQuestion && session.pendingGenerationPromise) {
      try {
        const result = await session.pendingGenerationPromise;
        return res.status(200).json(result);
      } catch (err) {
        return res.status(500).json({
          error: 'Unable to generate the next question. Please try again.'
        });
      }
    }

    // Advance question index and select next skill
    session.currentQuestionNumber = session.attemptedQuestions + 1;
    session.currentSkillIndex = (session.currentSkillIndex + 1) % session.skills.length;
    const nextSkill = session.skills[session.currentSkillIndex];
    const nextSkillDifficulty = session.skillStates[nextSkill]?.currentDifficulty || DIFFICULTY_LEVELS.EASY;

    const fullHistoricalQuestions = [
      ...(session.studentPastQuestions || []),
      ...session.questionHistory
    ];

    const recentWindow = session.questionHistory.slice(-4);
    const recentAccuracy = recentWindow.length > 0
      ? Math.round((recentWindow.filter(q => q.isCorrect).length / recentWindow.length) * 100)
      : 0;

    session.isGeneratingNextQuestion = true;

    const generationPromise = (async () => {
      const nextQuestion = await generateQuestionFromGroq({
        studentSkills: session.skills,
        skill: nextSkill,
        difficulty: nextSkillDifficulty,
        questionNumber: session.currentQuestionNumber,
        totalQuestions: session.totalQuestions,
        questionHistory: fullHistoricalQuestions,
        recentPerformance: {
          recentAccuracy,
          technicalScore: session.technicalScore
        },
        skillPerformance: session.skillStates
      });

      session.currentQuestion = nextQuestion;
      await recordStudentQuestions(session.studentId, [nextQuestion]);

      return {
        success: true,
        questionIndex: session.currentQuestionNumber,
        totalQuestions: session.totalQuestions,
        question: sanitizeQuestionForClient(nextQuestion, session.currentQuestionNumber, session.totalQuestions),
        mlInsights: {
          skill: nextSkill,
          predictedDifficulty: nextSkillDifficulty
        }
      };
    })();

    session.pendingGenerationPromise = generationPromise;

    try {
      const result = await generationPromise;
      session.isGeneratingNextQuestion = false;
      session.pendingGenerationPromise = null;
      return res.status(200).json(result);
    } catch (groqErr) {
      session.isGeneratingNextQuestion = false;
      session.pendingGenerationPromise = null;
      console.error('[AssessmentController:getNextQuestion] Groq generation error:', groqErr);
      return res.status(500).json({
        error: 'Unable to generate the next question. Please try again.'
      });
    }
  } catch (err) {
    console.error('[AssessmentController:getNextQuestion] Unexpected error:', err);
    return res.status(500).json({
      error: err.message || 'Unable to generate the next question. Please try again.'
    });
  }
}

/**
 * GET /api/technical-assessment/latest
 * Retrieves the latest completed assessment score for the student from Firestore.
 */
export async function getLatestAssessment(req, res) {
  try {
    const user = await verifyAuthToken(req);
    const studentId = req.query.studentId || user.uid || 'default_student';

    const latest = await getLatestAssessmentForStudent(studentId);

    if (!latest) {
      return res.status(200).json({
        found: false,
        message: 'No completed technical assessments found.'
      });
    }

    return res.status(200).json({
      found: true,
      assessment: latest
    });
  } catch (err) {
    console.error('[AssessmentController:getLatestAssessment]', err);
    return res.status(500).json({
      error: err.message || 'Failed to retrieve latest assessment.'
    });
  }
}

/**
 * GET /api/technical-assessment/:assessmentId
 * Retrieves a specific assessment by ID from Firestore.
 */
export async function getAssessmentById(req, res) {
  try {
    const { assessmentId } = req.params;
    const data = await getAssessmentFromFirestore(assessmentId);

    if (!data) {
      return res.status(404).json({ error: 'Assessment not found.' });
    }

    return res.status(200).json({
      success: true,
      assessment: data
    });
  } catch (err) {
    console.error('[AssessmentController:getAssessmentById]', err);
    return res.status(500).json({
      error: err.message || 'Failed to retrieve assessment.'
    });
  }
}

/**
 * POST /api/technical-assessment/generate-question
 * Generates an ad-hoc question via Groq API.
 */
export async function generateQuestion(req, res) {
  try {
    const { skill, difficulty = 'EASY', questionNumber = 1, studentSkills = [], questionHistory = [] } = req.body;

    if (!skill) {
      return res.status(400).json({ error: 'Target skill is required.' });
    }

    const question = await generateQuestionFromGroq({
      studentSkills: studentSkills.length > 0 ? studentSkills : [skill],
      skill,
      difficulty,
      questionNumber,
      questionHistory
    });

    return res.status(200).json({
      success: true,
      question: sanitizeQuestionForClient(question, questionNumber)
    });
  } catch (err) {
    console.error('[AssessmentController:generateQuestion]', err);
    return res.status(500).json({
      error: err.message || 'Failed to generate question.'
    });
  }
}

/**
 * POST /api/technical-assessment/run-code
 * Runs user code against test cases using Python or JavaScript runtime and returns results.
 */
export async function runCode(req, res) {
  try {
    const { assessmentId, code, testCases, skill } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'No code submitted.' });
    }

    let actualTestCases = testCases || [];
    let effectiveSkill = skill || '';

    if (assessmentId) {
      const session = activeSessions.get(assessmentId);
      if (session && session.currentQuestion) {
        if (session.currentQuestion.testCases && session.currentQuestion.testCases.length > 0) {
          actualTestCases = session.currentQuestion.testCases;
        }
        effectiveSkill = effectiveSkill || session.currentQuestion.skill || '';
      }
    }

    const evalDetails = evaluateCodingTestCases(code, actualTestCases, effectiveSkill);
    return res.status(200).json(evalDetails);
  } catch (err) {
    console.error('[AssessmentController:runCode]', err);
    return res.status(500).json({ error: err.message || 'Execution error.' });
  }
}

