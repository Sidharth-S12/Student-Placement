
import React, { useEffect, useMemo, useState } from "react";
import "./PersonalizedRoadmap.css";

const skillGroups = {
  Technical: ["Python", "Java", "SQL", "CSS", "Machine Learning (ML)"],
  Aptitude: [
    "Logical Reasoning",
    "Quantitative Aptitude",
    "Verbal Ability",
  ],
  Communication: [
    "Self-Introduction",
    "Interview Communication",
    "Group Discussion",
    "Professional Communication",
  ],
};

const topics = {
  Python: ["Syntax and variables", "Conditions and loops", "Functions and data structures", "OOP and file handling", "Problem-solving practice", "Coding assessment"],
  Java: ["Syntax and data types", "Conditions and loops", "Arrays and strings", "Object-oriented programming", "Collections and exceptions", "Coding assessment"],
  SQL: ["Database fundamentals", "SELECT and filtering", "Joins and grouping", "Subqueries", "Keys and normalization", "SQL practice test"],
  CSS: ["Selectors and properties", "Box model and layouts", "Flexbox and Grid", "Responsive design", "Animations and styling", "Build a responsive page"],
  "Machine Learning (ML)": ["ML fundamentals", "Data preprocessing", "Supervised learning", "Unsupervised learning", "Model evaluation", "Mini-project"],
  "Logical Reasoning": ["Number and letter series", "Coding-decoding", "Blood relations", "Directions and arrangements", "Syllogisms", "Reasoning mock test"],
  "Quantitative Aptitude": ["Percentages and ratios", "Averages and mixtures", "Profit, loss and interest", "Time, speed and distance", "Work and probability", "Quantitative mock test"],
  "Verbal Ability": ["Grammar fundamentals", "Vocabulary building", "Sentence correction", "Reading comprehension", "Para jumbles", "Verbal mock test"],
  "Self-Introduction": ["Identify your strengths", "Prepare your introduction", "Explain your academic background", "Describe your project", "Practise aloud", "Record and review"],
  "Interview Communication": ["Active listening", "Answering clearly", "STAR method", "HR interview questions", "Mock interview", "Review your performance"],
  "Group Discussion": ["Structure your ideas", "Opening a discussion", "Supporting arguments", "Listening and responding", "Practice discussion", "Self-evaluation"],
  "Professional Communication": ["Professional vocabulary", "Email etiquette", "Presentation basics", "Body language", "Workplace scenarios", "Presentation practice"],
};

const quizQuestions = {
  Technical: [
    { q: "What is the main purpose of debugging?", options: ["Design a logo", "Find and fix errors", "Delete all data"], answer: 1 },
    { q: "Which activity best improves technical problem-solving?", options: ["Avoiding practice", "Memorizing without coding", "Solving coding problems"], answer: 2 },
    { q: "What should you do when a program produces an error?", options: ["Inspect the error and test a fix", "Ignore it", "Delete the project"], answer: 0 },
  ],
  Aptitude: [
    { q: "What is 20% of 150?", options: ["20", "30", "40"], answer: 1 },
    { q: "Find the next number: 2, 4, 6, 8, ...", options: ["9", "10", "12"], answer: 1 },
    { q: "If all roses are flowers, are all roses flowers?", options: ["Yes", "No", "Cannot be determined"], answer: 0 },
  ],
  Communication: [
    { q: "What is important during an interview?", options: ["Interrupting", "Clear and relevant answers", "Avoiding eye contact completely"], answer: 1 },
    { q: "What is active listening?", options: ["Planning your reply without listening", "Changing the topic", "Paying attention and understanding"], answer: 2 },
    { q: "How should professional emails usually begin?", options: ["With a suitable greeting", "With unrelated jokes", "With no context"], answer: 0 },
  ],
};

function createMilestones(skill, level, duration) {
  const syllabus = topics[skill] || topics.Python;
  const months = Number(duration);
  const count = Math.max(6, months * 4);
  const levelTasks = {
    Beginner: ["Learn the concepts", "Follow a guided example", "Complete a simple exercise"],
    Intermediate: ["Revise core concepts", "Solve practical exercises", "Complete an applied task"],
    Advanced: ["Study advanced concepts", "Solve challenging problems", "Build or evaluate a project"],
  };

  return Array.from({ length: count }, (_, i) => {
    const topic = syllabus[Math.floor(i * syllabus.length / count)];
    const task = levelTasks[level][i % 3];
    return {
      id: `${skill}-${level}-${months}-${i}`,
      title: `Week ${i + 1}: ${topic}`,
      description: `${task} for ${skill}.`,
      week: i + 1,
    };
  });
}

export default function PersonalizedRoadmap() {
  const [category, setCategory] = useState("Technical");
  const [skill, setSkill] = useState("Python");
  const [level, setLevel] = useState("Beginner");
  const [duration, setDuration] = useState("3");
  const [roadmap, setRoadmap] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [quizScore, setQuizScore] = useState(null);
  const [answers, setAnswers] = useState({});
  const [quizOpen, setQuizOpen] = useState(false);
  const [savedPlans, setSavedPlans] = useState({});

  const skills = skillGroups[category];
  const questions = quizQuestions[category];

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("personalizedRoadmaps") || "{}"
      );
      setSavedPlans(saved);
    } catch {
      setSavedPlans({});
    }
  }, []);

  useEffect(() => {
    setSkill(skillGroups[category][0]);
    setQuizScore(null);
    setAnswers({});
    setQuizOpen(false);
  }, [category]);

  const progress = roadmap?.length
    ? Math.round((completed.length / roadmap.length) * 100)
    : 0;

  const readiness = roadmap
    ? Math.round(progress * 0.7 + (quizScore ?? 0) * 0.3)
    : 0;

  const completedWeeks = useMemo(
    () => new Set(roadmap?.filter((m) => completed.includes(m.id)).map((m) => m.week) || []),
    [roadmap, completed]
  );

  function generateRoadmap() {
    const key = `${category}-${skill}-${level}-${duration}`;
    const saved = savedPlans[key];

    if (saved) {
      setRoadmap(saved.roadmap);
      setCompleted(saved.completed);
      setQuizScore(saved.quizScore);
    } else {
      setRoadmap(createMilestones(skill, level, duration));
      setCompleted([]);
      setQuizScore(null);
    }

    setAnswers({});
    setQuizOpen(false);
  }

  function saveProgress(nextCompleted, nextScore = quizScore) {
    if (!roadmap) return;

    const key = `${category}-${skill}-${level}-${duration}`;
    const nextPlans = {
      ...savedPlans,
      [key]: { roadmap, completed: nextCompleted, quizScore: nextScore },
    };

    setCompleted(nextCompleted);
    setSavedPlans(nextPlans);
    localStorage.setItem("personalizedRoadmaps", JSON.stringify(nextPlans));
  }

  function toggleMilestone(id) {
    const next = completed.includes(id)
      ? completed.filter((item) => item !== id)
      : [...completed, id];

    saveProgress(next);
  }

  function submitQuiz() {
    const correct = questions.filter(
      (_, i) => Number(answers[i]) === questions[i].answer
    ).length;
    const score = Math.round((correct / questions.length) * 100);
    setQuizScore(score);
    setQuizOpen(false);
    saveProgress(completed, score);
  }

  return (
    <main className="roadmap-page">
      <header className="roadmap-heading">
        <span className="roadmap-eyebrow">PLACEMENT PREPARATION</span>
        <h1>Personalized Learning Roadmap</h1>
        <p>Build your skills, complete weekly milestones and track your placement readiness.</p>
      </header>

      <section className="roadmap-panel">
        <h2>1. Customize your learning plan</h2>

        <div className="roadmap-form-grid">
          <label>
            Skill category
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {Object.keys(skillGroups).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Select a skill
            <select value={skill} onChange={(e) => setSkill(e.target.value)}>
              {skills.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Current level
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>

          <label>
            Plan duration
            <select value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="9">9 months</option>
              <option value="12">12 months</option>
            </select>
          </label>
        </div>

        <button className="roadmap-primary" onClick={generateRoadmap}>
          Generate My Roadmap
        </button>
      </section>

      {roadmap && (
        <>
          <section className="roadmap-stats">
            <article className="roadmap-stat">
              <span>Milestones completed</span>
              <strong>{completed.length}/{roadmap.length}</strong>
            </article>
            <article className="roadmap-stat">
              <span>Learning progress</span>
              <strong>{progress}%</strong>
            </article>
            <article className="roadmap-stat">
              <span>Readiness score</span>
              <strong>{readiness}%</strong>
            </article>
          </section>

          <section className="roadmap-panel">
            <div className="roadmap-section-title">
              <div>
                <h2>2. Your weekly roadmap</h2>
                <p>{skill} · {level} · {duration} months</p>
              </div>
              <span className="roadmap-chip">{progress}% complete</span>
            </div>

            <div className="roadmap-progress-track">
              <div style={{ width: `${progress}%` }} />
            </div>

            <div className="roadmap-milestones">
              {roadmap.map((milestone) => {
                const done = completed.includes(milestone.id);
                return (
                  <label
                    key={milestone.id}
                    className={`roadmap-milestone ${done ? "is-complete" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => toggleMilestone(milestone.id)}
                    />
                    <span className="roadmap-milestone-text">
                      <strong>{milestone.title}</strong>
                      <small>{milestone.description}</small>
                    </span>
                    <span className="roadmap-week-status">
                      {done ? "Completed" : "To do"}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          <section className="roadmap-panel">
            <h2>3. Weekly topic quiz</h2>
            <p className="roadmap-muted">
              Check your understanding of {category.toLowerCase()} concepts.
              Complete milestones and take the quiz regularly.
            </p>

            {!quizOpen ? (
              <div className="roadmap-quiz-summary">
                <span>
                  {quizScore === null
                    ? "No quiz taken yet"
                    : `Latest quiz score: ${quizScore}%`}
                </span>
                <button
                  className="roadmap-primary"
                  onClick={() => {
                    setAnswers({});
                    setQuizOpen(true);
                  }}
                >
                  {quizScore === null ? "Take Weekly Quiz" : "Retake Quiz"}
                </button>
              </div>
            ) : (
              <div className="roadmap-quiz">
                {questions.map((question, i) => (
                  <fieldset key={question.q}>
                    <legend>{i + 1}. {question.q}</legend>
                    {question.options.map((option, j) => (
                      <label key={option} className="roadmap-answer">
                        <input
                          type="radio"
                          name={`question-${i}`}
                          checked={String(answers[i]) === String(j)}
                          onChange={() =>
                            setAnswers({ ...answers, [i]: j })
                          }
                        />
                        {option}
                      </label>
                    ))}
                  </fieldset>
                ))}
                <button
                  className="roadmap-primary"
                  disabled={Object.keys(answers).length !== questions.length}
                  onClick={submitQuiz}
                >
                  Submit Quiz
                </button>
              </div>
            )}
          </section>

          <section className="roadmap-panel roadmap-readiness">
            <h2>4. Placement readiness</h2>
            <p>
              Your score combines roadmap completion (70%) and your latest quiz
              score (30%). Take quizzes and complete milestones to update it.
            </p>
            <div className="roadmap-readiness-number">{readiness}%</div>
            <div className="roadmap-progress-track">
              <div style={{ width: `${readiness}%` }} />
            </div>
            <p className="roadmap-muted">
              {readiness < 40
                ? "Keep learning and complete your first milestones."
                : readiness < 75
                ? "Good progress. Continue practising consistently."
                : "Strong progress. Keep reviewing and practising."}
            </p>
          </section>
        </>
      )}
    </main>
  );
}
