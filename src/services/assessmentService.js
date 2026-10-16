import { getAuthHeaders, fetchClientLatestAssessment } from './firebaseClient';

/**
 * Technical Assessment Frontend Service
 * 
 * Communicates with the Node.js API to run dynamically-generated, AI-powered assessments:
 * - Runtime question generation via Groq API (Strictly zero static question bank)
 * - Server-side ML adaptive difficulty updates
 * - Secure answer validation and live technical score calculation
 * - Persistence in Firebase Firestore
 */

const API_BASE = '/api/technical-assessment';

/**
 * Extracts and strictly normalizes technical skills from the student profile:
 * - Programming Languages
 * - Frameworks & Libraries
 * - Databases
 * - Tools & Technologies
 * 
 * Normalization:
 * - removes duplicates
 * - trims spaces
 * - ignores empty values
 * - maintains each skill separately identifiable
 * 
 * @param {Object} technicalSkills
 * @returns {Array<string>} Clean, deduplicated skill list
 */
export function extractAndNormalizeSkills(technicalSkills = {}) {
  if (!technicalSkills) return [];

  const rawBuckets = [
    technicalSkills.programmingLanguages || [],
    technicalSkills.frameworks || [],
    technicalSkills.databases || [],
    technicalSkills.toolsTechnologies || []
  ];

  const seen = new Set();
  const normalized = [];

  rawBuckets.forEach(bucket => {
    (Array.isArray(bucket) ? bucket : [bucket]).forEach(item => {
      let rawText = '';
      if (typeof item === 'string') {
        rawText = item;
      } else if (item && typeof item === 'object' && item.name) {
        rawText = item.name;
      }

      if (rawText) {
        // Split comma or ampersand lists if multiple were entered in one string
        const tokens = rawText.split(/[,&]/).map(s => s.trim());
        tokens.forEach(tok => {
          if (tok && tok.length > 0) {
            const key = tok.toLowerCase();
            if (!seen.has(key)) {
              seen.add(key);
              normalized.push(tok);
            }
          }
        });
      }
    });
  });

  return normalized;
}

/**
 * Evaluates JavaScript code locally for the "Run Code" interactive preview in the coding editor.
 */
export function evaluateCodingSubmission(userCode, testCases = []) {
  if (!userCode || typeof userCode !== 'string') {
    return { passed: false, results: [], total: testCases.length, passedCount: 0, error: 'No code provided.' };
  }

  const results = [];
  let passedCount = 0;

  try {
    const wrappedCode = `
      ${userCode}
      if (typeof solution === 'function') return solution.apply(null, args);
      if (typeof solve === 'function') return solve.apply(null, args);
      if (typeof run === 'function') return run.apply(null, args);
      
      const fns = Object.keys(this).filter(k => typeof this[k] === 'function');
      if (fns.length > 0) return this[fns[0]].apply(null, args);
      return null;
    `;

    testCases.forEach((tc, idx) => {
      try {
        const executor = new Function('args', wrappedCode);
        const actualOutput = executor(Array.isArray(tc.input) ? tc.input : [tc.input]);
        const isMatch = JSON.stringify(actualOutput) === JSON.stringify(tc.expectedOutput);

        if (isMatch) passedCount++;

        results.push({
          id: idx + 1,
          description: tc.description || `Test Case ${idx + 1}`,
          passed: isMatch,
          expected: JSON.stringify(tc.expectedOutput),
          actual: JSON.stringify(actualOutput)
        });
      } catch (err) {
        results.push({
          id: idx + 1,
          description: tc.description || `Test Case ${idx + 1}`,
          passed: false,
          expected: JSON.stringify(tc.expectedOutput),
          actual: `Runtime Error: ${err.message}`
        });
      }
    });
  } catch (err) {
    return {
      passed: false,
      results: testCases.map((tc, i) => ({
        id: i + 1,
        description: tc.description || `Test Case ${i + 1}`,
        passed: false,
        expected: JSON.stringify(tc.expectedOutput),
        actual: `Syntax Error: ${err.message}`
      })),
      total: testCases.length,
      passedCount: 0,
      error: err.message
    };
  }

  const allPassed = testCases.length > 0 && passedCount === testCases.length;
  return {
    passed: allPassed,
    results,
    total: testCases.length,
    passedCount,
    scorePercentage: testCases.length > 0 ? Math.round((passedCount / testCases.length) * 100) : 0
  };
}

/**
 * Initializes a new Technical Assessment Session via the backend.
 * Resets score to 0%, difficulty to EASY, and dynamically retrieves Question 1 via Groq.
 */
export async function startAssessmentSession(studentData) {
  const normalizedSkills = extractAndNormalizeSkills(studentData?.technicalSkills);

  if (!normalizedSkills || normalizedSkills.length === 0) {
    return {
      error: 'Please add at least one programming language, framework, database, or tool to your technical profile before taking the assessment.',
      skills: []
    };
  }

  const studentId = studentData?.uid || studentData?.studentId || (typeof window !== 'undefined' && JSON.parse(window.localStorage?.getItem('placement_genie_active_session') || '{}')?.uid) || studentData?.personalInfo?.email || 'default_student';
  const headers = await getAuthHeaders(studentId);

  try {
    const response = await fetch(`${API_BASE}/start`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        studentId,
        skills: normalizedSkills
      })
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();

    return {
      assessmentId: data.assessmentId,
      studentId,
      skills: data.skills,
      totalQuestions: data.totalQuestions || 15,
      currentQuestionNumber: data.currentQuestionNumber || 1,
      currentQuestion: data.question,
      technicalScore: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      attemptedQuestions: 0,
      isCompleted: false,
      startedAt: new Date().toISOString()
    };
  } catch (err) {
    console.error('[Assessment Service:startSession] Error:', err);
    return {
      error: `Could not start AI assessment: ${err.message}. Please verify the backend server is running and your GROQ_API_KEY is configured.`,
      skills: normalizedSkills
    };
  }
}

/**
 * Submits the student's answer to the backend for immediate validation, ML difficulty prediction,
 * and live score calculation.
 */
export async function submitQuestionAnswer(session, studentAnswer, responseTimeMs = null) {
  if (!session || !session.assessmentId) {
    throw new Error('No active assessment session.');
  }

  const headers = await getAuthHeaders(session.studentId);

  try {
    const response = await fetch(`${API_BASE}/answer`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        assessmentId: session.assessmentId,
        studentAnswer,
        responseTimeMs
      })
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `Failed to submit answer (Status ${response.status})`);
    }

    const result = await response.json();

    // Update active session object in-place
    session.technicalScore = result.score !== undefined ? result.score : (result.liveScore || 0);
    session.correctAnswers = result.correctAnswers || 0;
    session.incorrectAnswers = result.incorrectAnswers || 0;
    session.attemptedQuestions = result.attemptedQuestions || 0;
    session.isCompleted = Boolean(result.isCompleted);

    return result;
  } catch (err) {
    console.error('[Assessment Service:submitAnswer] Error:', err);
    throw err;
  }
}

/**
 * Fetches the next dynamically generated question via Groq AI based on updated ML difficulty.
 */
export async function fetchNextQuestion(session) {
  if (!session || !session.assessmentId) {
    throw new Error('No active assessment session.');
  }

  const headers = await getAuthHeaders(session.studentId);

  try {
    const response = await fetch(`${API_BASE}/next-question`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        assessmentId: session.assessmentId
      })
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || 'Unable to generate the next question. Please try again.');
    }

    const result = await response.json();
    if (result.question) {
      session.currentQuestion = result.question;
      session.currentQuestionNumber = result.questionIndex || (session.attemptedQuestions + 1);
    }
    return result;
  } catch (err) {
    console.error('[Assessment Service:fetchNextQuestion] Error:', err);
    throw err;
  }
}

/**
 * Fetches the latest completed technical assessment for the student.
 * Checks Firestore client first, then falls back to backend API.
 */
export async function fetchLatestCompletedAssessment(studentId = 'default_student') {
  // 1. Try Firebase client direct read
  const clientData = await fetchClientLatestAssessment(studentId);
  if (clientData) return clientData;

  // 2. Query backend API
  const headers = await getAuthHeaders(studentId);
  try {
    const res = await fetch(`${API_BASE}/latest?studentId=${encodeURIComponent(studentId)}`, {
      headers
    });
    if (res.ok) {
      const json = await res.json();
      if (json.found && json.assessment) {
        return json.assessment;
      }
    }
  } catch (err) {
    console.warn('[Assessment Service] Failed to fetch latest assessment from backend API:', err.message);
  }

  return null;
}
