import {
  generateAptitudeQuestionFromGroq,
  APTITUDE_SCHEDULE,
  APTITUDE_CATEGORIES
} from '../services/groqAptitudeService.js';
import {
  isAssessmentTimerExpired,
  getRemainingSeconds,
  evaluateAptitudeAnswer,
  calculateAptitudeScore,
  compileAptitudeInsights,
  initializeCategoryTracking
} from '../services/aptitudeEvaluationService.js';
import {
  saveAptitudeAssessmentToFirestore,
  updateStudentLatestAptitude,
  getAptitudeAssessmentFromFirestore,
  getLatestAptitudeAssessmentForStudent,
  getStudentAptitudeQuestionHistory,
  recordStudentAptitudeQuestions,
  verifyAuthToken
} from '../config/firebaseAdmin.js';

// In-memory active session store (for fast state transitions and keeping correct answers secure)
const activeAptitudeSessions = new Map();

/**
 * Strips sensitive fields (correctAnswer, explanation) so student cannot inspect answer in DevTools.
 */
function sanitizeAptitudeQuestionForClient(question, questionIndex, totalQuestions = 20) {
  if (!question) return null;
  return {
    id: question.id,
    category: question.category,
    subtopic: question.subtopic || 'General',
    difficulty: question.difficulty || 'MEDIUM',
    type: 'MCQ',
    question: question.question,
    options: question.options || [],
    questionIndex,
    totalQuestions
  };
}

/**
 * Helper to finalize and persist an aptitude session
 */
async function finalizeAssessment(session, reason = 'Completed') {
  const finalResults = compileAptitudeInsights(session.responses, session.categoryScores);
  const totalTimeSpentSeconds = Math.min(
    1200,
    Math.round((Date.now() - session.startTime) / 1000)
  );

  const completedDoc = {
    id: session.assessmentId,
    assessmentId: session.assessmentId,
    studentId: session.studentId,
    startTime: new Date(session.startTime).toISOString(),
    completedAt: new Date().toISOString(),
    totalQuestions: session.totalQuestions,
    answeredQuestions: session.responses.length,
    correctAnswers: finalResults.correctCount,
    finalScore: finalResults.finalScore,
    score: finalResults.finalScore,
    categoryBreakdown: finalResults.categoryBreakdown,
    strengths: finalResults.strengths,
    improvements: finalResults.improvements,
    summaryFeedback: finalResults.summaryFeedback,
    totalTimeSpentSeconds,
    status: 'Completed',
    finishReason: reason,
    responses: session.responses.map(r => ({
      questionIndex: r.questionIndex,
      category: r.category,
      subtopic: r.subtopic,
      difficulty: r.difficulty,
      question: r.question,
      options: r.options,
      studentAnswer: r.studentAnswer,
      correctAnswer: r.correctAnswer,
      isCorrect: r.isCorrect,
      explanation: r.explanation,
      answeredAt: r.answeredAt
    }))
  };

  // Record questions asked into lifetime anti-repetition memory
  try {
    const questionsToRecord = session.responses.map(r => ({
      id: r.id,
      category: r.category,
      subtopic: r.subtopic,
      difficulty: r.difficulty,
      questionText: r.question
    }));
    await recordStudentAptitudeQuestions(session.studentId, questionsToRecord);
  } catch (err) {
    console.warn('[Aptitude] Anti-repetition record error:', err.message);
  }

  // Persist assessment document & update student's profile
  try {
    await saveAptitudeAssessmentToFirestore(completedDoc);
    await updateStudentLatestAptitude(session.studentId, completedDoc);
  } catch (err) {
    console.error('[Aptitude] Persistence failed:', err.message);
  }

  // Cleanup active session
  activeAptitudeSessions.delete(session.assessmentId);

  return completedDoc;
}

/**
 * POST /api/aptitude/start
 * Initializes a new 20-question, 20-minute aptitude assessment.
 */
export async function startAptitudeAssessment(req, res) {
  try {
    const user = await verifyAuthToken(req);
    const studentId = user.uid || req.body.studentId || 'default_student';

    const assessmentId = `apt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const totalQuestions = 20;
    const durationSeconds = 1200; // 20 minutes
    const startTime = Date.now();
    const endTime = startTime + (durationSeconds * 1000);

    // Retrieve previous question texts across lifetime to prevent repetition
    const questionHistory = await getStudentAptitudeQuestionHistory(studentId);
    const pastQuestionTexts = questionHistory.map(q => q.questionText || q.question || '').filter(Boolean);

    console.log(`[Aptitude] Starting session ${assessmentId} for student ${studentId}. Previous questions: ${pastQuestionTexts.length}`);

    // Generate Question #1 according to schedule
    const q1Config = APTITUDE_SCHEDULE[0]; // index 0 is Question 1
    const firstQuestion = await generateAptitudeQuestionFromGroq({
      category: q1Config.category,
      difficulty: q1Config.difficulty,
      pastQuestions: pastQuestionTexts,
      questionIndex: 1,
      totalQuestions
    });

    const categoryScores = initializeCategoryTracking();

    const sessionData = {
      assessmentId,
      studentId,
      startTime,
      durationSeconds,
      endTime,
      totalQuestions,
      currentQuestionIndex: 1,
      currentQuestion: firstQuestion,
      responses: [],
      categoryScores,
      pastQuestionTexts: [...pastQuestionTexts, firstQuestion.question]
    };

    activeAptitudeSessions.set(assessmentId, sessionData);

    const clientQuestion = sanitizeAptitudeQuestionForClient(firstQuestion, 1, totalQuestions);

    return res.status(201).json({
      assessmentId,
      totalQuestions,
      durationSeconds,
      startTime,
      endTime,
      questionIndex: 1,
      question: clientQuestion,
      currentScore: 0,
      categoryScores: {
        'Quantitative Aptitude': { score: 0, max: 5 },
        'Logical Reasoning': { score: 0, max: 5 },
        'Verbal Ability': { score: 0, max: 5 },
        'Basic Technical Aptitude': { score: 0, max: 5 }
      }
    });
  } catch (error) {
    console.error('[Aptitude] startAssessment error:', error);
    return res.status(500).json({
      error: 'Failed to start Aptitude Assessment. Please check server logs.',
      details: error.message
    });
  }
}

/**
 * POST /api/aptitude/submit
 * Submits an answer for the current question, updates score, checks timer,
 * and generates the next question or completes the test.
 */
export async function submitAptitudeAnswer(req, res) {
  try {
    const { assessmentId, answer, action } = req.body;

    if (!assessmentId) {
      return res.status(400).json({ error: 'assessmentId is required.' });
    }

    const session = activeAptitudeSessions.get(assessmentId);
    if (!session) {
      return res.status(404).json({
        error: 'Aptitude Assessment session expired or not found. Please restart the test.'
      });
    }

    // 1. Timer check: Has 20 minutes expired?
    if (isAssessmentTimerExpired(session.endTime)) {
      console.log(`[Aptitude] Assessment ${assessmentId} timer expired. Auto-submitting.`);
      const completedDoc = await finalizeAssessment(session, 'TimeExpired');
      return res.status(200).json({
        isComplete: true,
        reason: 'TimeExpired',
        assessment: completedDoc
      });
    }

    // 2. If student explicitly requested early finalize
    if (action === 'finish') {
      console.log(`[Aptitude] Student requested early submission for ${assessmentId}.`);
      const completedDoc = await finalizeAssessment(session, 'EarlySubmission');
      return res.status(200).json({
        isComplete: true,
        reason: 'EarlySubmission',
        assessment: completedDoc
      });
    }

    const currentQuestion = session.currentQuestion;
    const questionIndex = session.currentQuestionIndex;

    // 3. Evaluate the answer
    const evalResult = evaluateAptitudeAnswer(currentQuestion, answer);

    // 4. Update category scores
    const categoryKey = currentQuestion.category;
    if (session.categoryScores[categoryKey]) {
      session.categoryScores[categoryKey].total += 1;
      if (evalResult.isCorrect) {
        session.categoryScores[categoryKey].correct += 1;
      }
    }

    // 5. Store response log
    session.responses.push({
      id: currentQuestion.id,
      questionIndex,
      category: currentQuestion.category,
      subtopic: currentQuestion.subtopic,
      difficulty: currentQuestion.difficulty,
      question: currentQuestion.question,
      options: currentQuestion.options,
      studentAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: evalResult.isCorrect,
      explanation: evalResult.explanation,
      answeredAt: new Date().toISOString()
    });

    const currentScore = calculateAptitudeScore(session.responses);

    // 6. Check if this was the last question (Question 20)
    if (questionIndex >= session.totalQuestions) {
      console.log(`[Aptitude] Question ${questionIndex} of ${session.totalQuestions} completed. Finalizing.`);
      const completedDoc = await finalizeAssessment(session, 'AllQuestionsCompleted');
      return res.status(200).json({
        isComplete: true,
        lastQuestionFeedback: {
          isCorrect: evalResult.isCorrect,
          correctAnswer: evalResult.correctAnswer,
          explanation: evalResult.explanation
        },
        assessment: completedDoc
      });
    }

    // 7. Generate Next Question dynamically using schedule
    const nextQuestionIndex = questionIndex + 1;
    const nextScheduleConfig = APTITUDE_SCHEDULE[nextQuestionIndex - 1];

    const nextQuestion = await generateAptitudeQuestionFromGroq({
      category: nextScheduleConfig.category,
      difficulty: nextScheduleConfig.difficulty,
      pastQuestions: session.pastQuestionTexts,
      questionIndex: nextQuestionIndex,
      totalQuestions: session.totalQuestions
    });

    session.currentQuestionIndex = nextQuestionIndex;
    session.currentQuestion = nextQuestion;
    session.pastQuestionTexts.push(nextQuestion.question);

    const clientNextQuestion = sanitizeAptitudeQuestionForClient(
      nextQuestion,
      nextQuestionIndex,
      session.totalQuestions
    );

    const remainingSeconds = getRemainingSeconds(session.endTime);

    return res.status(200).json({
      isComplete: false,
      lastQuestionFeedback: {
        isCorrect: evalResult.isCorrect,
        correctAnswer: evalResult.correctAnswer,
        explanation: evalResult.explanation
      },
      currentScore,
      remainingSeconds,
      endTime: session.endTime,
      nextQuestion: clientNextQuestion
    });
  } catch (error) {
    console.error('[Aptitude] submitAptitudeAnswer error:', error);
    return res.status(500).json({
      error: 'Failed to process aptitude answer. Please try again.',
      details: error.message
    });
  }
}

/**
 * GET /api/aptitude/latest
 * Retrieves the student's latest completed aptitude assessment.
 */
export async function getLatestAptitudeAssessment(req, res) {
  try {
    const user = await verifyAuthToken(req);
    const studentId = user.uid || req.query.studentId || 'default_student';

    const latest = await getLatestAptitudeAssessmentForStudent(studentId);
    if (!latest) {
      return res.status(404).json({ message: 'No completed aptitude assessment found.' });
    }

    return res.status(200).json(latest);
  } catch (error) {
    console.error('[Aptitude] getLatestAptitudeAssessment error:', error);
    return res.status(500).json({ error: 'Failed to fetch latest aptitude assessment.' });
  }
}

/**
 * GET /api/aptitude/:id
 * Retrieves a specific aptitude assessment by ID.
 */
export async function getAptitudeAssessmentById(req, res) {
  try {
    const { id } = req.params;
    const assessment = await getAptitudeAssessmentFromFirestore(id);
    if (!assessment) {
      return res.status(404).json({ error: 'Aptitude assessment not found.' });
    }
    return res.status(200).json(assessment);
  } catch (error) {
    console.error('[Aptitude] getAptitudeAssessmentById error:', error);
    return res.status(500).json({ error: 'Failed to fetch assessment by ID.' });
  }
}
