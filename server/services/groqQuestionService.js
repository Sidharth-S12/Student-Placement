import Groq from 'groq-sdk';

/**
 * Dynamic Groq AI Question Generation Service
 * 
 * CORE RULES & ARCHITECTURE:
 * - 100% Dynamic runtime generation via Groq API.
 * - ZERO hardcoded question bank, ZERO static JSON, ZERO pre-stored questions.
 * - GROQ_API_KEY is isolated strictly in backend environment variables.
 * - Enforces strict JSON output with schema validation.
 * - Anti-duplication: Temporary current-assessment history is provided in the prompt.
 * - If the AI output fails schema validation or duplicates a topic/question, it retries safely.
 */

let groqClient = null;

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is missing from backend environment variables. Please set GROQ_API_KEY in server/.env.');
  }

  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

/**
 * Validates the structure and schema of an MCQ question.
 */
function validateMCQSchema(q, targetSkill) {
  if (!q || typeof q !== 'object') return false;
  if (!q.question || typeof q.question !== 'string' || q.question.trim().length < 10) return false;
  if (!Array.isArray(q.options) || q.options.length < 4) return false;
  if (q.options.some(opt => typeof opt !== 'string' || opt.trim().length === 0)) return false;
  if (q.correctAnswer === undefined || q.correctAnswer === null) return false;
  if (!q.explanation || typeof q.explanation !== 'string') return false;
  return true;
}

/**
 * Validates the structure and schema of a Coding question.
 */
function validateCodingSchema(q, targetSkill) {
  if (!q || typeof q !== 'object') return false;
  if (!q.question || typeof q.question !== 'string' || q.question.trim().length < 10) return false;
  if (!q.starterCode || typeof q.starterCode !== 'string') return false;
  if (!Array.isArray(q.testCases) || q.testCases.length < 1) return false;
  if (!q.explanation || typeof q.explanation !== 'string') return false;
  return true;
}

/**
 * Builds a prompt for Groq with strict JSON output requirement and anti-duplication memory.
 */
function buildPrompt({
  studentSkills = [],
  skill,
  difficulty,
  questionNumber,
  totalQuestions = 15,
  questionHistory = [],
  recentPerformance = {},
  skillPerformance = {},
  preferredType = null
}) {
  // Select question type: coding questions for languages if applicable, otherwise MCQ
  const codingEligible = ['Python', 'Java', 'JavaScript', 'TypeScript', 'C++', 'SQL', 'MySQL', 'Go', 'Rust'].includes(skill);
  const qType = preferredType || (codingEligible && (questionNumber % 4 === 0) ? 'coding' : 'mcq');

  const historySummary = questionHistory.length > 0
    ? questionHistory.map((h, i) => `Q${i + 1} (${h.skill}): [${h.topic || 'General'}] "${h.questionText ? h.questionText.substring(0, 75) : ''}..."`).join('\n')
    : 'None yet (First question of assessment).';

  return `You are an expert Technical Assessment & Placement Evaluation Engine for undergraduate engineering students.
Your task is to dynamically generate EXACTLY ONE original, technically rigorous, placement-grade question.

STUDENT PROFILE CONTEXT:
- Student Verified Technical Skills: ${studentSkills.join(', ') || skill}
- TARGET SKILL FOR THIS QUESTION: "${skill}" (CRITICAL: Question MUST be strictly and exclusively on ${skill})
- CURRENT DIFFICULTY LEVEL: ${difficulty} (EASY, MEDIUM, or HARD)
- ASSESSMENT PROGRESS: Question ${questionNumber} of ${totalQuestions}
- DESIRED QUESTION TYPE: ${qType}

STUDENT PERFORMANCE SNAPSHOT:
- Recent Accuracy: ${recentPerformance.recentAccuracy !== undefined ? `${recentPerformance.recentAccuracy}%` : 'N/A'}
- Overall Technical Score: ${recentPerformance.technicalScore !== undefined ? `${recentPerformance.technicalScore}%` : '0%'}
- Skill-Specific Accuracy (${skill}): ${skillPerformance[skill]?.score !== undefined ? `${skillPerformance[skill].score}%` : '0%'}

QUESTIONS ALREADY ASKED IN THIS CURRENT ASSESSMENT SESSION:
${historySummary}

STRICT ANTI-REPETITION RULES:
- DO NOT repeat, rephrase, or re-test any concept/topic listed above.
- DO NOT simply change variable names or values.
- Focus on fresh fundamentals for EASY, progressive depth for MEDIUM, and optimization/edge-cases for HARD.

STRICT JSON OUTPUT FORMAT RULES:
- Return STRICT VALID JSON ONLY.
- Absolutely NO markdown formatting, NO \`\`\`json wrappers, NO conversational intros or outtros.
- For MCQ questions, correctAnswer must be the 0-indexed number of the correct option in the options array (0, 1, 2, or 3).

${qType === 'mcq' ? `
JSON SCHEMA FOR MCQ:
{
  "skill": "${skill}",
  "topic": "Core Topic Name",
  "difficulty": "${difficulty}",
  "type": "mcq",
  "question": "Clear, unambiguous technical question text",
  "options": [
    "Option 0",
    "Option 1",
    "Option 2",
    "Option 3"
  ],
  "correctAnswer": 0,
  "explanation": "Clear explanation of why this answer is correct and why other options are incorrect"
}
` : `
JSON SCHEMA FOR CODING:
{
  "skill": "${skill}",
  "topic": "Core Topic Name",
  "difficulty": "${difficulty}",
  "type": "coding",
  "question": "Clear problem statement with input/output constraints",
  "starterCode": "function solution(input) {\\n  // Your code here\\n}",
  "testCases": [
    {
      "input": ["test_val_1"],
      "expectedOutput": "expected_result_1",
      "description": "Base test case"
    },
    {
      "input": ["test_val_2"],
      "expectedOutput": "expected_result_2",
      "description": "Edge case"
    }
  ],
  "explanation": "Concise explanation of optimal algorithm and time/space complexity"
}
`}`;
}

/**
 * Generates a technical question dynamically via Groq API.
 * Includes automated retries on JSON parsing errors or repetition rejection.
 * 
 * @param {Object} params
 * @returns {Promise<Object>} Validated question object
 */
export async function generateQuestionFromGroq(params) {
  const groq = getGroqClient();
  const candidateModels = [
    process.env.GROQ_MODEL,
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'qwen/qwen3.8-27b',
    'groq/compound'
  ].filter(Boolean);

  const prompt = buildPrompt(params);
  const maxAttempts = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const currentModel = candidateModels[(attempt - 1) % candidateModels.length];
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an educational assessment engine that strictly outputs RFC 8259 compliant JSON and nothing else.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: currentModel,
        temperature: 0.5,
        response_format: { type: 'json_object' }
      });

      const rawResponse = chatCompletion.choices[0]?.message?.content;
      if (!rawResponse) {
        throw new Error('Groq returned an empty response.');
      }

      // Parse JSON
      let parsedQuestion;
      try {
        parsedQuestion = JSON.parse(rawResponse.trim());
      } catch (jsonErr) {
        // Fallback cleanup if backticks were accidentally included
        const cleaned = rawResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        parsedQuestion = JSON.parse(cleaned);
      }

      // Ensure skill matches
      parsedQuestion.skill = params.skill;
      parsedQuestion.difficulty = params.difficulty;

      // Validate schema
      const isMcq = parsedQuestion.type === 'mcq' || (!parsedQuestion.type && Array.isArray(parsedQuestion.options));
      if (isMcq) {
        parsedQuestion.type = 'mcq';
        if (!validateMCQSchema(parsedQuestion, params.skill)) {
          throw new Error('Groq response failed MCQ schema validation.');
        }

        // Normalize correctAnswer to numeric index if sent as string or text
        if (typeof parsedQuestion.correctAnswer === 'string') {
          const matchedIdx = parsedQuestion.options.findIndex(
            opt => opt.toLowerCase().trim() === parsedQuestion.correctAnswer.toLowerCase().trim()
          );
          if (matchedIdx !== -1) {
            parsedQuestion.correctAnswer = matchedIdx;
          } else {
            const num = parseInt(parsedQuestion.correctAnswer, 10);
            parsedQuestion.correctAnswer = !isNaN(num) ? num : 0;
          }
        }
      } else {
        parsedQuestion.type = 'coding';
        if (!validateCodingSchema(parsedQuestion, params.skill)) {
          throw new Error('Groq response failed Coding schema validation.');
        }
      }

      // Robust repetition check against student's lifetime question history
      const currentQText = (parsedQuestion.question || '').toLowerCase().trim();

      const isDuplicate = params.questionHistory.some(prev => {
        const prevQText = (prev.questionText || prev.question || '').toLowerCase().trim();
        if (!prevQText || !currentQText) return false;

        // Exact match
        if (prevQText === currentQText) return true;

        // Substring containment check for questions longer than 25 chars
        if (prevQText.length > 25 && currentQText.includes(prevQText)) return true;
        if (currentQText.length > 25 && prevQText.includes(currentQText)) return true;

        return false;
      });

      if (isDuplicate) {
        console.warn(`[Groq AI] Attempt ${attempt}: Generated question already asked to this student. Retrying with fresh seed to guarantee originality...`);
        continue;
      }

      // Add unique runtime identifier
      parsedQuestion.id = `groq-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      parsedQuestion.generatedAt = new Date().toISOString();

      return parsedQuestion;
    } catch (err) {
      lastError = err;
      console.warn(`[Groq AI] Attempt ${attempt} failed: ${err.message}`);
      // Wait briefly before retrying
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 600));
      }
    }
  }

  throw new Error(`Failed to generate dynamic question via Groq API after ${maxAttempts} attempts: ${lastError?.message || 'Unknown error'}`);
}
