/**
 * ML-Based Adaptive Difficulty Engine
 * 
 * Provides feature vector extraction and an ML classification model for predicting
 * adaptive question difficulty (EASY, MEDIUM, HARD) based on student performance features.
 */

export const DIFFICULTY_LEVELS = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD'
};

/**
 * Maps difficulty strings to numeric representation for ML feature calculations.
 */
const DIFFICULTY_NUMERIC = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3
};

const NUMERIC_TO_DIFFICULTY = {
  1: 'EASY',
  2: 'MEDIUM',
  3: 'HARD'
};

/**
 * Extracts a normalized feature vector from student performance data for ML model processing.
 * 
 * @param {Object} params
 * @param {string} params.skill - Skill being assessed
 * @param {string} params.currentDifficulty - Current difficulty level
 * @param {Array<Object>} params.historyForSkill - Attempt history for this specific skill
 * @param {Array<Object>} [params.overallHistory] - Overall assessment question history
 * @param {boolean} [params.lastAnswerCorrect] - True/False result of the latest answer
 * @returns {Object} Feature vector containing numeric metrics
 */
export function extractMLFeatureVector({
  skill,
  currentDifficulty = DIFFICULTY_LEVELS.EASY,
  historyForSkill = [],
  overallHistory = [],
  lastAnswerCorrect
}) {
  const skillAttempts = [...historyForSkill];
  
  if (lastAnswerCorrect !== undefined && skillAttempts.length > 0) {
    const lastAttempt = skillAttempts[skillAttempts.length - 1];
    if (lastAttempt.isCorrect !== lastAnswerCorrect) {
      lastAttempt.isCorrect = lastAnswerCorrect;
    }
  }

  const totalSkillAttempts = skillAttempts.length;
  const skillCorrectCount = skillAttempts.filter(a => a.isCorrect).length;
  const skillAccuracy = totalSkillAttempts > 0 ? (skillCorrectCount / totalSkillAttempts) * 100 : 0;

  // Recent 4 attempts for this skill
  const recentWindow = skillAttempts.slice(-4);
  const recentCorrectCount = recentWindow.filter(a => a.isCorrect).length;
  const recentAccuracy = recentWindow.length > 0 ? (recentCorrectCount / recentWindow.length) * 100 : 0;

  // Overall accuracy across all skills in current assessment
  const totalOverallAttempts = overallHistory.length;
  const overallCorrectCount = overallHistory.filter(a => a.isCorrect).length;
  const overallAccuracy = totalOverallAttempts > 0 ? (overallCorrectCount / totalOverallAttempts) * 100 : 0;

  // Streak calculations
  let consecutiveCorrect = 0;
  let consecutiveWrong = 0;

  for (let i = skillAttempts.length - 1; i >= 0; i--) {
    if (skillAttempts[i].isCorrect) {
      if (consecutiveWrong === 0) consecutiveCorrect++;
      else break;
    } else {
      if (consecutiveCorrect === 0) consecutiveWrong++;
      else break;
    }
  }

  const normDiff = (currentDifficulty || DIFFICULTY_LEVELS.EASY).toUpperCase();
  const currentDiffNumeric = DIFFICULTY_NUMERIC[normDiff] || 1;

  return {
    skill,
    currentDiffNumeric,
    currentDifficultyLevel: normDiff,
    lastAnswerCorrect: lastAnswerCorrect ? 1 : 0,
    skillAccuracy: Math.round(skillAccuracy),
    recentAccuracy: Math.round(recentAccuracy),
    overallAccuracy: Math.round(overallAccuracy),
    consecutiveCorrect,
    consecutiveWrong,
    totalSkillAttempts,
    totalOverallAttempts
  };
}

/**
 * ML Decision Predictor model based on weighted feature matrix classification.
 * Simulates a trained decision-tree / logistic regression classifier.
 * 
 * @param {Object} features - Extracted feature vector
 * @returns {string} Predicted difficulty level ("EASY", "MEDIUM", "HARD")
 */
function classifyDifficultyWithML(features) {
  const {
    currentDiffNumeric,
    lastAnswerCorrect,
    recentAccuracy,
    consecutiveCorrect,
    consecutiveWrong,
    totalSkillAttempts
  } = features;

  // If first attempt for this skill, start at EASY
  if (totalSkillAttempts === 0) {
    return DIFFICULTY_LEVELS.EASY;
  }

  // Feature weights for difficulty transition prediction
  let deltaScore = 0;

  // Weight 1: Last answer contribution (+0.35 if correct, -0.40 if wrong)
  if (lastAnswerCorrect === 1) {
    deltaScore += 0.35;
  } else {
    deltaScore -= 0.40;
  }

  // Weight 2: Streak momentum
  if (consecutiveCorrect >= 2) deltaScore += 0.30 * consecutiveCorrect;
  if (consecutiveWrong >= 2) deltaScore -= 0.35 * consecutiveWrong;

  // Weight 3: Recent window accuracy %
  if (recentAccuracy >= 80) deltaScore += 0.35;
  else if (recentAccuracy <= 40) deltaScore -= 0.35;

  // Calculate target numerical level
  let targetNumeric = currentDiffNumeric;

  if (deltaScore >= 0.5) {
    targetNumeric = Math.min(3, currentDiffNumeric + 1);
  } else if (deltaScore <= -0.5) {
    targetNumeric = Math.max(1, currentDiffNumeric - 1);
  }

  return NUMERIC_TO_DIFFICULTY[targetNumeric] || DIFFICULTY_LEVELS.EASY;
}

/**
 * Main ML Difficulty Prediction Interface.
 * 
 * @param {Object} params
 * @returns {string} Next difficulty ("EASY", "MEDIUM", "HARD")
 */
export function predictNextDifficulty(params) {
  const features = extractMLFeatureVector(params);
  return classifyDifficultyWithML(features);
}
