import Groq from 'groq-sdk';

/**
 * Dynamic Groq AI Communication & Placement Interview Assessment Service
 * 
 * CORE FEATURES:
 * - 7 Core Company Placement Interview Questions covering the exact questions top tech & corporate companies ask:
 *   1. Self-Introduction & Elevator Pitch ("Tell me about yourself")
 *   2. Technical Project & STAR Problem Solving ("Walk me through your most challenging project")
 *   3. Technical Strengths & Self-Awareness ("Greatest strength & genuine weakness")
 *   4. Team Collaboration & Conflict Resolution ("Handling disagreements with teammates/leads")
 *   5. High-Pressure Deadlines & Adaptability ("Unfamiliar tech and tight delivery crisis")
 *   6. Company Fit & 3-5 Year Career Vision ("Why our company & future growth")
 *   7. Questions for the Interview Panel ("What questions do you have for us?")
 * - 100% Dynamic Groq AI generation with resilient built-in placement question bank.
 * - Open-ended voice/text interview practice evaluation service with STAR coaching.
 */

let groqClient = null;

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is missing from backend environment variables.');
  }

  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

export const COMMUNICATION_CATEGORIES = [
  'Self-Introduction & Elevator Pitch',
  'Project Deep-Dive & STAR Problem Solving',
  'Technical Strengths & Self-Awareness',
  'Team Collaboration & Conflict Resolution',
  'Pressure, Deadlines & Adaptability',
  'Company Fit & 3-5 Year Career Vision',
  'Questions for the Interview Panel'
];

export const COMMUNICATION_SCHEDULE = [
  { questionNumber: 1, category: 'Self-Introduction & Elevator Pitch', difficulty: 'Easy' },
  { questionNumber: 2, category: 'Project Deep-Dive & STAR Problem Solving', difficulty: 'Medium' },
  { questionNumber: 3, category: 'Technical Strengths & Self-Awareness', difficulty: 'Medium' },
  { questionNumber: 4, category: 'Team Collaboration & Conflict Resolution', difficulty: 'Medium' },
  { questionNumber: 5, category: 'Pressure, Deadlines & Adaptability', difficulty: 'Hard' },
  { questionNumber: 6, category: 'Company Fit & 3-5 Year Career Vision', difficulty: 'Medium' },
  { questionNumber: 7, category: 'Questions for the Interview Panel', difficulty: 'Easy' }
];

export const CATEGORY_TOPICS = {
  'Self-Introduction & Elevator Pitch': [
    'Tell Me About Yourself', '60-90 Second Professional Elevator Pitch', 'Highlighting Tech Passion & Degree', 'Hooking the Interviewer'
  ],
  'Project Deep-Dive & STAR Problem Solving': [
    'STAR Method Structuring', 'Overcoming Architectural Bottlenecks', 'Quantifying Project Impact & Metrics', 'Technical Problem Solving'
  ],
  'Technical Strengths & Self-Awareness': [
    'Answering Greatest Weakness Without Cliches', 'Articulating Core Technical Strengths', 'Continuous Learning & Growth Mindset', 'Receiving Constructive Critique'
  ],
  'Team Collaboration & Conflict Resolution': [
    'Disagreements in Code Reviews or Architecture', 'Cross-functional Collaboration', 'De-escalating Team Friction', 'Active Listening & Compromise'
  ],
  'Pressure, Deadlines & Adaptability': [
    'Learning Unfamiliar Tech Under Tight Deadlines', 'Production Bug Crisis Management', 'Prioritizing Competing Deliverables', 'Stakeholder Expectation Management'
  ],
  'Company Fit & 3-5 Year Career Vision': [
    'Why Do You Want to Join Our Company', 'Where Do You See Yourself in 3-5 Years', 'Cultural Alignment & Values', 'Long-term Professional Aspirations'
  ],
  'Questions for the Interview Panel': [
    'Reverse Interviewing Strategy', 'Asking Meaningful Engineering Culture Questions', 'Inquiring About Team Mentorship & Tech Stack', 'Closing the Interview on a High Note'
  ]
};

// High-Quality Fallback Interview Questions for all 7 standard company rounds
export const FALLBACK_COMMUNICATION_QUESTIONS = [
  {
    category: 'Self-Introduction & Elevator Pitch',
    topic: 'Tell Me About Yourself',
    difficulty: 'Easy',
    interviewerContext: 'Opening round: The hiring manager invites you to introduce your technical profile.',
    question: 'The interviewer opens the campus interview by asking: "Tell me about yourself, your background in computer science/engineering, and what projects you are most passionate about." Which response strategy is most impactful?',
    options: [
      'Recite your entire resume chronologically starting from your 10th standard school marks and personal family hobbies.',
      'Deliver a structured 90-second elevator pitch: introduce your degree and core specialization, highlight 1-2 impactful technical projects you built, and conclude with why you are excited for this engineering role.',
      'Keep it under 10 seconds: "I am a final-year student who knows Java and Python. Everything else is on my resume."',
      'Focus exclusively on extracurricular college cultural festivals and sports without mentioning technical skills or engineering interests.'
    ],
    correctAnswer: 1,
    explanation: 'A compelling self-introduction uses the Past-Present-Future elevator pitch structure: concise academic background, standout technical achievements/projects, and clear alignment with the engineering role within 60-90 seconds.',
    modelAnswer: 'I am a final-year Computer Science student passionate about full-stack web systems and distributed backend services. Over the past two years, I have built production-ready applications using React, Node.js, and PostgreSQL, including a real-time collaborative platform that optimized database querying by 35%. I love solving architectural scalability challenges, which is why I am thrilled about the opportunity to contribute to your engineering team\'s cloud solutions.'
  },
  {
    category: 'Project Deep-Dive & STAR Problem Solving',
    topic: 'STAR Method Structuring',
    difficulty: 'Medium',
    interviewerContext: 'Technical round: Assessing architectural problem-solving and tangible technical ownership.',
    question: 'The interviewer asks: "Can you walk me through the most technically challenging project you have worked on? What major obstacle did you hit and how did you resolve it?" What is the most effective way to structure your answer?',
    options: [
      'Speak only about how difficult the project was and how your teammates failed to deliver their modules on time.',
      'Apply the STAR framework: concisely set the Situation and Task, detail the specific Actions and architectural decisions you spearheaded to solve the bottleneck, and conclude with the measurable Result.',
      'Explain the theoretical definition of the database algorithm for 15 minutes without discussing your actual implementation or problem-solving.',
      'Say that you followed an online tutorial step-by-step so you did not encounter any obstacles or challenges.'
    ],
    correctAnswer: 1,
    explanation: 'Hiring managers assess technical ownership and problem-solving through the STAR (Situation, Task, Action, Result) methodology. Highlighting personal technical agency and tangible metrics demonstrates engineering maturity.',
    modelAnswer: 'In my placement analytics portal project, we faced critical latency spikes when handling concurrent simulated exam submissions (Situation & Task). I profiled the queries, discovered unindexed queries and redundant round-trips, and implemented Redis in-memory caching paired with connection pooling (Action). This reduced API response latency from 1.8s down to under 120ms and enabled the system to support 500 concurrent students without crashes (Result).'
  },
  {
    category: 'Technical Strengths & Self-Awareness',
    topic: 'Answering Greatest Weakness Without Cliches',
    difficulty: 'Medium',
    interviewerContext: 'HR & Technical Lead round: Evaluating self-awareness, intellectual honesty, and growth mindset.',
    question: 'The interviewer asks: "What do you consider your greatest technical strength, and what is one real weakness you are actively working to improve?" How should you answer?',
    options: [
      'Say: "My only weakness is that I am a perfectionist and work too hard without sleeping." (A transparent cliche).',
      'State your technical strength with concrete examples, then share a genuine, non-fatal growth area alongside specific, tangible actions you are taking to overcome it.',
      'Claim that you have mastered all programming domains and do not have any weaknesses.',
      'State that you struggle with basic coding and dislike working with other people in teams.'
    ],
    correctAnswer: 1,
    explanation: 'Interviewers look for self-awareness, intellectual humility, and proactive growth. Cliches like "I am too perfectionist" damage credibility. Naming a real development area (e.g., cloud orchestration, public speaking) along with active learning steps proves a genuine growth mindset.',
    modelAnswer: 'My primary strength is strong algorithmic problem-solving and clean code discipline. A growth area I identified was cloud infrastructure and Docker container orchestration. To bridge this, I enrolled in an AWS Certified Cloud Practitioner course and containerized my latest backend microservices with automated GitHub Actions CI/CD pipelines.'
  },
  {
    category: 'Team Collaboration & Conflict Resolution',
    topic: 'Disagreements in Code Reviews or Architecture',
    difficulty: 'Medium',
    interviewerContext: 'Managerial round: Assessing emotional intelligence, diplomacy, and team chemistry.',
    question: 'The interviewer asks: "Tell me about a time you had a strong disagreement with a team member regarding a technical decision or design approach. How did you handle it?" Which approach demonstrates the highest professional maturity?',
    options: [
      'Lobby other team members secretly behind their back to outvote the teammate.',
      'Yield immediately and abandon your technical view to avoid any uncomfortable conversation, even if it harms the code.',
      'Acknowledge the colleague\'s perspective objectively, schedule a brief discussion to benchmark both options against project requirements (performance, maintainability), and choose the data-driven solution without ego.',
      'Escalate the issue directly to the college professor or department head to force the teammate to obey your design.'
    ],
    correctAnswer: 2,
    explanation: 'Engineering teams thrive on constructive technical debate. De-personalizing disagreements, benchmarking solutions against factual requirements, and maintaining mutual respect are critical corporate collaboration markers.',
    modelAnswer: 'During our capstone project, a teammate wanted to use MongoDB while I advocated for PostgreSQL due to strict relational integrity requirements. Instead of arguing, we scheduled a 30-minute sync to map our entity relationships and run mock queries. Once we saw the multi-table join complexity, we agreed that PostgreSQL was the better fit, while using MongoDB specifically for unindexed audit logging. We delivered on time with zero schema inconsistencies.'
  },
  {
    category: 'Pressure, Deadlines & Adaptability',
    topic: 'Learning Unfamiliar Tech Under Tight Deadlines',
    difficulty: 'Hard',
    interviewerContext: 'Director / Hiring round: Assessing resilience, resourcefulness, and handling delivery crunches.',
    question: 'The interviewer asks: "Suppose your team is 48 hours away from a major client delivery, and you are assigned an urgent bug fix in a technology framework you have never used before. How do you approach this situation?"',
    options: [
      'Panic and declare to the manager that it is unfair to assign unfamiliar technologies to junior engineers.',
      'Calmly assess the scope, consult official documentation and existing repo codebases, prioritize minimal viable fixes, communicate transparent progress check-ins with your lead, and seek targeted guidance if blocked for more than an hour.',
      'Spend 40 hours reading books from scratch without writing any code or updating the team.',
      'Guess code modifications randomly in production and hope the bug disappears before anyone notices.'
    ],
    correctAnswer: 1,
    explanation: 'Corporate environments require poise under pressure. Rapid resourcefulness (reading docs/internal PRs), time-boxed debugging, transparent communication, and timely escalation before deadlines ensure risk mitigation.',
    modelAnswer: 'First, I replicate and isolate the bug using unit tests. Next, I study existing working code in our repository and consult official framework documentation. I set a strict 45-minute timebox: if I remain blocked, I summarize what I tried and reach out to a senior teammate for targeted direction. Throughout, I provide proactive status updates to my lead so delivery timelines remain predictable.'
  },
  {
    category: 'Company Fit & 3-5 Year Career Vision',
    topic: 'Why Do You Want to Join Our Company',
    difficulty: 'Medium',
    interviewerContext: 'HR & Executive round: Testing company research, long-term retention, and career trajectory.',
    question: 'The interviewer asks: "Why do you specifically want to join our organization, and where do you see your career progression over the next 3 to 5 years?" What answer will best impress the hiring committee?',
    options: [
      'Honestly, I just need any job with a high salary because placements are competitive right now.',
      'Reference specific products, engineering culture, or initiatives of the company that resonate with your interests, and articulate a clear 3-5 year trajectory of evolving from a dependable software contributor into an impactful technical leader or domain specialist.',
      'State that you plan to work here for 6 months and then leave to pursue higher studies or another company.',
      'Give vague praise: "Your company is the best in the world and I will do whatever anyone tells me to do without question."'
    ],
    correctAnswer: 1,
    explanation: 'Recruiters seek retention, authentic alignment with company products/culture, and self-driven career ambitions. Demonstrating that you researched the company and have a 3-5 year roadmap of technical growth signals high potential.',
    modelAnswer: 'I have closely followed your team\'s work on scalable financial APIs and your open-source contributions. Over the next 1-2 years, my priority is to master your system architecture, deliver high-velocity features, and uphold code quality. Within 3-5 years, I aim to grow into a senior engineering contributor who mentors juniors, leads architectural modules, and bridges customer needs with robust software solutions.'
  },
  {
    category: 'Questions for the Interview Panel',
    topic: 'Reverse Interviewing Strategy',
    difficulty: 'Easy',
    interviewerContext: 'Closing interview stage: Testing candidate engagement, curiosity, and strategic thinking.',
    question: 'At the conclusion of the interview, the panel asks: "We have finished our questions. Do you have any questions for us?" Which is the best question to ask?',
    options: [
      'No, I don\'t have any questions, I just want to know when I get the offer letter.',
      'Ask a thoughtful question about engineering practices or team culture: "What does the typical day look like for an entry-level engineer on this team, and what is the biggest technical challenge your team is tackling this quarter?"',
      'How many vacation days do I get and can I leave work early on Fridays?',
      'Did I pass this interview? Please tell me my score right now.'
    ],
    correctAnswer: 1,
    explanation: 'Asking thoughtful questions demonstrates genuine curiosity, strategic thinking, and engagement. Inquiring about team onboarding, engineering challenges, or development practices leaves a lasting positive impression.',
    modelAnswer: 'Thank you for the opportunity! I would love to learn more about the engineering culture on this team: what does a successful onboarding period look like for a new graduate engineer, and what is one major architectural challenge your engineering team is most excited to tackle over the upcoming quarters?'
  }
];

function validateCommunicationMCQSchema(q) {
  if (!q || typeof q !== 'object') return false;
  if (!q.question || typeof q.question !== 'string' || q.question.trim().length < 15) return false;
  if (!Array.isArray(q.options) || q.options.length < 4) return false;
  if (q.options.some(opt => typeof opt !== 'string' || opt.trim().length === 0)) return false;
  if (q.correctAnswer === undefined || q.correctAnswer === null) return false;
  if (!q.explanation || typeof q.explanation !== 'string') return false;
  return true;
}

function buildCommunicationPrompt({
  category,
  difficulty,
  questionNumber,
  totalQuestions = 7,
  questionHistory = []
}) {
  const topicsList = CATEGORY_TOPICS[category] || CATEGORY_TOPICS['Self-Introduction & Elevator Pitch'];
  const suggestedTopic = topicsList[(questionNumber * 3) % topicsList.length];

  const historySummary = questionHistory.length > 0
    ? questionHistory.slice(-5).map((h, i) => `Past Q${i + 1}: [${h.topic || 'General'}] "${h.questionText ? h.questionText.substring(0, 60) : ''}..."`).join('\n')
    : 'None yet (First question of assessment).';

  return `You are an expert Corporate Placement Interview Evaluator at top tech firms (Google, Amazon, Microsoft, TCS, Infosys, Accenture).
Your task is to dynamically generate EXACTLY ONE original, practical placement interview scenario question (MCQ).

TEST SPECIFICATIONS:
- TARGET INTERVIEW PILLAR: "${category}" (CRITICAL: Question must directly evaluate how a candidate handles this company interview round)
- INTERVIEW TOPIC: ${suggestedTopic}
- DIFFICULTY: ${difficulty}
- QUESTION NUMBER: ${questionNumber} of ${totalQuestions}
- QUESTION TYPE: Scenario-based MCQ with 4 distinct response strategies (A, B, C, D) representing real candidate behaviors.

RECENT QUESTIONS (DO NOT REPEAT):
${historySummary}

CORE GUIDELINES:
- Focus on practical, authentic company interview scenarios.
- One option must represent the optimal corporate / STAR method response.
- The other 3 options must represent common candidate mistakes (rambling, overly defensive, lack of STAR structure, or superficial answers).
- Provide a clear explanation of corporate hiring criteria and an exemplary model answer.

OUTPUT INSTRUCTIONS:
Return ONLY a valid JSON object without markdown fences, comments, or extra text:
{
  "category": "${category}",
  "topic": "${suggestedTopic}",
  "difficulty": "${difficulty}",
  "interviewerContext": "Brief 1-sentence description of the interviewer's focus",
  "question": "The interview scenario and exact question asked to the candidate",
  "options": [
    "Candidate response option A",
    "Candidate response option B",
    "Candidate response option C",
    "Candidate response option D"
  ],
  "correctAnswer": 1,
  "explanation": "Why the correct response is the most effective corporate communication practice",
  "modelAnswer": "An exemplary spoken candidate answer illustrating top-tier communication"
}`;
}

export async function generateCommunicationQuestionFromGroq({
  category,
  difficulty = 'Medium',
  questionNumber = 1,
  totalQuestions = 7,
  questionHistory = []
}) {
  const validModels = [
    process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
    'llama3-70b-8192'
  ];

  let groq = null;
  try {
    groq = getGroqClient();
  } catch (clientErr) {
    console.warn('[Communication] Groq API client unavailable, using built-in placement question bank:', clientErr.message);
    return getFallbackCommunicationQuestion({ category, difficulty, questionNumber });
  }

  const prompt = buildCommunicationPrompt({
    category,
    difficulty,
    questionNumber,
    totalQuestions,
    questionHistory
  });

  for (const model of validModels) {
    try {
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert Corporate Placement Interview Evaluator. You generate realistic company interview scenario MCQs. You output ONLY strictly valid JSON objects.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 1024,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) continue;

      let parsed;
      try {
        parsed = JSON.parse(responseText.trim());
      } catch (parseErr) {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        }
      }

      if (parsed && validateCommunicationMCQSchema(parsed)) {
        return {
          id: `comm_q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          category: parsed.category || category,
          topic: parsed.topic || 'Interview Communication',
          difficulty: parsed.difficulty || difficulty,
          interviewerContext: parsed.interviewerContext || 'Placement Interview Evaluation',
          question: parsed.question,
          options: parsed.options,
          correctAnswer: Number(parsed.correctAnswer),
          explanation: parsed.explanation,
          modelAnswer: parsed.modelAnswer || '',
          questionIndex: questionNumber,
          totalQuestions
        };
      }
    } catch (modelErr) {
      console.warn(`[Communication] Groq model ${model} failed: ${modelErr.message}. Trying fallback...`);
    }
  }

  // Fallback to built-in bank if Groq is offline or exhausted
  return getFallbackCommunicationQuestion({ category, difficulty, questionNumber });
}

export function getFallbackCommunicationQuestion({ category, difficulty, questionNumber }) {
  const matchCategory = FALLBACK_COMMUNICATION_QUESTIONS.filter(q => q.category === category);
  const candidates = matchCategory.length > 0 ? matchCategory : FALLBACK_COMMUNICATION_QUESTIONS;
  const picked = candidates[(questionNumber - 1) % candidates.length];

  return {
    id: `comm_fallback_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    category: picked.category,
    topic: picked.topic,
    difficulty: picked.difficulty,
    interviewerContext: picked.interviewerContext || 'Placement Interview Evaluation',
    question: picked.question,
    options: [...picked.options],
    correctAnswer: picked.correctAnswer,
    explanation: picked.explanation,
    modelAnswer: picked.modelAnswer,
    questionIndex: questionNumber,
    totalQuestions: 7,
    isFallback: true
  };
}

export function evaluateCommunicationAnswer(question, studentAnswerIndex) {
  const isCorrect = Number(studentAnswerIndex) === Number(question.correctAnswer);
  return {
    isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    modelAnswer: question.modelAnswer || ''
  };
}

/**
 * Evaluates open-ended student responses in the Mock Interview Practice Studio.
 * Analyzes structure, STAR alignment, vocabulary, confidence, and areas for polish.
 */
export async function evaluateOpenEndedInterviewResponse({
  question,
  answerText,
  category = 'General Interview Question'
}) {
  const cleanAnswer = (answerText || '').trim();

  // If answer is empty or too short
  if (cleanAnswer.length < 15) {
    return {
      score: 30,
      starScore: 25,
      feedback: 'Response was too brief. In a real company interview, articulate your answer in 2-4 structured sentences (approx 50-120 words).',
      strengths: ['Initial attempt recorded'],
      improvements: [
        'Elaborate on specific actions and concrete outcomes',
        'Use the STAR method (Situation, Task, Action, Result) for behavioral questions',
        'Incorporate technical and professional vocabulary'
      ],
      modelAnswer: question?.modelAnswer || 'Structure your response with clear context, specific actions taken, and measurable impact.'
    };
  }

  // Attempt Groq evaluation first
  try {
    const groq = getGroqClient();
    const prompt = `You are an expert Senior Technical Recruiter and Placement Interview Coach.
Evaluate this student's spoken/written answer to this company interview question:

QUESTION: "${question?.question || question}"
CATEGORY: "${category}"
STUDENT'S ANSWER: "${cleanAnswer}"

Provide structured evaluation in JSON:
{
  "score": 85, // Integer 0 to 100 based on overall clarity, tone, and depth
  "starScore": 80, // Integer 0 to 100 on structure & STAR adherence
  "feedback": "2 sentences of constructive feedback",
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Improvement suggestion 1", "Improvement suggestion 2"],
  "modelAnswer": "Refined model answer based on their idea"
}`;

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert Placement Interview Coach. Output ONLY valid JSON.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 800,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content;
    if (content) {
      const parsed = JSON.parse(content.trim());
      return {
        score: Math.min(100, Math.max(30, Number(parsed.score) || 75)),
        starScore: Math.min(100, Math.max(25, Number(parsed.starScore) || 70)),
        feedback: parsed.feedback || 'Good communication demonstrated with opportunities for refinement.',
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Clear articulation of thoughts'],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ['Add measurable metrics to outcomes'],
        modelAnswer: parsed.modelAnswer || question?.modelAnswer || ''
      };
    }
  } catch (err) {
    console.warn('[Communication] Open-ended AI evaluation fallback:', err.message);
  }

  // Heuristic Smart Fallback Evaluation
  const wordCount = cleanAnswer.split(/\s+/).length;
  const lower = cleanAnswer.toLowerCase();
  
  const hasStarKeywords = ['situation', 'task', 'action', 'result', 'because', 'resolved', 'built', 'improved', 'learned', 'team', 'project', 'metrics', 'percent'].some(k => lower.includes(k));
  const hasFirstPersonAgency = ['i built', 'i implemented', 'i decided', 'i resolved', 'my role', 'i learned', 'i worked'].some(k => lower.includes(k));

  let score = 65;
  let starScore = 60;

  if (wordCount >= 40 && wordCount <= 160) score += 15;
  if (hasStarKeywords) {
    score += 10;
    starScore += 20;
  }
  if (hasFirstPersonAgency) {
    score += 10;
    starScore += 10;
  }

  score = Math.min(95, Math.max(45, score));
  starScore = Math.min(95, Math.max(40, starScore));

  const strengths = [];
  if (hasFirstPersonAgency) strengths.push('Strong personal agency and ownership demonstrated');
  if (wordCount >= 30) strengths.push('Good verbal depth and thoughtful elaboration');
  strengths.push('Professional workplace tone maintained');

  const improvements = [];
  if (!hasStarKeywords) improvements.push('Apply the STAR structure (Situation -> Task -> Action -> Result)');
  if (wordCount < 40) improvements.push('Elaborate with more concrete technical specifics');
  improvements.push('Quantify outcomes with measurable metrics (e.g., % improvement, reduced latency, delivery days)');

  return {
    score,
    starScore,
    feedback: score >= 80 
      ? 'Strong and articulate interview response. Good poise and clear technical narrative.' 
      : 'Good starting response. Focus on adding concrete technical actions and measurable results.',
    strengths,
    improvements,
    modelAnswer: question?.modelAnswer || 'In my previous project, I spearheaded the core module implementation, systematically resolved architectural bottlenecks using clean code patterns, and delivered the feature 2 days ahead of schedule.'
  };
}
