import React, { useMemo, useState, useEffect } from "react";
import {
  Sparkles,
  Search,
  CheckCircle2,
  Download,
  ExternalLink,
  BookOpen,
  Code2,
  Layers,
  Check,
  RotateCcw,
  Clock,
  Compass,
  Award,
  Terminal,
  HelpCircle,
  Zap,
  Star,
  Info,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trophy,
  ChevronDown,
  ChevronUp,
  Calendar,
  Target
} from "lucide-react";
import { useStudent } from "../context/StudentContext";
import {
  programmingLanguages,
  languageCategories
} from "../data/programmingLanguagesRoadmapData";
import { getQuizForLanguage } from "../data/programmingLanguageQuizzes";
import { getStudyResourcesForLanguage } from "../data/programmingLanguageStudyResources";
import "./PersonalizedRoadmap.css";

// Learning timeline horizons with scheduling parameters
const timelineHorizons = [
  {
    value: "4",
    title: "4-Week Sprint",
    hours: "3-4 hrs/day",
    weeklyHours: 25,
    totalHours: 100,
    weeksCount: 4,
    badgeText: "High-Intensity Sprint",
    description: "Accelerated 4-week fast-track for immediate coding interviews and core syntax mastery.",
    paceAdvice: "3-4 hrs/day • Focus on high-frequency syntax, interview patterns & speed.",
  },
  {
    value: "8",
    title: "8-Week Pathway",
    hours: "2 hrs/day",
    weeklyHours: 14,
    totalHours: 112,
    weeksCount: 8,
    badgeText: "Standard Placement Pathway",
    description: "Balanced 8-week structured roadmap with robust conceptual grounding & hands-on projects (Recommended).",
    paceAdvice: "2 hrs/day • Steady balance between deep theory, weekly projects & interview drills.",
  },
  {
    value: "16",
    title: "16-Week Mastery",
    hours: "1.5 hrs/day",
    weeklyHours: 10,
    totalHours: 160,
    weeksCount: 16,
    badgeText: "Deep Systems Mastery",
    description: "Exhaustive 16-week comprehensive roadmap covering memory internals, concurrency & system design.",
    paceAdvice: "1.5 hrs/day • Thorough foundation, compiler nuances, profiling & enterprise capstones.",
  },
];

const experienceLevels = ["All Levels (Full Mastery)", "Beginner", "Intermediate", "Advanced"];

export default function PersonalizedRoadmap() {
  const studentContext = useStudent ? useStudent() : null;
  const studentData = studentContext?.studentData;
  const currentUid = studentContext?.currentUid;
  const updateRoadmapProgress = studentContext?.updateRoadmapProgress;

  // Selected language, category, search, level, horizon with persistence
  const [selectedLanguageId, setSelectedLanguageId] = useState(() => {
    try {
      const savedPref = localStorage.getItem("placement_roadmap_last_lang");
      if (savedPref && programmingLanguages.some((l) => l.id === savedPref)) {
        return savedPref;
      }
    } catch {}
    return "python";
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(() => {
    try {
      const saved = localStorage.getItem("placement_roadmap_level");
      if (saved && experienceLevels.includes(saved)) return saved;
    } catch {}
    return "All Levels (Full Mastery)";
  });
  const [selectedHorizon, setSelectedHorizon] = useState(() => {
    try {
      const saved = localStorage.getItem("placement_roadmap_horizon");
      if (saved && ["4", "8", "16"].includes(saved)) return saved;
    } catch {}
    return "8";
  });
  const [completedTasks, setCompletedTasks] = useState({});

  // Quiz state
  const [quizActive, setQuizActive] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [passedQuizzes, setPassedQuizzes] = useState({});
  const [showExplanationModal, setShowExplanationModal] = useState(false);

  // Preference change handlers that persist choices
  const handleSelectLanguage = (langId) => {
    setSelectedLanguageId(langId);
    try {
      localStorage.setItem("placement_roadmap_last_lang", langId);
    } catch {}
    if (updateRoadmapProgress) {
      updateRoadmapProgress(langId, completedTasks, {
        selectedLanguageId: langId,
        selectedLevel,
        selectedHorizon,
      });
    }
  };

  const handleSelectLevel = (lvl) => {
    setSelectedLevel(lvl);
    try {
      localStorage.setItem("placement_roadmap_level", lvl);
    } catch {}
  };

  const handleSelectHorizon = (hrz) => {
    setSelectedHorizon(hrz);
    try {
      localStorage.setItem("placement_roadmap_horizon", hrz);
    } catch {}
  };

  // Auto-detect student language from profile ONLY IF no prior language choice was saved
  useEffect(() => {
    try {
      const savedPref = localStorage.getItem("placement_roadmap_last_lang");
      if (savedPref) return;
    } catch {}

    if (studentData?.technicalSkills?.programmingLanguages?.length > 0) {
      const studentLangs = studentData.technicalSkills.programmingLanguages.map((l) =>
        String(l).toLowerCase().trim()
      );
      const match = programmingLanguages.find((lang) =>
        studentLangs.some((sl) => lang.id.includes(sl) || lang.name.toLowerCase().includes(sl))
      );
      if (match) {
        setSelectedLanguageId(match.id);
      }
    }
  }, [studentData]);

  // Load passed quizzes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("placement_passed_quizzes");
      if (saved) {
        setPassedQuizzes(JSON.parse(saved));
      }
    } catch {
      setPassedQuizzes({});
    }
  }, []);

  // Current language object
  const currentLanguage = useMemo(() => {
    return (
      programmingLanguages.find((l) => l.id === selectedLanguageId) ||
      programmingLanguages[0]
    );
  }, [selectedLanguageId]);

  // Curated study portals & per-phase learning resources
  const studyResources = useMemo(() => {
    return getStudyResourcesForLanguage(currentLanguage.id, currentLanguage.name);
  }, [currentLanguage]);

  // Reset quiz state when switching language
  useEffect(() => {
    setQuizActive(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
  }, [selectedLanguageId]);

  // Filtered languages list based on category & search query
  const filteredLanguages = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return programmingLanguages.filter((lang) => {
      const matchesCategory =
        selectedCategory === "all" ||
        lang.category === selectedCategory ||
        (selectedCategory === "popular" && lang.category === "popular");

      const matchesSearch =
        !q ||
        lang.name.toLowerCase().includes(q) ||
        lang.id.toLowerCase().includes(q) ||
        lang.paradigm.toLowerCase().includes(q) ||
        lang.industryUse.toLowerCase().includes(q) ||
        lang.description.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Load progress from Firestore profile first, then UID-keyed localStorage, with legacy migration
  useEffect(() => {
    const langId = currentLanguage.id;
    let loaded = {};

    // 1. Check student profile in Firestore / Context
    if (studentData?.roadmapProgress?.[langId] && typeof studentData.roadmapProgress[langId] === "object") {
      loaded = { ...studentData.roadmapProgress[langId] };
    }

    // 2. Check UID-scoped local storage
    try {
      const uidKey = `placement_roadmap_${currentUid || "local"}_${langId}`;
      const saved = localStorage.getItem(uidKey);
      if (saved) {
        loaded = { ...loaded, ...JSON.parse(saved) };
      }
    } catch (e) {}

    // 3. Fallback: Check legacy keys (lang_roadmap_...) to migrate any previous work
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(`lang_roadmap_${langId}`)) {
          try {
            const legacyVal = JSON.parse(localStorage.getItem(k));
            if (legacyVal && typeof legacyVal === "object") {
              loaded = { ...legacyVal, ...loaded };
            }
          } catch {}
        }
      }
    } catch (e) {}

    setCompletedTasks(loaded);
  }, [currentLanguage.id, currentUid, studentData?.roadmapProgress]);

  /**
   * BUILD COMPLETE MULTI-PHASE ROADMAP
   * Guarantees that EVERY language has at least 3-4 progressive phases (Phase 1, 2, 3, 4, 5).
   * Solves the issue where only Phase 1 was visible!
   */
  const currentPhases = useMemo(() => {
    const levelMap = currentLanguage.phases || {};

    if (selectedLevel === "Beginner" && levelMap.Beginner?.length > 1) {
      return levelMap.Beginner;
    }
    if (selectedLevel === "Intermediate" && levelMap.Intermediate?.length > 1) {
      return levelMap.Intermediate;
    }
    if (selectedLevel === "Advanced" && levelMap.Advanced?.length > 1) {
      return levelMap.Advanced;
    }

    // Default & Full Mastery mode: Merge all defined level phases into a unified multi-phase progression!
    const allPhases = [
      ...(levelMap.Beginner || []),
      ...(levelMap.Intermediate || []),
      ...(levelMap.Advanced || []),
    ];

    if (allPhases.length >= 2) {
      // Re-number phases sequentially (Phase 1, Phase 2, Phase 3, ...)
      return allPhases.map((phase, idx) => ({
        ...phase,
        phase: `Phase ${idx + 1}: ${phase.phase.replace(/^Phase\s*\d+:\s*/i, "")}`,
      }));
    }

    // If a language only had 1 phase defined, automatically synthesize a complete 4-phase comprehensive curriculum!
    const basePhase = allPhases[0] || {
      phase: `${currentLanguage.name} Foundations & Syntax`,
      topics: [
        { id: `${currentLanguage.id}-f1`, title: "Variables, Primitive Types & Memory Layout", detail: "Declaration syntax, scope rules, type safety, and memory representation." },
        { id: `${currentLanguage.id}-f2`, title: "Control Flow: Conditionals & Loops", detail: "Branching idioms, switch/match constructs, loop termination, and break/continue." },
        { id: `${currentLanguage.id}-f3`, title: "Functions, Parameters & Return Signatures", detail: "Pass-by-value vs pass-by-reference, default parameters, and scope rules." },
      ],
      project: `Build a Command-Line Utility in ${currentLanguage.name} with file I/O.`,
      drillQuestion: `Explain the memory model and execution lifecycle of ${currentLanguage.name}.`,
    };

    return [
      {
        phase: "Phase 1: Core Language Syntax, Primitives & Control Flow",
        topics: basePhase.topics || [
          { id: `${currentLanguage.id}-p1-1`, title: "Variables, Types & Syntax Fundamentals", detail: "Keywords, identifier rules, operators, and primitive data representations." },
          { id: `${currentLanguage.id}-p1-2`, title: "Control Flow & Decision Structures", detail: "Conditionals, iterative loops, error checks, and exit codes." },
          { id: `${currentLanguage.id}-p1-3`, title: "Functions & Execution Call Stack", detail: "Parameter passing, stack frame allocation, and return values." },
        ],
        project: `CLI Record Management Utility in ${currentLanguage.name} handling user inputs.`,
        drillQuestion: `What makes ${currentLanguage.name}'s syntax or execution model distinct from other languages?`,
      },
      {
        phase: "Phase 2: Data Structures, Memory Management & Collections",
        topics: [
          { id: `${currentLanguage.id}-p2-1`, title: "Built-in Collections & Sequence Structures", detail: "Arrays, lists, vectors, sets, or key-value hash dictionaries." },
          { id: `${currentLanguage.id}-p2-2`, title: "Memory Allocation (Stack vs Heap & References)", detail: "Understanding pointers, references, allocation overhead, and lifetimes." },
          { id: `${currentLanguage.id}-p2-3`, title: "Iteration Protocols & Standard Library Algorithms", detail: "Traversing collections, filtering, transformations, and sorting." },
        ],
        project: `Custom In-Memory Data Store in ${currentLanguage.name} implementing fast lookups.`,
        drillQuestion: `How does memory allocation and deallocation function under the hood in ${currentLanguage.name}?`,
      },
      {
        phase: "Phase 3: Modular Architecture, OOP / Functional Design Patterns",
        topics: [
          { id: `${currentLanguage.id}-p3-1`, title: "Modularity, Packages & Code Organization", detail: "Namespaces, modules, external dependency imports, and visibility rules." },
          { id: `${currentLanguage.id}-p3-2`, title: "Object-Oriented or Functional Architectural Patterns", detail: "Classes, structs, interfaces, traits, or pure function composition." },
          { id: `${currentLanguage.id}-p3-3`, title: "Robust Error & Exception Handling", detail: "Exception hierarchies, Result/Option types, panics, or defensive coding." },
        ],
        project: `Modular Application in ${currentLanguage.name} following SOLID / clean architecture principles.`,
        drillQuestion: `How does ${currentLanguage.name} encourage code reusability without introducing high coupling?`,
      },
      {
        phase: "Phase 4: Concurrency, Testing & Production Capstone Project",
        topics: [
          { id: `${currentLanguage.id}-p4-1`, title: "Concurrency, Asynchronous I/O & Threading", detail: "Managing concurrent tasks, threads, goroutines, async/await, or event loops." },
          { id: `${currentLanguage.id}-p4-2`, title: "Automated Unit Testing & Benchmarking Suite", detail: "Writing unit tests, assertions, mocking dependencies, and measuring execution speed." },
          { id: `${currentLanguage.id}-p4-3`, title: "Production Deployment & Package Ecosystem", detail: "Compiling standalone binaries, Dockerizing, or integrating into CI/CD pipelines." },
        ],
        project: `High-Performance Production Microservice or Tool in ${currentLanguage.name} with automated tests and documentation.`,
        drillQuestion: `How do you diagnose and resolve a deadlock or race condition in ${currentLanguage.name}?`,
      },
    ];
  }, [currentLanguage, selectedLevel]);

  // Calculate total topic milestones and completed milestones
  const allTopicIds = useMemo(() => {
    return currentPhases.flatMap((p) => p.topics.map((t) => t.id));
  }, [currentPhases]);

  const totalTopicsCount = allTopicIds.length;
  const completedCount = useMemo(() => {
    return allTopicIds.filter((id) => !!completedTasks[id]).length;
  }, [allTopicIds, completedTasks]);

  const masteryScore = useMemo(() => {
    if (!totalTopicsCount) return 0;
    return Math.round((completedCount / totalTopicsCount) * 100);
  }, [completedCount, totalTopicsCount]);

  // Current Horizon object
  const currentHorizonObj = useMemo(() => {
    return (
      timelineHorizons.find((h) => h.value === selectedHorizon) ||
      timelineHorizons[1]
    );
  }, [selectedHorizon]);

  // Target completion date calculated from current horizon duration
  const targetDateFormatted = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + (Number(selectedHorizon) || 8) * 7);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }, [selectedHorizon]);

  // Calculate dynamic weekly & daily pacing metadata per phase
  const getPhaseTimeline = (pIdx, totalPhases = currentPhases.length) => {
    const totalWeeks = Number(selectedHorizon) || 8;
    const safePhases = Math.max(1, totalPhases);
    const weeksPerPhase = Math.max(1, Math.round(totalWeeks / safePhases));
    const startWeek = pIdx * weeksPerPhase + 1;
    const endWeek = pIdx === safePhases - 1 ? totalWeeks : (pIdx + 1) * weeksPerPhase;

    const weekLabel = startWeek === endWeek ? `Week ${startWeek}` : `Weeks ${startWeek}–${endWeek}`;
    const startDay = (startWeek - 1) * 7 + 1;
    const endDay = endWeek * 7;
    const daysLabel = `Days ${startDay}–${endDay}`;
    const hoursLabel = `~${Math.round((currentHorizonObj.totalHours || 112) / safePhases)} hrs`;

    let scheduleBreakdown = [];
    if (totalWeeks === 4) {
      scheduleBreakdown = [
        { period: `Days ${startDay}–${startDay + 2}`, focus: "Syntax & Core Checklist Milestones" },
        { period: `Days ${startDay + 3}–${startDay + 4}`, focus: "Hands-on Practical Project Implementation" },
        { period: `Days ${startDay + 5}–${endDay}`, focus: "Technical Drill & Placement Interview Questions" },
      ];
    } else if (totalWeeks === 8) {
      scheduleBreakdown = [
        { period: `Week ${startWeek} (Days ${startDay}–${startDay + 6})`, focus: "In-depth Conceptual Study & Checklist Mastery" },
        { period: `Week ${endWeek} (Days ${startDay + 7}–${endDay})`, focus: "Project Engineering, Testing & Interview Drills" },
      ];
    } else {
      scheduleBreakdown = [
        { period: `Weeks ${startWeek}–${startWeek + 1} (Days ${startDay}–${startDay + 13})`, focus: "Language Architecture & Detailed Theory" },
        { period: `Week ${startWeek + 2} (Days ${startDay + 14}–${startDay + 20})`, focus: "Robust Project Build & Benchmark Testing" },
        { period: `Week ${endWeek} (Days ${startDay + 21}–${endDay})`, focus: "Concurrency, Edge Cases & Drill Rehearsals" },
      ];
    }

    return {
      startWeek,
      endWeek,
      weekLabel,
      startDay,
      endDay,
      daysLabel,
      hoursLabel,
      scheduleBreakdown,
    };
  };

  // Week-by-week cards mapping to phase progress
  const weeksList = useMemo(() => {
    const totalWeeks = Number(selectedHorizon) || 8;
    const numPhases = currentPhases.length || 4;
    return Array.from({ length: totalWeeks }, (_, i) => {
      const weekNum = i + 1;
      const phaseIdx = Math.min(
        Math.floor((i / totalWeeks) * numPhases),
        numPhases - 1
      );
      const phase = currentPhases[phaseIdx];
      const phaseTopics = phase?.topics || [];
      const completedPhaseTopics = phaseTopics.filter((t) => !!completedTasks[t.id]).length;
      const isPhaseDone = phaseTopics.length > 0 && completedPhaseTopics === phaseTopics.length;
      const isPhaseStarted = completedPhaseTopics > 0;

      return {
        weekNum,
        phaseIdx,
        phaseName: phase?.phase || `Phase ${phaseIdx + 1}`,
        status: isPhaseDone ? "completed" : isPhaseStarted ? "in-progress" : "upcoming",
        progressPct: phaseTopics.length ? Math.round((completedPhaseTopics / phaseTopics.length) * 100) : 0,
      };
    });
  }, [selectedHorizon, currentPhases, completedTasks]);

  // Jump smoothly to a specific phase card
  const scrollToPhase = (phaseIdx) => {
    const el = document.getElementById(`phase-card-${phaseIdx}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.classList.add("phase-highlight-pulse");
      setTimeout(() => el.classList.remove("phase-highlight-pulse"), 1600);
    }
  };

  // Toggle checklist task & persist to UID-keyed local storage + Firestore profile
  const toggleTask = (taskId) => {
    setCompletedTasks((prev) => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      const langId = currentLanguage.id;
      const uidKey = `placement_roadmap_${currentUid || "local"}_${langId}`;

      // Save to localStorage immediately
      try {
        localStorage.setItem(uidKey, JSON.stringify(next));
      } catch (e) {
        console.error("Could not save progress to localStorage", e);
      }

      // Persist to Firestore / student profile
      if (updateRoadmapProgress) {
        updateRoadmapProgress(langId, next, {
          selectedHorizon,
          selectedLevel,
          selectedLanguageId: langId,
        });
      }

      return next;
    });
  };

  // Reset checklist for this language
  const resetProgress = () => {
    if (window.confirm(`Reset checklist progress for ${currentLanguage.name}?`)) {
      setCompletedTasks({});
      const langId = currentLanguage.id;
      const uidKey = `placement_roadmap_${currentUid || "local"}_${langId}`;
      try {
        localStorage.removeItem(uidKey);
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const k = localStorage.key(i);
          if (k && k.startsWith(`lang_roadmap_${langId}`)) {
            localStorage.removeItem(k);
          }
        }
      } catch (e) {}

      if (updateRoadmapProgress) {
        updateRoadmapProgress(langId, {}, {
          selectedHorizon,
          selectedLevel,
          selectedLanguageId: langId,
        });
      }
    }
  };

  // Current Quiz Questions for this language
  const currentQuizQuestions = useMemo(() => {
    return getQuizForLanguage(currentLanguage.id);
  }, [currentLanguage.id]);

  // Handle quiz answer selection
  const selectQuizAnswer = (qIndex, optionIndex) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({
      ...prev,
      [qIndex]: optionIndex,
    }));
  };

  // Submit quiz and calculate score
  const submitQuiz = () => {
    setQuizSubmitted(true);
    let correctCount = 0;
    currentQuizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const passed = correctCount >= Math.ceil(currentQuizQuestions.length * 0.6);
    if (passed) {
      const updated = { ...passedQuizzes, [currentLanguage.id]: true };
      setPassedQuizzes(updated);
      try {
        localStorage.setItem("placement_passed_quizzes", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Calculate quiz score
  const quizScore = useMemo(() => {
    if (!quizSubmitted) return 0;
    let correct = 0;
    currentQuizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) correct += 1;
    });
    return Math.round((correct / currentQuizQuestions.length) * 100);
  }, [quizSubmitted, currentQuizQuestions, quizAnswers]);

  // Download Comprehensive Language Dossier
  const downloadDossier = () => {
    const lines = [
      "==================================================================",
      `     ${currentLanguage.name.toUpperCase()} PROGRAMMING LANGUAGE MASTERY ROADMAP     `,
      "==================================================================",
      `Candidate Name: ${studentData?.personalInfo?.fullName || "Candidate"}`,
      `Language: ${currentLanguage.name} (Version: ${currentLanguage.version})`,
      `Curriculum Scope: ${selectedLevel}`,
      `Preparation Horizon: ${currentHorizonObj.title} (${currentHorizonObj.hours} • ${currentHorizonObj.badgeText})`,
      `Estimated Target Completion: ${targetDateFormatted}`,
      `Total Estimated Volume: ~${currentHorizonObj.totalHours} study hours`,
      `Pacing Guidance: ${currentHorizonObj.paceAdvice}`,
      `Paradigm: ${currentLanguage.paradigm}`,
      `Compilers / Runtimes: ${currentLanguage.compilerRuntime}`,
      `Industry Use Cases: ${currentLanguage.industryUse}`,
      `Top Hiring Companies: ${currentLanguage.topCompanies.join(", ")}`,
      `Checklist Completion: ${masteryScore}% (${completedCount}/${totalTopicsCount} topics checked)`,
      `Knowledge Check Status: ${passedQuizzes[currentLanguage.id] ? "VERIFIED SPECIALIST (Passed)" : "Pending"}`,
      `Official Docs: ${currentLanguage.officialDocs}`,
      `Interactive Exercises: ${currentLanguage.interactiveLearn}`,
      "==================================================================",
      "",
      "--- COMPLETE MULTI-PHASE SYLLABUS & SCHEDULE BREAKDOWN ---",
      "",
      ...currentPhases.flatMap((phase, idx) => {
        const pTimeline = getPhaseTimeline(idx);
        return [
          `------------------------------------------------------------------`,
          `PHASE ${idx + 1}: ${phase.phase.toUpperCase()}`,
          `Timeline Window: ${pTimeline.weekLabel} (${pTimeline.daysLabel}) | Target: ${pTimeline.hoursLabel}`,
          `Schedule Focus: ${pTimeline.scheduleBreakdown.map((s) => `${s.period}: ${s.focus}`).join(" | ")}`,
          `------------------------------------------------------------------`,
          "Key Milestone Topics:",
          ...phase.topics.map(
            (t) => `  [${completedTasks[t.id] ? "COMPLETED" : "PENDING"}] ${t.title}\n      Detail: ${t.detail}`
          ),
          "",
          `Practical Hands-on Project:\n  ${phase.project}`,
          "",
          `Technical Interview Drill:\n  ${phase.drillQuestion}`,
          "",
        ];
      }),
      "==================================================================",
      `Curriculum generated from Student Placement & Learning Hub.`,
      "==================================================================",
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${currentLanguage.id}-placement-master-curriculum.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const isLanguageVerified = !!passedQuizzes[currentLanguage.id];

  return (
    <div className="language-roadmap-container">
      {/* Top Banner Card */}
      <div className="lang-header-card">
        <div className="lang-header-top">
          <div className="lang-badge-row">
            <span className="lang-pill-primary">
              <Terminal size={13} className="text-indigo-400" />
              PROGRAMMING LANGUAGE CURRICULUM HUB
            </span>
            <span className="lang-pill-secondary">
              <Code2 size={13} className="text-violet-400" />
              {programmingLanguages.length} Languages Supported
            </span>
            {isLanguageVerified && (
              <span className="lang-pill-verified">
                <Trophy size={13} className="text-amber-300" />
                Verified {currentLanguage.name} Specialist
              </span>
            )}
            {studentData?.personalInfo?.fullName && (
              <span className="lang-pill-subtle">
                Prepared for: <strong>{studentData.personalInfo.fullName}</strong>
              </span>
            )}
          </div>

          <div className="lang-actions-top">
            <button
              type="button"
              className="lang-btn-secondary"
              onClick={resetProgress}
              title="Reset checklist progress for this language"
            >
              <RotateCcw size={14} />
              Reset Checklist
            </button>
            <button
              type="button"
              className="lang-btn-primary"
              onClick={downloadDossier}
              title="Download full language syllabus dossier"
            >
              <Download size={14} />
              Download Curriculum
            </button>
          </div>
        </div>

        <div className="lang-header-content">
          <div>
            <h1 className="lang-main-title">
              Programming Language Learning & Placement Roadmaps
            </h1>
            <p className="lang-main-desc">
              Study any programming language across progressive phases—from ubiquitous placement staples (Python, Java, C++, C, Go, Rust, JavaScript, TypeScript, C#) to specialized systems, functional, scientific, and emerging languages (Zig, Julia, Elixir, Haskell, Clojure, Solidity, Assembly, COBOL, Lua, and more).
            </p>
          </div>

          {/* Language Mastery Gauge */}
          <div className="mastery-gauge-card">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Award size={14} className="text-amber-400" />
                {currentLanguage.name} Progress
              </span>
              <span className="px-2 py-0.5 rounded-full border text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border-emerald-500/30">
                {currentPhases.length} Phases Active
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {masteryScore}%
              </span>
              <span className="text-xs text-slate-400">
                ({completedCount} of {totalTopicsCount} topics checked)
              </span>
            </div>

            <div className="mastery-bar-track mt-3">
              <div
                className="mastery-bar-fill"
                style={{ width: `${masteryScore}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 mt-2">
              <span>Horizon: {currentHorizonObj.title}</span>
              <span>{totalTopicsCount - completedCount} topics left</span>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Section */}
        <div className="search-filter-section">
          {/* Search Input Bar */}
          <div className="search-input-wrapper">
            <Search size={16} className="text-slate-400 search-icon" />
            <input
              type="text"
              className="lang-search-input"
              placeholder="Search any language (e.g. Python, Rust, Zig, Go, Haskell, COBOL, Assembly, Julia, Web3)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="category-filter-pills">
            {languageCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-pill ${selectedCategory === cat.id ? "category-pill-active" : ""}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Language Selection Grid */}
        <div className="languages-scroll-grid">
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map((lang) => {
              const isSelected = selectedLanguageId === lang.id;
              const hasPassed = !!passedQuizzes[lang.id];
              return (
                <button
                  key={lang.id}
                  type="button"
                  className={`language-pill-btn ${isSelected ? "language-pill-active" : ""}`}
                  onClick={() => handleSelectLanguage(lang.id)}
                >
                  <span className="lang-pill-name">{lang.name}</span>
                  {hasPassed ? (
                    <span className="lang-pill-badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      ✓ Verified
                    </span>
                  ) : (
                    <span className="lang-pill-badge">{lang.badge}</span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="no-languages-found">
              <HelpCircle size={16} />
              <span>No language matches "{searchQuery}". Try clearing the search or switching categories.</span>
            </div>
          )}
        </div>
      </div>

      {/* Selected Language Deep-Dive Profile Banner */}
      <div className="selected-lang-hero-card">
        <div className="lang-hero-header">
          <div className="flex items-center gap-3">
            <div className="lang-hero-avatar">
              <Code2 size={24} className="text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="lang-hero-title">{currentLanguage.name}</h2>
                <span className="lang-version-pill">{currentLanguage.version}</span>
                <span className="lang-category-pill">{currentLanguage.difficulty}</span>
                {isLanguageVerified && (
                  <span className="lang-passed-badge">
                    <Trophy size={11} className="text-amber-300" /> Verified Specialist
                  </span>
                )}
              </div>
              <p className="lang-hero-paradigm">{currentLanguage.paradigm}</p>
            </div>
          </div>

          {/* Action Resource Buttons with Explanation Tooltip Toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative group">
              <a
                href={currentLanguage.officialDocs}
                target="_blank"
                rel="noreferrer"
                className="lang-resource-btn"
                title="Open the official language specification and reference docs"
              >
                <BookOpen size={13} />
                Official Documentation
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="relative group">
              <a
                href={currentLanguage.interactiveLearn}
                target="_blank"
                rel="noreferrer"
                className="lang-resource-btn"
                title="Open interactive hands-on coding exercises on Exercism"
              >
                <Zap size={13} className="text-amber-400" />
                Practice Track
                <ExternalLink size={12} />
              </a>
            </div>

            <button
              type="button"
              className="lang-quiz-trigger-btn"
              onClick={() => setQuizActive(!quizActive)}
            >
              <Award size={14} className="text-amber-300" />
              {quizActive ? "Hide Knowledge Quiz" : "Take Knowledge Check Quiz"}
            </button>
          </div>
        </div>

        {/* Educational Callout explaining the two resource buttons */}
        <div className="resource-explanation-callout">
          <Info size={14} className="text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-indigo-200">How to use these two resources:</strong>
            <span className="block mt-0.5">
              • <strong>Official Documentation:</strong> The authoritative source of truth created by the language authors. Use this to study exact language specifications, standard libraries, compiler flags, and memory behavior tested in campus technical interviews.
            </span>
            <span className="block mt-0.5">
              • <strong>Practice Track:</strong> Test-driven, hands-on coding challenges (via Exercism / interactive sandboxes). Use this to write real code, run automated unit test suites, and build muscle memory before your placement drive.
            </span>
          </div>
        </div>

        <p className="lang-hero-desc mt-3">{currentLanguage.description}</p>

        {/* Language Meta Metrics Bar */}
        <div className="lang-meta-grid">
          <div className="meta-item">
            <span className="meta-label">PRIMARY INDUSTRY USES</span>
            <span className="meta-value">{currentLanguage.industryUse}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">COMPILERS & RUNTIMES</span>
            <span className="meta-value">{currentLanguage.compilerRuntime}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">TOP HIRING RECRUITERS</span>
            <span className="meta-value text-indigo-300 font-semibold">
              {currentLanguage.topCompanies.join(", ")}
            </span>
          </div>

          <div className="meta-item">
            <span className="meta-label">KEY ECOSYSTEM TOOLS</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {currentLanguage.keyEcosystem.map((eco, idx) => (
                <span key={idx} className="ecosystem-tag">
                  {eco}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Top Recommended Places to Study This Language */}
        <div className="study-hubs-container">
          <div className="study-hubs-title">
            <BookOpen size={14} className="text-indigo-400" />
            <span>TOP RECOMMENDED PLACES TO STUDY {currentLanguage.name.toUpperCase()} (FREE PORTALS)</span>
          </div>

          <div className="study-links-row">
            <a
              href={studyResources.videoCourse.url}
              target="_blank"
              rel="noreferrer"
              className="study-pill-link"
              title="Watch full curated video course"
            >
              <span className="study-pill-icon">▶</span>
              <span className="truncate">{studyResources.videoCourse.name}</span>
              <ExternalLink size={11} className="shrink-0 text-slate-400" />
            </a>

            <a
              href={studyResources.onlineCompiler.url}
              target="_blank"
              rel="noreferrer"
              className="study-pill-link"
              title="Run code in browser without installing anything"
            >
              <span className="study-pill-icon">💻</span>
              <span className="truncate">{studyResources.onlineCompiler.name}</span>
              <ExternalLink size={11} className="shrink-0 text-slate-400" />
            </a>

            <a
              href={studyResources.interactiveGuide.url}
              target="_blank"
              rel="noreferrer"
              className="study-pill-link"
              title="Step-by-step interactive documentation"
            >
              <span className="study-pill-icon">📖</span>
              <span className="truncate">{studyResources.interactiveGuide.name}</span>
              <ExternalLink size={11} className="shrink-0 text-slate-400" />
            </a>

            <a
              href={studyResources.cheatSheet.url}
              target="_blank"
              rel="noreferrer"
              className="study-pill-link"
              title="Quick reference cheat sheet"
            >
              <span className="study-pill-icon">⚡</span>
              <span className="truncate">{studyResources.cheatSheet.name}</span>
              <ExternalLink size={11} className="shrink-0 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Level and Timeline Selection Controls */}
        <div className="lang-config-bar">
          {/* Experience Level Selector */}
          <div className="config-group">
            <label className="config-label">
              <Compass size={13} className="text-indigo-400" />
              CURRICULUM SCOPE:
            </label>
            <div className="level-btn-group">
              {experienceLevels.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  className={`level-btn ${selectedLevel === lvl ? "level-btn-active" : ""}`}
                  onClick={() => handleSelectLevel(lvl)}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Horizon Selector */}
          <div className="config-group">
            <label className="config-label">
              <Clock size={13} className="text-violet-400" />
              PREPARATION TIMELINE HORIZON:
            </label>
            <div className="horizon-btn-group">
              {timelineHorizons.map((h) => (
                <button
                  key={h.value}
                  type="button"
                  className={`horizon-btn ${selectedHorizon === h.value ? "horizon-btn-active" : ""}`}
                  onClick={() => handleSelectHorizon(h.value)}
                >
                  <span className="font-semibold">{h.title}</span>
                  <span className="horizon-hours">{h.hours}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Preparation Timeline Horizon Banner & Weekly Schedule */}
      <div className="timeline-horizon-banner animate-fade-in">
        <div className="timeline-horizon-header">
          <div className="flex items-center gap-3">
            <div className="timeline-icon-box">
              <Calendar size={20} className="text-violet-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-extrabold text-white">
                  {currentHorizonObj.title} Roadmap & Schedule
                </h3>
                <span className="horizon-badge-pill">
                  {currentHorizonObj.badgeText}
                </span>
                <span className="horizon-live-pill">
                  Active Cadence
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {currentHorizonObj.description}
              </p>
            </div>
          </div>

          <div className="horizon-stats-row">
            <div className="horizon-stat-item">
              <span className="horizon-stat-label">Daily Target</span>
              <span className="horizon-stat-value text-sky-400 font-bold">{currentHorizonObj.hours}</span>
            </div>
            <div className="horizon-stat-item">
              <span className="horizon-stat-label">Total Volume</span>
              <span className="horizon-stat-value text-indigo-300 font-bold">~{currentHorizonObj.totalHours} hrs</span>
            </div>
            <div className="horizon-stat-item">
              <span className="horizon-stat-label">Target Completion</span>
              <span className="horizon-stat-value text-emerald-400 font-bold">{targetDateFormatted}</span>
            </div>
          </div>
        </div>

        {/* Weekly Milestone Track */}
        <div className="timeline-weeks-container">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5 px-1 flex-wrap gap-2">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Target size={14} className="text-violet-400" />
              {currentHorizonObj.weeksCount}-Week Milestone Cadence (Click week to jump directly to Phase)
            </span>
            <span className="text-[11px] text-violet-300 bg-violet-950/40 border border-violet-500/30 px-2.5 py-1 rounded-full">
              Pacing: <strong>{currentHorizonObj.paceAdvice}</strong>
            </span>
          </div>

          <div className="timeline-weeks-scroll">
            {weeksList.map((w) => (
              <button
                key={w.weekNum}
                type="button"
                className={`week-milestone-card week-status-${w.status}`}
                onClick={() => scrollToPhase(w.phaseIdx)}
                title={`Click to jump to Phase ${w.phaseIdx + 1} (${w.phaseName})`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="week-number">W0{w.weekNum}</span>
                  {w.status === "completed" && <CheckCircle2 size={13} className="text-emerald-400" />}
                  {w.status === "in-progress" && <span className="week-dot-active" />}
                </div>
                <span className="week-phase-tag">Phase 0{w.phaseIdx + 1}</span>
                <div className="week-progress-bar">
                  <div className="week-progress-fill" style={{ width: `${w.progressPct}%` }} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Quiz / Knowledge Assessment Section */}
      {quizActive && (
        <div className="quiz-container-card animate-fade-in">
          <div className="quiz-header">
            <div className="flex items-center gap-2">
              <Award size={20} className="text-amber-400" />
              <div>
                <h3 className="text-base font-extrabold text-white">
                  {currentLanguage.name} Knowledge Check & Technical Quiz
                </h3>
                <p className="text-xs text-slate-400">
                  5 Placement-Grade Technical Multiple Choice Questions • Passing Score: 60% (3/5)
                </p>
              </div>
            </div>

            {quizSubmitted && (
              <div className="quiz-result-pill">
                <span className={`font-bold ${quizScore >= 60 ? "text-emerald-400" : "text-amber-400"}`}>
                  Score: {quizScore}% {quizScore >= 60 ? "— PASSED! 🏆" : "— Need Revision"}
                </span>
              </div>
            )}
          </div>

          <div className="quiz-questions-list space-y-6 mt-4">
            {currentQuizQuestions.map((q, qIdx) => {
              const selectedOption = quizAnswers[qIdx];
              const isCorrect = selectedOption === q.correctIndex;

              return (
                <div key={q.id} className="quiz-question-box">
                  <div className="flex items-start gap-2.5 mb-3">
                    <span className="question-number-badge">Q{qIdx + 1}</span>
                    <h4 className="text-sm font-bold text-white leading-snug">{q.question}</h4>
                  </div>

                  <div className="options-grid space-y-2">
                    {q.options.map((opt, optIdx) => {
                      let optionClass = "quiz-option-btn";
                      if (quizSubmitted) {
                        if (optIdx === q.correctIndex) {
                          optionClass += " option-correct";
                        } else if (selectedOption === optIdx && !isCorrect) {
                          optionClass += " option-wrong";
                        }
                      } else if (selectedOption === optIdx) {
                        optionClass += " option-selected";
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          className={optionClass}
                          onClick={() => selectQuizAnswer(qIdx, optIdx)}
                          disabled={quizSubmitted}
                        >
                          <span className="option-letter">{String.fromCharCode(65 + optIdx)}</span>
                          <span className="option-text">{opt}</span>
                          {quizSubmitted && optIdx === q.correctIndex && (
                            <CheckCircle size={15} className="text-emerald-400 ml-auto shrink-0" />
                          )}
                          {quizSubmitted && selectedOption === optIdx && !isCorrect && (
                            <XCircle size={15} className="text-rose-400 ml-auto shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Detailed Pedagogical Explanation after submission */}
                  {quizSubmitted && (
                    <div className={`mt-3 p-3 rounded-lg text-xs leading-relaxed border ${isCorrect ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200" : "bg-slate-900 border-indigo-500/30 text-slate-300"}`}>
                      <strong className="block text-indigo-300 mb-1">
                        {isCorrect ? "✓ Correct Answer Rationale:" : "ℹ Technical Explanation:"}
                      </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quiz Action Footer */}
          <div className="quiz-footer mt-6 flex justify-between items-center pt-4 border-t border-slate-700/60">
            <span className="text-xs text-slate-400">
              {Object.keys(quizAnswers).length} of {currentQuizQuestions.length} answered
            </span>

            <div className="flex items-center gap-3">
              {quizSubmitted ? (
                <button
                  type="button"
                  className="lang-btn-secondary"
                  onClick={() => {
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                  }}
                >
                  <RefreshCw size={14} /> Retake Quiz
                </button>
              ) : (
                <button
                  type="button"
                  className="lang-btn-primary"
                  disabled={Object.keys(quizAnswers).length === 0}
                  onClick={submitQuiz}
                >
                  <Check size={14} /> Submit & Evaluate
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Structured Curriculum Phases */}
      <div className="curriculum-phases-section mt-6">
        <div className="curriculum-header">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              {currentLanguage.name} — Complete Multi-Phase Curriculum ({currentPhases.length} Phases)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {currentPhases.length} Phases • {totalTopicsCount} Milestone Topics
          </span>
        </div>

        <div className="phases-list space-y-6">
          {currentPhases.map((phase, pIdx) => {
            const phaseCompleted = phase.topics.filter((t) => !!completedTasks[t.id]).length;
            const phaseProgress = Math.round((phaseCompleted / phase.topics.length) * 100);
            const phaseTimeline = getPhaseTimeline(pIdx);

            return (
              <div key={pIdx} id={`phase-card-${pIdx}`} className="phase-card transition-all duration-300">
                {/* Phase Header */}
                <div className="phase-card-header">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="phase-badge">Phase 0{pIdx + 1}</span>
                      <span className="phase-timeline-badge">
                        <Clock size={11} className="text-violet-400" />
                        {phaseTimeline.weekLabel} ({phaseTimeline.daysLabel}) • {phaseTimeline.hoursLabel}
                      </span>
                      <span className="phase-pace-badge">
                        {currentHorizonObj.hours}
                      </span>
                    </div>
                    <h4 className="phase-heading">{phase.phase}</h4>
                  </div>

                  <div className="phase-completion-stat">
                    <span>
                      {phaseCompleted}/{phase.topics.length} Completed ({phaseProgress}%)
                    </span>
                    <div className="phase-mini-track">
                      <div
                        className="phase-mini-fill"
                        style={{ width: `${phaseProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Timeline Horizon Schedule Strip for this Phase */}
                <div className="phase-schedule-strip">
                  <div className="phase-schedule-strip-header">
                    <div className="flex items-center gap-1.5 text-violet-300 font-bold text-xs uppercase tracking-wider">
                      <Calendar size={13} className="text-violet-400" />
                      <span>{currentHorizonObj.title} Timeline Allocation: {phaseTimeline.weekLabel}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Target Study: <strong className="text-slate-200">{currentHorizonObj.hours}</strong> ({phaseTimeline.hoursLabel} total)
                    </span>
                  </div>
                  <div className="phase-schedule-milestones">
                    {phaseTimeline.scheduleBreakdown.map((item, sIdx) => (
                      <div key={sIdx} className="phase-schedule-milestone-pill">
                        <span className="milestone-period">{item.period}</span>
                        <span className="milestone-focus">{item.focus}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phase Content Split */}
                <div className="phase-content-grid">
                  {/* Topic Checklists */}
                  <div className="phase-topics-col">
                    <span className="col-label">TOPIC CHECKLIST (CLICK TO COMPLETE)</span>
                    <div className="topics-list space-y-2 mt-2">
                      {phase.topics.map((topic) => {
                        const isDone = !!completedTasks[topic.id];
                        return (
                          <div
                            key={topic.id}
                            className={`topic-checkbox-row ${isDone ? "topic-row-done" : ""}`}
                            onClick={() => toggleTask(topic.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                toggleTask(topic.id);
                              }
                            }}
                          >
                            <div className={`checkbox-box ${isDone ? "checkbox-box-checked" : ""}`}>
                              {isDone && <Check size={12} strokeWidth={3} />}
                            </div>
                            <div className="topic-text-content">
                              <span className="topic-title">{topic.title}</span>
                              <p className="topic-detail">{topic.detail}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Practical Project & Interview Drill */}
                  <div className="phase-actions-col space-y-4">
                    {/* Practical Task */}
                    <div className="action-card project-card">
                      <div className="action-card-header">
                        <Code2 size={15} className="text-emerald-400" />
                        <span className="font-bold text-xs uppercase tracking-wider text-emerald-300">
                          Hands-on Project Deliverable
                        </span>
                      </div>
                      <p className="text-xs text-emerald-100/90 leading-relaxed mt-2">
                        {phase.project}
                      </p>
                    </div>

                    {/* Interview Drill */}
                    <div className="action-card drill-card">
                      <div className="action-card-header">
                        <Star size={15} className="text-amber-400" />
                        <span className="font-bold text-xs uppercase tracking-wider text-amber-300">
                          Technical Interview Drill Question
                        </span>
                      </div>
                      <p className="text-xs text-amber-100/90 leading-relaxed mt-2">
                        {phase.drillQuestion}
                      </p>
                    </div>

                    {/* Where to Study This Phase */}
                    <div className="action-card study-phase-card">
                      <div className="action-card-header">
                        <BookOpen size={15} className="text-indigo-400" />
                        <span className="font-bold text-xs uppercase tracking-wider text-indigo-300">
                          Where to Study This Phase
                        </span>
                      </div>
                      <div className="phase-links-list space-y-1.5 mt-2">
                        {((studyResources.phasesResources && studyResources.phasesResources[pIdx % studyResources.phasesResources.length]) || [
                          { name: `${currentLanguage.name} Phase ${pIdx + 1} Video Tutorial`, url: studyResources.videoCourse.url, type: "Video" },
                          { name: `${currentLanguage.name} Documentation & Reference`, url: currentLanguage.officialDocs, type: "Docs" }
                        ]).map((link, lIdx) => (
                          <a
                            key={lIdx}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="phase-study-item-link"
                          >
                            <span className="phase-link-type-badge">{link.type}</span>
                            <span className="truncate text-xs text-slate-200">{link.name}</span>
                            <ExternalLink size={11} className="shrink-0 text-slate-400 ml-auto" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
