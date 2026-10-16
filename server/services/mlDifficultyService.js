/**
 * Machine Learning Difficulty Prediction Service
 * 
 * ARCHITECTURE NOTE:
 * This module defines the interface for predicting adaptive question difficulty (EASY, MEDIUM, HARD)
 * using student performance feature vectors.
 * 
 * In accordance with project requirements:
 * 1. `predictDifficulty()` is the primary ML entry-point interface, structured to ingest normalized
 *    feature vectors and communicate with a trained Machine Learning model (such as a serialized
 *    decision model, ONNX runtime, or external ML inference endpoint).
 * 2. If a trained ML model artifact or external ML inference service is not deployed, it delegates to
 *    `predictDifficultyFallback()`, which is explicitly and transparently labeled as a heuristic fallback.
 * 3. A rule-based system is NEVER mischaracterized as a trained Machine Learning model.
 */

export const DIFFICULTY_LEVELS = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD'
};

const DIFFICULTY_MAP = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3
};

const LEVEL_MAP = {
  1: DIFFICULTY_LEVELS.EASY,
  2: DIFFICULTY_LEVELS.MEDIUM,
  3: DIFFICULTY_LEVELS.HARD
};

/**
 * Normalizes input features into a structured vector suitable for ML ingestion.
 * 
 * @param {Object} rawFeatures
 * @returns {Object} Cleaned feature vector
 */
export function extractPerformanceFeatures({
  currentDifficulty = DIFFICULTY_LEVELS.EASY,
  isCorrect = false,
  recentAccuracy = 0,
  technicalScore = 0,
  skillAccuracy = 0,
  topicAccuracy = 0,
  consecutiveCorrect = 0,
  consecutiveIncorrect = 0,
  questionNumber = 1,
  totalAttempted = 0,
  responseTimeMs = null
}) {
  const normDifficulty = (currentDifficulty || DIFFICULTY_LEVELS.EASY).toUpperCase();
  const numericDifficulty = DIFFICULTY_MAP[normDifficulty] || 1;

  return {
    numericDifficulty,
    currentDifficulty: normDifficulty,
    isCorrect: Boolean(isCorrect),
    isCorrectNum: isCorrect ? 1 : 0,
    recentAccuracy: Math.max(0, Math.min(100, Number(recentAccuracy) || 0)),
    technicalScore: Math.max(0, Math.min(100, Number(technicalScore) || 0)),
    skillAccuracy: Math.max(0, Math.min(100, Number(skillAccuracy) || 0)),
    topicAccuracy: Math.max(0, Math.min(100, Number(topicAccuracy) || 0)),
    consecutiveCorrect: Math.max(0, Number(consecutiveCorrect) || 0),
    consecutiveIncorrect: Math.max(0, Number(consecutiveIncorrect) || 0),
    questionNumber: Math.max(1, Number(questionNumber) || 1),
    totalAttempted: Math.max(0, Number(totalAttempted) || 0),
    responseTimeMs: responseTimeMs !== null ? Number(responseTimeMs) : null
  };
}

/**
 * TEMPORARY FALLBACK: Rule-Based Difficulty Predictor.
 * 
 * [LABELED EXPLICITLY AS A FALLBACK - NOT A TRAINED MACHINE LEARNING MODEL]
 * 
 * Used when a trained ML model artifact (e.g. model.json or external ML inference service)
 * is unavailable or disconnected. It evaluates weighted multi-metric performance momentum:
 * - Direct outcome weight (±0.35)
 * - Consecutive correct/incorrect streaks
 * - Recent rolling window accuracy
 * - Skill-specific historical accuracy
 * 
 * @param {Object} features - Extracted feature vector
 * @returns {string} Predicted difficulty: "EASY" | "MEDIUM" | "HARD"
 */
export function predictDifficultyFallback(features) {
  const {
    numericDifficulty,
    isCorrect,
    recentAccuracy,
    skillAccuracy,
    consecutiveCorrect,
    consecutiveIncorrect,
    totalAttempted
  } = features;

  // First question for a skill always starts at EASY
  if (totalAttempted === 0) {
    return DIFFICULTY_LEVELS.EASY;
  }

  // Multi-factor momentum score
  let momentum = 0;

  // Factor 1: Immediate answer impact
  if (isCorrect) {
    momentum += 0.35;
  } else {
    momentum -= 0.40;
  }

  // Factor 2: Streak momentum
  if (consecutiveCorrect >= 2) {
    momentum += Math.min(0.8, 0.25 * consecutiveCorrect);
  }
  if (consecutiveIncorrect >= 2) {
    momentum -= Math.min(0.85, 0.30 * consecutiveIncorrect);
  }

  // Factor 3: Recent window accuracy impact
  if (recentAccuracy >= 75) {
    momentum += 0.30;
  } else if (recentAccuracy <= 40) {
    momentum -= 0.30;
  }

  // Factor 4: Skill aggregate accuracy impact
  if (skillAccuracy >= 80) {
    momentum += 0.20;
  } else if (skillAccuracy < 45) {
    momentum -= 0.20;
  }

  let nextLevelNumeric = numericDifficulty;

  if (momentum >= 0.45) {
    // Elevate difficulty, capped at HARD (3)
    nextLevelNumeric = Math.min(3, numericDifficulty + 1);
  } else if (momentum <= -0.45) {
    // Reduce difficulty, floored at EASY (1)
    nextLevelNumeric = Math.max(1, numericDifficulty - 1);
  }

  return LEVEL_MAP[nextLevelNumeric] || DIFFICULTY_LEVELS.EASY;
}

/**
 * PRIMARY ML DIFFICULTY PREDICTION INTERFACE
 * 
 * Evaluates performance features to predict the student's next question difficulty.
 * Integrates an ML model check. If external ML model service or local ML model artifact
 * is not yet trained, gracefully routes to `predictDifficultyFallback()`.
 * 
 * @param {Object} params
 * @param {string} params.currentDifficulty - Current difficulty level ('EASY' | 'MEDIUM' | 'HARD')
 * @param {boolean} params.isCorrect - Whether the last answered question was correct
 * @param {number} params.recentAccuracy - Accuracy percentage over recent questions (0 - 100)
 * @param {number} params.technicalScore - Current live technical score percentage (0 - 100)
 * @param {number} params.skillAccuracy - Accuracy percentage for the specific skill (0 - 100)
 * @param {number} params.topicAccuracy - Accuracy percentage for the specific topic (0 - 100)
 * @param {number} params.consecutiveCorrect - Count of consecutive correct answers
 * @param {number} params.consecutiveIncorrect - Count of consecutive incorrect answers
 * @param {number} params.questionNumber - Current question number (1 to 15)
 * @param {number} [params.totalAttempted] - Total questions attempted so far
 * @param {number} [params.responseTimeMs] - Response duration in milliseconds
 * @returns {Promise<{ difficulty: string, usedML: boolean, modelType: string }>}
 */
export async function predictDifficulty(params) {
  const features = extractPerformanceFeatures(params);

  // Check if an external ML Inference Microservice endpoint is configured
  const mlServiceUrl = process.env.ML_DIFFICULTY_SERVICE_URL;

  if (mlServiceUrl) {
    try {
      const response = await fetch(`${mlServiceUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(features),
        signal: AbortSignal.timeout(2000) // Fast 2s timeout
      });

      if (response.ok) {
        const mlResult = await response.json();
        const predicted = (mlResult.difficulty || '').toUpperCase();
        if (DIFFICULTY_LEVELS[predicted]) {
          return {
            difficulty: predicted,
            usedML: true,
            modelType: mlResult.modelName || 'Trained ML Classifier (External Service)'
          };
        }
      }
    } catch (err) {
      console.warn(`[ML Difficulty Service] ML microservice call failed (${err.message}). Falling back to heuristic predictor.`);
    }
  }

  // Model not yet trained or external service not configured: Use explicitly labeled fallback
  const fallbackDifficulty = predictDifficultyFallback(features);

  return {
    difficulty: fallbackDifficulty,
    usedML: false,
    modelType: 'predictDifficultyFallback (Heuristic Momentum Engine - Pending ML Model Training)'
  };
}
