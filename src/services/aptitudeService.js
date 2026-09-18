import { getAuthHeaders } from './firebaseClient';

/**
 * Aptitude Assessment Frontend Service
 * 
 * Interacts with /api/aptitude backend endpoints:
 * - 20 dynamically generated questions via Groq (Zero hardcoded bank)
 * - 20-minute countdown timer with backend-enforced endTime
 * - 4 Mixed categories (~5 each): Quantitative, Logical, Verbal, Technical
 * - Live score calculation (5 marks per question = 100%)
 * - Auto-submission on timer expiry
 */

const API_BASE = '/api/aptitude';

/**
 * Starts a new 20-question, 20-minute Aptitude Assessment session.
 */
export async function startAptitudeSession(studentData) {
  const studentId = studentData?.personalInfo?.email || 'default_student';
  const headers = await getAuthHeaders(studentId);

  try {
    const response = await fetch(`${API_BASE}/start`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ studentId })
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();

    return {
      assessmentId: data.assessmentId,
      studentId,
      totalQuestions: data.totalQuestions || 20,
      durationSeconds: data.durationSeconds || 1200,
      startTime: data.startTime,
      endTime: data.endTime,
      currentQuestionIndex: data.questionIndex || 1,
      currentQuestion: data.question,
      currentScore: 0,
      categoryScores: data.categoryScores,
      isCompleted: false,
      startedAt: new Date(data.startTime).toISOString()
    };
  } catch (err) {
    console.error('[Aptitude Service:startSession] Error:', err);
    return {
      error: `Could not start Aptitude Assessment: ${err.message}. Please verify the backend server is running and your GROQ_API_KEY is configured.`
    };
  }
}

/**
 * Submits the selected MCQ answer for the current question.
 * Returns feedback, next question or completion result.
 */
export async function submitAptitudeAnswer(session, answer, action = null) {
  if (!session || !session.assessmentId) {
    throw new Error('No active aptitude session.');
  }

  const headers = await getAuthHeaders(session.studentId);

  try {
    const response = await fetch(`${API_BASE}/submit`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        assessmentId: session.assessmentId,
        answer,
        action
      })
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `Failed to submit aptitude answer (Status ${response.status})`);
    }

    const result = await response.json();

    if (result.isComplete) {
      session.isCompleted = true;
      session.assessment = result.assessment;
      return result;
    }

    session.currentScore = result.currentScore ?? session.currentScore;
    if (result.nextQuestion) {
      session.currentQuestion = result.nextQuestion;
      session.currentQuestionIndex = result.nextQuestion.questionIndex;
    }

    return result;
  } catch (err) {
    console.error('[Aptitude Service:submitAnswer] Error:', err);
    throw err;
  }
}

/**
 * Fetches the latest completed aptitude assessment for the student.
 */
export async function fetchLatestCompletedAptitude(studentId = 'default_student') {
  const headers = await getAuthHeaders(studentId);
  try {
    const res = await fetch(`${API_BASE}/latest?studentId=${encodeURIComponent(studentId)}`, {
      headers
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('[Aptitude Service] Failed to fetch latest aptitude assessment:', err.message);
  }
  return null;
}
