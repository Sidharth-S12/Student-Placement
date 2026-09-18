import Groq from 'groq-sdk';

/**
 * Dynamic Groq AI Aptitude Question Generation Service
 * 
 * CORE RULES:
 * - 100% Dynamic runtime generation via Groq API.
 * - ZERO hardcoded question bank, ZERO static JSON, ZERO pre-stored questions.
 * - Progressive generation: Exactly 1 question generated at a time.
 * - 4 Interleaved categories:
 *   1. Quantitative Aptitude
 *   2. Logical Reasoning
 *   3. Verbal Ability
 *   4. Basic Technical Aptitude
 * - Predefined difficulty distribution: ~30% Easy, ~50% Medium, ~20% Hard.
 * - Anti-repetition: Compares against session history and lifetime past questions.
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

export const APTITUDE_CATEGORIES = [
  'Quantitative Aptitude',
  'Logical Reasoning',
  'Verbal Ability',
  'Basic Technical Aptitude'
];

/**
 * Predefined interleaved schedule for 20 questions ensuring balanced distribution:
 * - 5 Quantitative
 * - 5 Logical Reasoning
 * - 5 Verbal Ability
 * - 5 Basic Technical
 * And difficulty breakdown: 6 Easy (30%), 10 Medium (50%), 4 Hard (20%).
 */
export const APTITUDE_SCHEDULE = [
  { questionNumber: 1, category: 'Quantitative Aptitude', difficulty: 'Easy' },
  { questionNumber: 2, category: 'Logical Reasoning', difficulty: 'Easy' },
  { questionNumber: 3, category: 'Verbal Ability', difficulty: 'Medium' },
  { questionNumber: 4, category: 'Basic Technical Aptitude', difficulty: 'Medium' },
  { questionNumber: 5, category: 'Quantitative Aptitude', difficulty: 'Easy' },
  { questionNumber: 6, category: 'Logical Reasoning', difficulty: 'Easy' },
  { questionNumber: 7, category: 'Verbal Ability', difficulty: 'Medium' },
  { questionNumber: 8, category: 'Basic Technical Aptitude', difficulty: 'Medium' },
  { questionNumber: 9, category: 'Quantitative Aptitude', difficulty: 'Medium' },
  { questionNumber: 10, category: 'Logical Reasoning', difficulty: 'Medium' },
  { questionNumber: 11, category: 'Verbal Ability', difficulty: 'Easy' },
  { questionNumber: 12, category: 'Basic Technical Aptitude', difficulty: 'Hard' },
  { questionNumber: 13, category: 'Quantitative Aptitude', difficulty: 'Easy' },
  { questionNumber: 14, category: 'Logical Reasoning', difficulty: 'Medium' },
  { questionNumber: 15, category: 'Verbal Ability', difficulty: 'Medium' },
  { questionNumber: 16, category: 'Basic Technical Aptitude', difficulty: 'Hard' },
  { questionNumber: 17, category: 'Quantitative Aptitude', difficulty: 'Medium' },
  { questionNumber: 18, category: 'Logical Reasoning', difficulty: 'Medium' },
  { questionNumber: 19, category: 'Verbal Ability', difficulty: 'Hard' },
  { questionNumber: 20, category: 'Basic Technical Aptitude', difficulty: 'Hard' }
];

export function getScheduleForQuestion(questionNumber) {
  const clamped = Math.max(1, Math.min(20, questionNumber));
  return APTITUDE_SCHEDULE[clamped - 1] || APTITUDE_SCHEDULE[0];
}

const CATEGORY_TOPICS = {
  'Quantitative Aptitude': [
    'Percentages', 'Profit and Loss', 'Simple and Compound Interest', 'Ratio and Proportion',
    'Averages', 'Time and Work', 'Time, Speed and Distance', 'Number System',
    'Probability', 'Permutation and Combination', 'Data Interpretation', 'Basic Algebra', 'Ages'
  ],
  'Logical Reasoning': [
    'Number Series', 'Letter Series', 'Coding and Decoding', 'Blood Relations',
    'Direction Sense', 'Syllogisms', 'Analogies', 'Odd One Out',
    'Logical Statements', 'Seating Arrangement', 'Puzzles', 'Pattern Recognition'
  ],
  'Verbal Ability': [
    'Grammar and Sentence Correction', 'Vocabulary and Word Meanings', 'Synonyms and Antonyms',
    'Fill in the Blanks', 'Sentence Completion', 'Para Jumbles', 'Articles and Prepositions',
    'Tenses and Voice', 'Idioms and Phrases'
  ],
  'Basic Technical Aptitude': [
    'Programming Basics and Variables', 'Operators and Conditional Logic', 'Loops and Iteration',
    'Functions and Scope', 'Arrays and Basic Data Structures', 'OOP Fundamentals',
    'DBMS and SQL Basics', 'Computer Networks Basics', 'Operating Systems Basics',
    'Basic Algorithms (Searching and Sorting)'
  ]
};

/**
 * Validates the MCQ schema structure.
 */
function validateAptitudeMCQSchema(q) {
  if (!q || typeof q !== 'object') return false;
  if (!q.question || typeof q.question !== 'string' || q.question.trim().length < 10) return false;
  if (!Array.isArray(q.options) || q.options.length < 4) return false;
  if (q.options.some(opt => typeof opt !== 'string' || opt.trim().length === 0)) return false;
  if (q.correctAnswer === undefined || q.correctAnswer === null) return false;
  if (!q.explanation || typeof q.explanation !== 'string') return false;
  return true;
}

/**
 * Builds Groq prompt for dynamic aptitude question generation.
 */
function buildAptitudePrompt({
  category,
  difficulty,
  questionNumber,
  totalQuestions = 20,
  questionHistory = []
}) {
  const topicsList = CATEGORY_TOPICS[category] || CATEGORY_TOPICS['Quantitative Aptitude'];
  const suggestedTopic = topicsList[(questionNumber * 7) % topicsList.length];

  const historySummary = questionHistory.length > 0
    ? questionHistory.slice(-15).map((h, i) => `Past Q${i + 1} (${h.category || h.skill}): [${h.topic || 'General'}] "${h.questionText ? h.questionText.substring(0, 75) : ''}..."`).join('\n')
    : 'None yet (First question of assessment).';

  return `You are an expert Campus Placement Aptitude Test Creation Engine for graduating engineering students.
Your task is to dynamically generate EXACTLY ONE original, high-quality, placement-oriented multiple choice question (MCQ).

TEST SPECIFICATIONS:
- TARGET CATEGORY: "${category}" (CRITICAL: Question MUST belong strictly to this category)
- SUGGESTED TOPIC AREA: ${suggestedTopic} (or another standard topic in ${category})
- DIFFICULTY LEVEL: ${difficulty} (Easy, Medium, or Hard)
- QUESTION PROGRESS: Question ${questionNumber} of ${totalQuestions}
- QUESTION TYPE: MCQ with exactly 4 options (Option A, Option B, Option C, Option D)

PREVIOUSLY ASKED QUESTIONS TO THIS STUDENT (DO NOT REPEAT OR PARAPHRASE ANY OF THESE TOPICS OR NUMBERS):
${historySummary}

STRICT QUALITY RULES:
1. Question MUST be clear, unambiguous, and mathematically/logically precise.
2. For Quantitative & Logical questions, show realistic numbers suitable for mental calculation or scratch work.
3. For Basic Technical questions, focus on broad conceptual understanding (data types, loops, OOP, DBMS, OS, networking) without requiring knowledge of a specific esoteric language.
4. For Verbal questions, test standard placement English grammar, error spotting, or vocabulary.
5. Provide 4 plausible options where exactly one is definitively correct.

STRICT JSON OUTPUT FORMAT:
- Return STRICT VALID JSON ONLY.
- Absolutely NO markdown code block wrappers (\`\`\`json or \`\`\`), NO introductory text, NO postscript text.
- "correctAnswer" must be the 0-indexed number (0, 1, 2, or 3) of the correct choice in the "options" array.

JSON SCHEMA:
{
  "category": "${category}",
  "topic": "Specific Topic Name",
  "difficulty": "${difficulty}",
  "type": "mcq",
  "question": "Clear question text here",
  "options": [
    "Option text 0",
    "Option text 1",
    "Option text 2",
    "Option text 3"
  ],
  "correctAnswer": 0,
  "explanation": "Clear step-by-step solution and explanation of why this answer is correct"
}`;
}

/**
 * Dynamically generates 1 Aptitude Question from Groq API at runtime.
 */
export async function generateAptitudeQuestionFromGroq(params) {
  const groq = getGroqClient();
  const candidateModels = [
    process.env.GROQ_MODEL,
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'qwen/qwen3.8-27b',
    'groq/compound'
  ].filter(Boolean);

  const history = Array.isArray(params.questionHistory)
    ? params.questionHistory
    : Array.isArray(params.pastQuestions)
      ? params.pastQuestions
      : [];

  const prompt = buildAptitudePrompt({
    ...params,
    questionHistory: history
  });
  const maxAttempts = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const currentModel = candidateModels[(attempt - 1) % candidateModels.length];
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an educational aptitude assessment engine that strictly outputs RFC 8259 compliant JSON and nothing else.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: currentModel,
        temperature: 0.6,
        response_format: { type: 'json_object' }
      });

      const rawResponse = chatCompletion.choices[0]?.message?.content;
      if (!rawResponse) {
        throw new Error('Groq returned an empty response.');
      }

      let parsed;
      try {
        parsed = JSON.parse(rawResponse.trim());
      } catch (jsonErr) {
        const cleaned = rawResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleaned);
      }

      parsed.category = params.category;
      parsed.difficulty = params.difficulty;
      parsed.type = 'mcq';

      if (!validateAptitudeMCQSchema(parsed)) {
        throw new Error('Groq response failed Aptitude MCQ schema validation.');
      }

      // Normalize correctAnswer to numeric index
      if (typeof parsed.correctAnswer === 'string') {
        const matchedIdx = parsed.options.findIndex(
          opt => opt.toLowerCase().trim() === parsed.correctAnswer.toLowerCase().trim()
        );
        if (matchedIdx !== -1) {
          parsed.correctAnswer = matchedIdx;
        } else {
          const num = parseInt(parsed.correctAnswer, 10);
          parsed.correctAnswer = !isNaN(num) ? num : 0;
        }
      }

      // Check for repetition against student's lifetime question history
      const currentQText = (parsed.question || '').toLowerCase().trim();
      const isDuplicate = history.some(prev => {
        const prevQText = (typeof prev === 'string' ? prev : prev?.questionText || prev?.question || '').toLowerCase().trim();
        if (!prevQText || !currentQText) return false;
        if (prevQText === currentQText) return true;
        if (prevQText.length > 25 && currentQText.includes(prevQText)) return true;
        if (currentQText.length > 25 && prevQText.includes(currentQText)) return true;
        return false;
      });

      if (isDuplicate) {
        console.warn(`[Groq Aptitude AI] Attempt ${attempt}: Question duplicate detected. Retrying with fresh seed...`);
        continue;
      }

      parsed.id = `groq-apt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      parsed.generatedAt = new Date().toISOString();

      return parsed;
    } catch (err) {
      lastError = err;
      console.warn(`[Groq Aptitude AI] Attempt ${attempt} failed: ${err.message}`);
      if (attempt < maxAttempts) {
        await new Promise(res => setTimeout(res, 600));
      }
    }
  }

  throw new Error(`Failed to generate dynamic aptitude question via Groq after ${maxAttempts} attempts: ${lastError?.message || 'Unknown error'}`);
}
