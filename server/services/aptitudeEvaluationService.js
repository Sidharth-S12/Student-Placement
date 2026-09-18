import { APTITUDE_CATEGORIES } from './groqAptitudeService.js';

/**
 * Aptitude Assessment Evaluation & Scoring Engine
 * 
 * Rules:
 * - 20 questions = 100% total (5 marks per correct answer)
 * - Strict 20-minute (1200s) timer verification against server-recorded endTime
 * - Category performance tracking: Quantitative (5), Logical (5), Verbal (5), Technical (5)
 * - Automated diagnostic insights generation
 */

export const TOTAL_APTITUDE_QUESTIONS = 20;
export const APTITUDE_TIMER_DURATION_SECONDS = 20 * 60; // 1200 seconds (20 mins)

/**
 * Validates whether the student's assessment timer has expired.
 * Accepts either a session object { endTime } or an endTime number.
 */
export function isAssessmentTimerExpired(sessionOrEndTime) {
  const endTime = typeof sessionOrEndTime === 'number' 
    ? sessionOrEndTime 
    : sessionOrEndTime?.endTime;
  if (!endTime) return false;
  // Allow a small 5-second network transmission grace window
  return Date.now() > (endTime + 5000);
}

/**
 * Calculates remaining seconds based on server endTime.
 * Accepts either a session object { endTime } or an endTime number.
 */
export function calculateRemainingSeconds(sessionOrEndTime) {
  const endTime = typeof sessionOrEndTime === 'number'
    ? sessionOrEndTime
    : sessionOrEndTime?.endTime;
  if (!endTime) return 0;
  const diffMs = endTime - Date.now();
  return Math.max(0, Math.round(diffMs / 1000));
}

export const getRemainingSeconds = calculateRemainingSeconds;

/**
 * Initializes category score tracker
 */
export function initializeCategoryTracking() {
  return {
    'Quantitative Aptitude': { correct: 0, total: 0 },
    'Logical Reasoning': { correct: 0, total: 0 },
    'Verbal Ability': { correct: 0, total: 0 },
    'Basic Technical Aptitude': { correct: 0, total: 0 }
  };
}

/**
 * Validates student's MCQ choice against server stored question.
 */
export function evaluateAptitudeAnswer(storedQuestion, studentAnswer) {
  if (!storedQuestion) {
    throw new Error('Question not found for validation.');
  }

  const studentIdx = Number(studentAnswer);
  const correctIdx = Number(storedQuestion.correctAnswer);

  const isCorrect = !isNaN(studentIdx) && !isNaN(correctIdx) && studentIdx === correctIdx;
  return {
    isCorrect,
    correctAnswer: storedQuestion.correctAnswer,
    explanation: storedQuestion.explanation
  };
}

/**
 * Calculates current Aptitude Score %:
 * Each question = 5 marks, total = 100%.
 */
export function computeAptitudeScore(correctCount, totalQuestions = TOTAL_APTITUDE_QUESTIONS) {
  if (!totalQuestions || totalQuestions <= 0) return 0;
  const score = (correctCount / totalQuestions) * 100;
  return Math.round(score * 100) / 100;
}

/**
 * Calculates score from array of responses
 */
export function calculateAptitudeScore(responses = [], totalQuestions = TOTAL_APTITUDE_QUESTIONS) {
  const correctCount = responses.filter(r => r.isCorrect).length;
  return computeAptitudeScore(correctCount, totalQuestions);
}

/**
 * Compiles category breakdown and diagnostic placement insights upon completion.
 */
export function compileFinalAptitudeInsights(session) {
  const {
    results = [],
    responses = [],
    startedAt,
    startTime,
    completedAt = new Date().toISOString()
  } = session;

  const actualResponses = results.length > 0 ? results : responses;
  const totalAttempted = actualResponses.length;
  const correctCount = actualResponses.filter(r => r.isCorrect).length;
  const incorrectCount = totalAttempted - correctCount;
  const aptitudeScore = computeAptitudeScore(correctCount, TOTAL_APTITUDE_QUESTIONS);

  // Time taken in minutes and seconds
  const startMs = new Date(startedAt || startTime || Date.now()).getTime();
  const endMs = new Date(completedAt).getTime();
  const elapsedSeconds = Math.max(0, Math.round((endMs - startMs) / 1000));
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const elapsedSecsRemainder = elapsedSeconds % 60;
  const timeTakenFormatted = `${elapsedMinutes}m ${elapsedSecsRemainder}s`;

  // Category breakdown
  const categoryPerformance = {};
  APTITUDE_CATEGORIES.forEach(cat => {
    const catResults = actualResponses.filter(r => r.category === cat);
    const catCorrect = catResults.filter(r => r.isCorrect).length;
    const catAttempted = catResults.length;
    const catTotal = 5;

    let status = 'Needs Improvement';
    const accuracy = catTotal > 0 ? Math.round((catCorrect / catTotal) * 100) : 0;
    if (accuracy >= 80) status = 'Strong';
    else if (accuracy >= 60) status = 'Good';
    else if (accuracy >= 40) status = 'Average';

    categoryPerformance[cat] = {
      correct: catCorrect,
      attempted: catAttempted,
      total: catTotal,
      scoreText: `${catCorrect}/${catTotal}`,
      accuracy,
      status
    };
  });

  // Strengths & Areas for Improvement
  const strengths = [];
  const areasForImprovement = [];

  Object.keys(categoryPerformance).forEach(cat => {
    const perf = categoryPerformance[cat];
    if (perf.correct >= 4) {
      strengths.push(`${cat} (${perf.scoreText} correct - High accuracy)`);
    } else if (perf.correct <= 2) {
      areasForImprovement.push(`${cat} (${perf.scoreText} correct - Focus on core shortcuts and drills)`);
    }
  });

  if (strengths.length === 0) {
    strengths.push('Completed comprehensive 20-question placement aptitude evaluation under timed conditions');
  }
  if (areasForImprovement.length === 0) {
    areasForImprovement.push('Maintain speed and accuracy with timed mock aptitude practice');
  }

  let summaryFeedback = `Student achieved an Aptitude Score of ${aptitudeScore}%, answering ${correctCount} of 20 questions correctly. `;
  if (aptitudeScore >= 80) {
    summaryFeedback += 'Demonstrates exceptional analytical speed and problem-solving readiness for premier placement tests.';
  } else if (aptitudeScore >= 60) {
    summaryFeedback += 'Good baseline readiness across logical and quantitative sections with room for speed optimization.';
  } else {
    summaryFeedback += 'Requires targeted practice on fundamental quantitative shortcuts, syllogisms, and comprehension drills.';
  }

  return {
    finalScore: aptitudeScore,
    aptitudeScore,
    correctCount,
    correctAnswers: correctCount,
    incorrectAnswers: incorrectCount,
    questionsAttempted: totalAttempted,
    totalQuestions: TOTAL_APTITUDE_QUESTIONS,
    timeTakenSeconds: elapsedSeconds,
    timeTakenFormatted,
    categoryBreakdown: categoryPerformance,
    categoryPerformance,
    strengths,
    areasForImprovement,
    improvements: areasForImprovement,
    summaryFeedback
  };
}

/**
 * Convenience wrapper for compileFinalAptitudeInsights
 */
export function compileAptitudeInsights(responses = [], categoryScores = {}) {
  return compileFinalAptitudeInsights({
    responses,
    results: responses
  });
}

