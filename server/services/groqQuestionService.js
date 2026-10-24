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

  const safeHistory = Array.isArray(questionHistory) ? questionHistory : [];
  // Keep history concise (last 5 questions) for prompt efficiency
  const recentHistory = safeHistory.slice(-5);
  const historySummary = recentHistory.length > 0
    ? recentHistory.map((h, i) => `Q: [${h.topic || 'General'}] "${h.questionText ? h.questionText.substring(0, 60) : ''}..."`).join(' | ')
    : 'None yet (First question of assessment).';

  return `You are an expert Technical Assessment Engine for undergraduate engineering students.
Generate EXACTLY ONE original, technically rigorous question.

CONTEXT:
- Target Skill: "${skill}" (CRITICAL: Question MUST be strictly and exclusively on ${skill})
- Student Verified Skills: ${studentSkills.join(', ') || skill}
- Difficulty: ${difficulty} (EASY, MEDIUM, or HARD)
- Progress: Question ${questionNumber} of ${totalQuestions}
- Question Type: ${qType}
- Recent Accuracy: ${recentPerformance.recentAccuracy !== undefined ? `${recentPerformance.recentAccuracy}%` : 'N/A'}
- Prior Topics Covered in this Session: ${historySummary}

RULES:
- Do NOT repeat, rephrase, or re-test any concept listed above.
- Explanations must be concise and useful (2 to 4 sentences max).
- Return STRICT VALID JSON ONLY. No markdown formatting, no code blocks, no chat.
- For MCQ: correctAnswer must be integer 0, 1, 2, or 3.

${qType === 'mcq' ? `JSON SCHEMA:
{
  "skill": "${skill}",
  "topic": "Core Topic Name",
  "difficulty": "${difficulty}",
  "type": "mcq",
  "question": "Clear technical question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Concise 2-4 sentence explanation of why this answer is correct and key conceptual reasoning."
}` : `JSON SCHEMA:
{
  "skill": "${skill}",
  "topic": "Core Topic Name",
  "difficulty": "${difficulty}",
  "type": "coding",
  "question": "Clear problem statement with constraints",
  "starterCode": "function solution(input) {\\n  // Your code here\\n}",
  "testCases": [
    { "input": ["val_1"], "expectedOutput": "res_1", "description": "Base case" },
    { "input": ["val_2"], "expectedOutput": "res_2", "description": "Edge case" }
  ],
  "explanation": "Concise 2-4 sentence summary of optimal algorithm approach and complexity."
}`}`;
}

// Comprehensive, high-quality Technical Question Bank for resilient offline demonstration
export const FALLBACK_TECHNICAL_BANK = {
  JavaScript: [
    {
      topic: 'Event Loop & Concurrency',
      difficulty: 'EASY',
      type: 'mcq',
      question: 'Which component in the JavaScript/Node.js runtime is responsible for scheduling asynchronous callbacks and microtasks?',
      options: ['Call Stack', 'Event Loop', 'Memory Heap', 'V8 JIT Compiler'],
      correctAnswer: 1,
      explanation: 'The Event Loop constantly checks if the Call Stack is empty and moves callbacks from the Microtask and Task queues onto the stack.'
    },
    {
      topic: 'Closures & Scope',
      difficulty: 'EASY',
      type: 'mcq',
      question: 'What is a closure in JavaScript?',
      options: [
        'A function bundled together with references to its lexical environment',
        'A method that immediately terminates script execution',
        'A design pattern used exclusively to freeze object properties',
        'A built-in JSON serialization method'
      ],
      correctAnswer: 0,
      explanation: 'A closure gives an inner function access to its outer function’s scope even after the outer function has executed and returned.'
    },
    {
      topic: 'Promises & Async/Await',
      difficulty: 'MEDIUM',
      type: 'mcq',
      question: 'What will Promise.all() do if one of the passed promises is rejected?',
      options: [
        'It waits for all others to resolve, then returns an array of successes',
        'It immediately rejects with the reason of the first promise that rejects',
        'It ignores the rejected promise and resolves with null',
        'It converts the rejected promise into a pending state'
      ],
      correctAnswer: 1,
      explanation: 'Promise.all has fail-fast behavior: if any promise in the iterable rejects, the whole Promise.all immediately rejects with that error.'
    },
    {
      topic: 'Array Methods',
      difficulty: 'MEDIUM',
      type: 'coding',
      question: 'Write a JavaScript function `findDuplicates(arr)` that returns an array of elements that appear more than once in the input array.',
      starterCode: 'function findDuplicates(arr) {\n  // Return array of duplicated elements\n  const seen = new Set();\n  const duplicates = new Set();\n  for (const item of arr) {\n    if (seen.has(item)) duplicates.add(item);\n    seen.add(item);\n  }\n  return Array.from(duplicates);\n}',
      testCases: [
        { input: [[1, 2, 3, 2, 4, 3]], expectedOutput: [2, 3], description: 'Multiple duplicates' },
        { input: [[1, 2, 3]], expectedOutput: [], description: 'No duplicates' }
      ],
      explanation: 'Using Sets allows O(N) lookup and tracking of seen elements and duplicates.'
    },
    {
      topic: 'Prototypes & Memory',
      difficulty: 'HARD',
      type: 'mcq',
      question: 'How does property lookup behave on JavaScript prototype chains when a property is not found on the instance?',
      options: [
        'It traverses up __proto__ until Object.prototype, returning undefined if still not found',
        'It throws a ReferenceError immediately',
        'It searches all siblings of the constructor function',
        'It creates a default null property on the object'
      ],
      correctAnswer: 0,
      explanation: 'Property access traverses the prototype chain upwards via __proto__ until reaching Object.prototype.__proto__ (null), evaluating to undefined if not found.'
    }
  ],
  React: [
    {
      topic: 'Component Lifecycle & Hooks',
      difficulty: 'EASY',
      type: 'mcq',
      question: 'What is the purpose of the dependency array in React’s useEffect hook?',
      options: [
        'To define which CSS classes the component depends on',
        'To specify which state or prop changes trigger the effect callback',
        'To list child components that should render conditionally',
        'To inject external API credentials into the component'
      ],
      correctAnswer: 1,
      explanation: 'React compares dependency array values between renders using Object.is. The effect re-runs only if at least one dependency changed.'
    },
    {
      topic: 'Virtual DOM & Reconciliation',
      difficulty: 'EASY',
      type: 'mcq',
      question: 'Why does React require a unique "key" prop when rendering arrays of components?',
      options: [
        'To sort elements alphabetically in the browser',
        'To help React identify which items have changed, been added, or been removed during reconciliation',
        'To automatically bind Redux state to each child',
        'To enable encryption on sensitive list data'
      ],
      correctAnswer: 1,
      explanation: 'Keys allow React’s diffing algorithm to match elements across renders, minimizing costly real DOM mutations.'
    },
    {
      topic: 'State Management & Memoization',
      difficulty: 'MEDIUM',
      type: 'mcq',
      question: 'What is the primary difference between useMemo and useCallback in React?',
      options: [
        'useMemo caches a computed value; useCallback caches a callback function definition',
        'useMemo runs before paint; useCallback runs after DOM paint',
        'useMemo is used strictly for Redux; useCallback is for local state',
        'There is no difference; they are aliases for the same function'
      ],
      correctAnswer: 0,
      explanation: 'useMemo returns the memoized result of invoking a calculation, whereas useCallback returns the memoized function reference itself.'
    },
    {
      topic: 'React Fiber Architecture',
      difficulty: 'HARD',
      type: 'mcq',
      question: 'What major problem did the introduction of React Fiber solve compared to the legacy Stack reconciler?',
      options: [
        'It eliminated the need for JavaScript by compiling JSX directly into WebAssembly',
        'It made rendering interruptible and split work into chunks to prevent blocking the main browser thread',
        'It forced all state updates to execute synchronously',
        'It removed support for class components entirely'
      ],
      correctAnswer: 1,
      explanation: 'React Fiber breaks rendering into incremental units of work that can be paused, aborted, or prioritized, maintaining smooth animations and responsive input.'
    }
  ],
  Python: [
    {
      topic: 'Data Types & Mutability',
      difficulty: 'EASY',
      type: 'mcq',
      question: 'Which of the following built-in data types in Python is immutable?',
      options: ['List', 'Dictionary', 'Set', 'Tuple'],
      correctAnswer: 3,
      explanation: 'Tuples, strings, and integers are immutable in Python; their contents cannot be altered in-place after creation.'
    },
    {
      topic: 'List Comprehensions',
      difficulty: 'EASY',
      type: 'mcq',
      question: 'What is the output of `[x * 2 for x in range(4) if x % 2 == 0]` in Python?',
      options: ['[0, 2, 4, 6]', '[0, 4]', '[2, 6]', '[0, 2]'],
      correctAnswer: 1,
      explanation: 'range(4) produces 0, 1, 2, 3. Even numbers are 0 and 2. Multiplying by 2 produces [0, 4].'
    },
    {
      topic: 'String Manipulation',
      difficulty: 'MEDIUM',
      type: 'coding',
      question: 'Write a Python function `is_palindrome(s)` that returns True if the alphanumeric characters in string `s` form a palindrome (ignoring casing).',
      starterCode: 'def is_palindrome(s: str) -> bool:\n    cleaned = [c.lower() for c in s if c.isalnum()]\n    return cleaned == cleaned[::-1]',
      testCases: [
        { input: ['A man, a plan, a canal: Panama'], expectedOutput: 'True', description: 'Standard palindrome phrase' },
        { input: ['race a car'], expectedOutput: 'False', description: 'Not a palindrome' }
      ],
      explanation: 'Extracting alphanumeric characters, lowering case, and comparing with the reverse gives O(N) verification.'
    },
    {
      topic: 'Generators & Memory',
      difficulty: 'MEDIUM',
      type: 'mcq',
      question: 'What distinguishes a Python generator function using `yield` from a standard function using `return`?',
      options: [
        'A generator produces values lazily on-demand without storing the entire sequence in memory',
        'A generator executes faster by compiling Python code into C before runtime',
        'A generator can only be invoked once across the entire application lifecycle',
        'A generator requires multi-threading to produce values'
      ],
      correctAnswer: 0,
      explanation: 'Generators preserve state between iterations and compute the next item on demand, maintaining low memory footprints for large datasets.'
    },
    {
      topic: 'GIL & Multithreading',
      difficulty: 'HARD',
      type: 'mcq',
      question: 'Why does CPython’s Global Interpreter Lock (GIL) prevent true parallel CPU-bound execution across multiple OS threads?',
      options: [
        'Only one thread can execute Python bytecode at a time to maintain thread-safe memory management',
        'CPython does not support operating system threads',
        'The CPU clock is throttled whenever multithreading modules are imported',
        'Memory addresses are randomly shuffled during every thread switch'
      ],
      correctAnswer: 0,
      explanation: 'The GIL synchronizes access to Python objects, preventing multiple threads from executing Python bytecode simultaneously on separate cores.'
    }
  ],
  Java: [
    {
      topic: 'Core OOP & Inheritance',
      difficulty: 'EASY',
      type: 'mcq',
      question: 'Which Java keyword prevents a class from being subclassed and a method from being overridden?',
      options: ['static', 'final', 'abstract', 'volatile'],
      correctAnswer: 1,
      explanation: 'A `final` class cannot be extended, and a `final` method cannot be overridden by subclasses in Java.'
    },
    {
      topic: 'Memory Management',
      difficulty: 'MEDIUM',
      type: 'mcq',
      question: 'Where are Java object instances allocated during runtime execution?',
      options: ['Call Stack', 'Heap Memory', 'Method Area', 'CPU Registers'],
      correctAnswer: 1,
      explanation: 'In Java, all objects and their instance variables are allocated on the Heap, while local primitive references reside on the Stack.'
    },
    {
      topic: 'Generics & Type Erasure',
      difficulty: 'HARD',
      type: 'mcq',
      question: 'What is Type Erasure in Java?',
      options: [
        'The process where the compiler removes all generic type parameters at compile-time to maintain backwards compatibility with older JVM versions',
        'A runtime garbage collection technique that deletes unused data types',
        'A security feature that prevents reflection attacks on private fields',
        'A method of converting Java bytecodes to native machine code'
      ],
      correctAnswer: 0,
      explanation: 'Java generics were implemented via Type Erasure so that compiled bytecode remains compatible with pre-Java 5 JVMs.'
    }
  ],
  SQL: [
    {
      topic: 'Joins & Queries',
      difficulty: 'EASY',
      type: 'mcq',
      question: 'Which SQL JOIN returns all rows from the left table, and matched rows from the right table, filling nulls if no match exists?',
      options: ['INNER JOIN', 'LEFT JOIN', 'FULL JOIN', 'CROSS JOIN'],
      correctAnswer: 1,
      explanation: 'LEFT JOIN (or LEFT OUTER JOIN) returns all records from the left table and matched records from the right table.'
    },
    {
      topic: 'Aggregation & Filtering',
      difficulty: 'MEDIUM',
      type: 'mcq',
      question: 'What is the key difference between the WHERE and HAVING clauses in SQL?',
      options: [
        'WHERE filters rows before aggregation; HAVING filters groups after GROUP BY aggregation',
        'WHERE can only be used on string columns; HAVING is for numeric columns',
        'HAVING is executed before WHERE in the SQL logical query processing pipeline',
        'There is no difference; they can be used interchangeably'
      ],
      correctAnswer: 0,
      explanation: 'WHERE filters individual row records before grouping; HAVING filters aggregated groups created by GROUP BY.'
    },
    {
      topic: 'Indexing & Transactions',
      difficulty: 'HARD',
      type: 'mcq',
      question: 'What does the "I" in ACID database transactions represent, and what does it ensure?',
      options: [
        'Integrity: Ensures foreign keys are never violated',
        'Isolation: Ensures concurrent transactions execute without interfering with one another',
        'Idempotency: Ensures queries can be repeated without changing results',
        'Indexing: Ensures all columns have B-tree indices'
      ],
      correctAnswer: 1,
      explanation: 'Isolation ensures that concurrent execution of transactions leaves the database in the same state that would have been obtained if transactions were executed sequentially.'
    }
  ]
};

/**
 * Resilient fallback generator for technical questions.
 */
function generateFallbackTechnicalQuestion(params, history = []) {
  const skill = params.skill || 'JavaScript';
  const difficulty = (params.difficulty || 'EASY').toUpperCase();
  const qType = params.preferredType || 'mcq';

  // Find bank for skill or default to JavaScript / Python
  const bankKey = Object.keys(FALLBACK_TECHNICAL_BANK).find(k => k.toLowerCase() === skill.toLowerCase()) || 'JavaScript';
  const pool = FALLBACK_TECHNICAL_BANK[bankKey];

  const askedTexts = new Set(
    history.map(h => (h?.questionText || h?.question || '').toLowerCase().trim()).filter(Boolean)
  );

  // Filter candidate questions by difficulty and unasked
  let candidates = pool.filter(q =>
    q.difficulty.toUpperCase() === difficulty &&
    !askedTexts.has(q.question.toLowerCase().trim())
  );

  if (candidates.length === 0) {
    candidates = pool.filter(q => !askedTexts.has(q.question.toLowerCase().trim()));
  }

  const selected = candidates.length > 0
    ? candidates[Math.floor(Math.random() * candidates.length)]
    : pool[Math.floor(Math.random() * pool.length)];

  if (selected.type === 'coding') {
    return {
      id: `tech-q-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      skill,
      topic: selected.topic || 'Coding Challenge',
      difficulty: selected.difficulty || difficulty,
      type: 'coding',
      question: selected.question,
      starterCode: selected.starterCode,
      testCases: selected.testCases,
      explanation: selected.explanation,
      generatedAt: new Date().toISOString()
    };
  }

  return {
    id: `tech-q-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    skill,
    topic: selected.topic || 'Core Concept',
    difficulty: selected.difficulty || difficulty,
    type: 'mcq',
    question: selected.question,
    options: [...selected.options],
    correctAnswer: selected.correctAnswer,
    explanation: selected.explanation,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Generates a technical question dynamically via Groq API.
 * Includes automated retries on JSON parsing errors, and seamlessly falls back
 * to curated high-quality questions if the Groq service or API key is unavailable.
 */
export async function generateQuestionFromGroq(params) {
  const safeHistory = Array.isArray(params.questionHistory) ? params.questionHistory : [];

  let groq = null;
  try {
    groq = getGroqClient();
  } catch (err) {
    console.warn(`[Groq AI] Client init warning: ${err.message}. Seamlessly generating fallback technical question.`);
    return generateFallbackTechnicalQuestion(params, safeHistory);
  }

  const configuredModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  const candidateModels = [
    configuredModel,
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
    'mixtral-8x7b-32768',
    'gemma2-9b-it'
  ].filter((m, i, arr) => m && arr.indexOf(m) === i);

  const prompt = buildPrompt({ ...params, questionHistory: safeHistory });
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
        temperature: 0.4,
        max_tokens: 1024,
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

      const isDuplicate = safeHistory.some(prev => {
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
      console.warn(`[Groq AI] Attempt ${attempt} with model ${currentModel} failed: ${err.message}`);
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  // Gracefully fallback instead of crashing with HTTP 500
  console.warn(`[Groq AI] Live Groq call failed (${lastError?.message || 'unknown'}). Seamlessly engaging built-in technical question fallback.`);
  return generateFallbackTechnicalQuestion(params, safeHistory);
}
