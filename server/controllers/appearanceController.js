import { analyzeDressAttire } from '../services/visionAppearanceService.js';
import { verifyAuthToken } from '../config/firebaseAdmin.js';

/**
 * Controller for AI Professional Appearance & Dress Analysis
 */

export async function analyzeAppearance(req, res) {
  try {
    // 1. Authenticate user
    const user = await verifyAuthToken(req);
    const studentId = user?.uid || req.body.studentId || 'default_student';

    const { image, imageDataUrl, interviewContext = 'formal' } = req.body;
    const targetDataUrl = imageDataUrl || image;

    if (!targetDataUrl) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a photo from your device for analysis.'
      });
    }

    const validContexts = ['formal', 'business_casual', 'online'];
    if (!validContexts.includes(interviewContext)) {
      return res.status(400).json({
        success: false,
        error: `Invalid interview context '${interviewContext}'. Allowed values: formal, business_casual, online.`
      });
    }

    // 2. Perform dress attire analysis
    const result = await analyzeDressAttire({
      imageDataUrl: targetDataUrl,
      interviewContext
    });

    return res.status(200).json({
      ...result,
      studentId,
      analyzedAt: new Date().toISOString()
    });

  } catch (err) {
    console.error('[AppearanceController Error]', err.message);
    return res.status(400).json({
      success: false,
      error: err.message || 'Failed to analyze professional attire.'
    });
  }
}

/**
 * Endpoint to check vision service status
 */
export async function getAppearanceStatus(req, res) {
  const hasGroq = Boolean(process.env.GROQ_API_KEY);
  const hasGemini = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

  return res.status(200).json({
    status: 'online',
    service: 'AI Professional Appearance Analyzer',
    providersConfigured: {
      groqVision: hasGroq,
      geminiVision: hasGemini,
      openaiVision: hasOpenAI
    },
    activeVisionConfigured: hasGroq || hasGemini || hasOpenAI
  });
}
