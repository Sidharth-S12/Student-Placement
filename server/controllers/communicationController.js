import {
  generateCommunicationQuestionFromGroq,
  COMMUNICATION_SCHEDULE,
  COMMUNICATION_CATEGORIES,
  evaluateCommunicationAnswer,
  evaluateOpenEndedInterviewResponse
} from '../services/groqCommunicationService.js';
import {
  saveCommunicationAssessmentToFirestore,
  updateStudentLatestCommunication,
  getCommunicationAssessmentFromFirestore,
  getLatestCommunicationAssessmentForStudent,
  verifyAuthToken
} from '../config/firebaseAdmin.js';

// In-memory active session store
const activeCommunicationSessions = new Map();

function sanitizeCommunicationQuestionForClient(question, questionIndex, totalQuestions = 7) {
  if (!question) return null;
  return {
    id: question.id,
    category: question.category,
    topic: question.topic || 'Placement Interview Communication',
    difficulty: question.difficulty || 'MEDIUM',
    interviewerContext: question.interviewerContext || 'Placement Interview Evaluation',
    type: 'MCQ',
    question: question.question,
    options: question.options || [],
    modelAnswer: question.modelAnswer || '',
    questionIndex,
    totalQuestions
  };
}

function compileCommunicationInsights(responses, categoryScores, totalQuestions = 7) {
  const totalAttempted = responses.length;
  const correctCount = responses.filter(r => r.isCorrect).length;
  // Scaled to 100% based on total 7 company interview questions
  const finalScore = Math.min(100, Math.round((correctCount / totalQuestions) * 100));

  const categoryBreakdown = {};
  COMMUNICATION_CATEGORIES.forEach(cat => {
    const stats = categoryScores[cat] || { attempted: 0, correct: 0 };
    const pct = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;
    categoryBreakdown[cat] = {
      attempted: stats.attempted,
      correct: stats.correct,
      percentage: pct,
      status: pct >= 75 ? 'Strong' : pct >= 50 ? 'Proficient' : 'Needs Practice'
    };
  });

  const strengths = [];
  const improvements = [];

  Object.entries(categoryBreakdown).forEach(([cat, data]) => {
    if (data.percentage >= 70) {
      strengths.push(`${cat} (${data.percentage}% accuracy)`);
    } else {
      improvements.push(`Refine ${cat.toLowerCase()} with STAR-format interview practice`);
    }
  });

  if (strengths.length === 0) {
    strengths.push('Active participation and willingness to learn standard company interview formats');
  }
  if (improvements.length === 0) {
    improvements.push('Maintain consistent STAR framework clarity across senior executive rounds');
  }

  let summaryFeedback = '';
  if (finalScore >= 80) {
    summaryFeedback = 'Outstanding placement interview performance! Highly articulate, strategic problem-solving (STAR method), and strong cultural and leadership poise.';
  } else if (finalScore >= 60) {
    summaryFeedback = 'Solid company interview readiness. Demonstrates sound professional awareness with opportunities to refine conciseness, measurable metrics, and conflict resolution.';
  } else {
    summaryFeedback = 'Developing interview profile. Focus on practicing the 7 core company questions, structuring answers with the STAR method, and avoiding common interview pitfalls.';
  }

  return {
    correctCount,
    finalScore,
    categoryBreakdown,
    strengths,
    improvements,
    summaryFeedback
  };
}

async function finalizeCommunicationSession(session, reason = 'Completed') {
  const finalResults = compileCommunicationInsights(session.responses, session.categoryScores, session.totalQuestions || 7);
  const totalTimeSpentSeconds = Math.min(
    session.durationSeconds || 600,
    Math.round((Date.now() - session.startTime) / 1000)
  );

  const completedDoc = {
    id: session.assessmentId,
    assessmentId: session.assessmentId,
    studentId: session.studentId,
    startTime: new Date(session.startTime).toISOString(),
    completedAt: new Date().toISOString(),
    totalQuestions: session.totalQuestions || 7,
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
      topic: r.topic,
      difficulty: r.difficulty,
      question: r.question,
      options: r.options,
      studentAnswer: r.studentAnswer,
      correctAnswer: r.correctAnswer,
      isCorrect: r.isCorrect,
      explanation: r.explanation,
      modelAnswer: r.modelAnswer || '',
      answeredAt: r.answeredAt
    }))
  };

  try {
    await saveCommunicationAssessmentToFirestore(completedDoc);
    await updateStudentLatestCommunication(session.studentId, completedDoc);
  } catch (err) {
    console.error('[Communication] Persistence failed:', err.message);
  }

  activeCommunicationSessions.delete(session.assessmentId);
  return completedDoc;
}

/**
 * POST /api/communication/start
 */
export async function startCommunicationAssessment(req, res) {
  try {
    const user = await verifyAuthToken(req);
    const studentId = user.uid || req.body.studentId || 'default_student';

    const assessmentId = `comm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const totalQuestions = 7; // Exactly 7 core company interview questions
    const durationSeconds = 600; // 10 minutes
    const startTime = Date.now();
    const endTime = startTime + (durationSeconds * 1000);

    const q1Config = COMMUNICATION_SCHEDULE[0];
    const firstQuestion = await generateCommunicationQuestionFromGroq({
      category: q1Config.category,
      difficulty: q1Config.difficulty,
      questionNumber: 1,
      totalQuestions,
      questionHistory: []
    });

    const categoryScores = {};
    COMMUNICATION_CATEGORIES.forEach(cat => {
      categoryScores[cat] = { attempted: 0, correct: 0 };
    });

    const session = {
      assessmentId,
      studentId,
      startTime,
      endTime,
      durationSeconds,
      totalQuestions,
      currentQuestionIndex: 1,
      currentQuestion: firstQuestion,
      responses: [],
      categoryScores,
      isCompleted: false
    };

    activeCommunicationSessions.set(assessmentId, session);

    const clientQuestion = sanitizeCommunicationQuestionForClient(firstQuestion, 1, totalQuestions);

    return res.status(200).json({
      assessmentId,
      studentId,
      startTime,
      endTime,
      durationSeconds,
      totalQuestions,
      currentQuestion: clientQuestion,
      currentQuestionIndex: 1,
      currentScore: 0
    });
  } catch (error) {
    console.error('[Communication] startAssessment error:', error);
    return res.status(500).json({
      error: 'Failed to start Placement Interview Assessment. Please check server logs.',
      details: error.message
    });
  }
}

/**
 * POST /api/communication/submit
 */
export async function submitCommunicationAnswer(req, res) {
  try {
    const { assessmentId, answer, action } = req.body;

    if (!assessmentId) {
      return res.status(400).json({ error: 'Assessment ID is required.' });
    }

    const session = activeCommunicationSessions.get(assessmentId);
    if (!session) {
      return res.status(404).json({ error: 'Communication assessment session not found or already completed.' });
    }

    // Check timer expiration
    if (Date.now() > session.endTime) {
      const completedDoc = await finalizeCommunicationSession(session, 'TimeExpired');
      return res.status(200).json({
        isComplete: true,
        reason: 'TimeExpired',
        assessment: completedDoc
      });
    }

    // Finish early action
    if (action === 'finish') {
      const completedDoc = await finalizeCommunicationSession(session, 'UserFinishedEarly');
      return res.status(200).json({
        isComplete: true,
        reason: 'UserFinishedEarly',
        assessment: completedDoc
      });
    }

    const currentQuestion = session.currentQuestion;
    const evalResult = evaluateCommunicationAnswer(currentQuestion, answer);

    session.responses.push({
      questionIndex: session.currentQuestionIndex,
      category: currentQuestion.category,
      topic: currentQuestion.topic,
      difficulty: currentQuestion.difficulty,
      question: currentQuestion.question,
      options: currentQuestion.options,
      studentAnswer: answer,
      correctAnswer: evalResult.correctAnswer,
      isCorrect: evalResult.isCorrect,
      explanation: evalResult.explanation,
      modelAnswer: evalResult.modelAnswer || currentQuestion.modelAnswer || '',
      answeredAt: new Date().toISOString()
    });

    if (session.categoryScores[currentQuestion.category]) {
      session.categoryScores[currentQuestion.category].attempted += 1;
      if (evalResult.isCorrect) {
        session.categoryScores[currentQuestion.category].correct += 1;
      }
    }

    const correctSoFar = session.responses.filter(r => r.isCorrect).length;
    const currentScore = Math.min(100, Math.round((correctSoFar / session.totalQuestions) * 100));

    // Check if final question (Question 7)
    if (session.currentQuestionIndex >= session.totalQuestions) {
      session.isCompleted = true;
      const completedDoc = await finalizeCommunicationSession(session, 'Completed');

      return res.status(200).json({
        isComplete: true,
        lastQuestionFeedback: {
          isCorrect: evalResult.isCorrect,
          correctAnswer: evalResult.correctAnswer,
          explanation: evalResult.explanation,
          modelAnswer: evalResult.modelAnswer || currentQuestion.modelAnswer || ''
        },
        currentScore,
        assessment: completedDoc
      });
    }

    // Advance to Question N+1
    const nextQuestionIndex = session.currentQuestionIndex + 1;
    const nextSchedule = COMMUNICATION_SCHEDULE[nextQuestionIndex - 1] || {
      category: COMMUNICATION_CATEGORIES[(nextQuestionIndex - 1) % COMMUNICATION_CATEGORIES.length],
      difficulty: 'Medium'
    };

    const nextQuestion = await generateCommunicationQuestionFromGroq({
      category: nextSchedule.category,
      difficulty: nextSchedule.difficulty,
      questionNumber: nextQuestionIndex,
      totalQuestions: session.totalQuestions,
      questionHistory: session.responses
    });

    session.currentQuestionIndex = nextQuestionIndex;
    session.currentQuestion = nextQuestion;

    const clientNextQuestion = sanitizeCommunicationQuestionForClient(
      nextQuestion,
      nextQuestionIndex,
      session.totalQuestions
    );

    const remainingSeconds = Math.max(0, Math.round((session.endTime - Date.now()) / 1000));

    return res.status(200).json({
      isComplete: false,
      lastQuestionFeedback: {
        isCorrect: evalResult.isCorrect,
        correctAnswer: evalResult.correctAnswer,
        explanation: evalResult.explanation,
        modelAnswer: evalResult.modelAnswer || currentQuestion.modelAnswer || ''
      },
      currentScore,
      remainingSeconds,
      endTime: session.endTime,
      nextQuestion: clientNextQuestion
    });
  } catch (error) {
    console.error('[Communication] submitAnswer error:', error);
    return res.status(500).json({
      error: 'Failed to process interview answer. Please try again.',
      details: error.message
    });
  }
}

/**
 * POST /api/communication/practice-evaluate
 * Evaluates open-ended spoken or typed responses in the Mock Interview Studio.
 */
export async function evaluatePracticeInterviewAnswer(req, res) {
  try {
    const { question, answerText, category } = req.body;
    if (!question || !answerText) {
      return res.status(400).json({ error: 'Both question and answerText are required for evaluation.' });
    }

    const evaluation = await evaluateOpenEndedInterviewResponse({
      question,
      answerText,
      category: category || 'General Interview Question'
    });

    return res.status(200).json(evaluation);
  } catch (error) {
    console.error('[Communication] evaluatePracticeAnswer error:', error);
    return res.status(500).json({
      error: 'Failed to evaluate interview response.',
      details: error.message
    });
  }
}

/**
 * GET /api/communication/latest
 */
export async function getLatestCommunicationAssessment(req, res) {
  try {
    const user = await verifyAuthToken(req);
    const studentId = user.uid || req.query.studentId || 'default_student';

    const latest = await getLatestCommunicationAssessmentForStudent(studentId);
    if (!latest) {
      return res.status(200).json({
        found: false,
        message: 'No completed communication assessment found.'
      });
    }

    return res.status(200).json({
      found: true,
      assessment: latest
    });
  } catch (error) {
    console.error('[Communication] getLatest error:', error);
    return res.status(500).json({ error: 'Failed to fetch latest communication assessment.' });
  }
}

/**
 * GET /api/communication/:id
 */
export async function getCommunicationAssessmentById(req, res) {
  try {
    const { id } = req.params;
    const assessment = await getCommunicationAssessmentFromFirestore(id);
    if (!assessment) {
      return res.status(404).json({ error: 'Communication assessment not found.' });
    }
    return res.status(200).json(assessment);
  } catch (error) {
    console.error('[Communication] getById error:', error);
    return res.status(500).json({ error: 'Failed to fetch assessment by ID.' });
  }
}
