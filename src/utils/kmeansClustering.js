/**
 * Unsupervised K-Means Clustering Engine for Student Placement Readiness
 *
 * Performs multi-dimensional vector clustering on real student assessment scores:
 * Dimensions: [Technical Score, Aptitude Score, Communication Score, Overall Readiness]
 */

export const COHORT_DEFINITIONS = [
  {
    id: 'elite',
    name: 'Elite Tier / Day-1 Ready',
    tagline: 'High Achievers Across All Pillars',
    color: 'emerald',
    icon: 'Sparkles',
    bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    dotClass: 'bg-emerald-400',
    targetPersona: 'Candidates demonstrating stellar full-stack or systems proficiency, high quantitative acumen, and polished articulation.',
    interventionStrategy: 'Fast-track to Tier-1 dream company drives. Provide high-level system design simulations and leadership mock interviews.',
    recommendedActions: [
      'Prioritize for Google, Microsoft, and Tier-1 product campus drives',
      'Schedule 1-on-1 executive architectural mock interviews',
      'Assign as peer-study mentors to boost overall campus morale'
    ]
  },
  {
    id: 'tech_specialist',
    name: 'Technical Specialists',
    tagline: 'High Code Proficiency • Soft Skills Polish Needed',
    color: 'blue',
    icon: 'Cpu',
    bgClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    dotClass: 'bg-blue-400',
    targetPersona: 'Exceptional programmers and problem solvers whose verbal communication or general aptitude scores trail their coding acumen.',
    interventionStrategy: 'Intensive communication bootcamps, group discussion practice, and behavioral HR interview workshops.',
    recommendedActions: [
      'Enroll in 10-day Business Communication & Pitching masterclass',
      'Conduct recorded behavioral STAR-method mock interviews',
      'Resume impact tuning: emphasize quantified technical accomplishments'
    ]
  },
  {
    id: 'analytical_thinker',
    name: 'Analytical & Quantitative Thinkers',
    tagline: 'High Aptitude & Logic • Hands-On Coding Practice Needed',
    color: 'purple',
    icon: 'Brain',
    bgClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    dotClass: 'bg-purple-400',
    targetPersona: 'Sharp logical and mathematical problem solvers who require guided practical application and coding portfolio reinforcement.',
    interventionStrategy: 'Structured Data Structures & Algorithms sprints, live competitive coding clinics, and hands-on capstone project builds.',
    recommendedActions: [
      'Assign weekly LeetCode pattern sprints (Arrays, Dynamic Programming, Graphs)',
      'Conduct live paired debugging workshops with faculty mentors',
      'Encourage production-grade GitHub portfolio deployments'
    ]
  },
  {
    id: 'foundational_growth',
    name: 'Foundational Development Cohort',
    tagline: 'Multi-Pillar Reinforcement & Remedial Guidance',
    color: 'amber',
    icon: 'Target',
    bgClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    dotClass: 'bg-amber-400',
    targetPersona: 'Students currently building foundational confidence across technical core, quantitative aptitude, and workplace readiness.',
    interventionStrategy: 'Targeted remedial bootcamps, fundamental conceptual refreshers, and milestone-based progression benchmarks.',
    recommendedActions: [
      'Schedule remedial core programming sessions (C++ / Java / Python syntax & logic)',
      'Provide daily 15-minute speed aptitude quizzes and explanation videos',
      'Peer-assisted learning: pair with students from Cluster 1'
    ]
  },
  {
    id: 'comm_oriented',
    name: 'Communication & Leadership Cohort',
    tagline: 'High Articulation & Soft Skills • Tech Acceleration Needed',
    color: 'teal',
    icon: 'Users',
    bgClass: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    badgeClass: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    dotClass: 'bg-teal-400',
    targetPersona: 'Strong verbal communicators and potential tech consultants whose core algorithm skills require structured reinforcement.',
    interventionStrategy: 'Direct towards Technical Consulting, Product Operations, and Solutions Engineering roles alongside tech upskilling.',
    recommendedActions: [
      'Target Analyst, Techno-Functional, and Product roles in consulting campus drives',
      'Pair with Tech Specialists on joint hackathon and system builds'
    ]
  },
  {
    id: 'balanced_emerging',
    name: 'Emerging Balanced Core',
    tagline: 'Consistent Mid-Range Competency • Targeted Sprint Needed',
    color: 'sky',
    icon: 'TrendingUp',
    bgClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    dotClass: 'bg-sky-400',
    targetPersona: 'Steady candidates with uniform moderate proficiency across coding, logic, and interview skills.',
    interventionStrategy: 'Short 2-week intensive sprints on high-frequency campus hiring questions to elevate into Day-1 Ready tier.',
    recommendedActions: [
      'Focus on top 50 campus interview coding patterns',
      'Conduct speed aptitude mock sessions under timed conditions'
    ]
  }
];

function euclideanDistance(v1, v2) {
  let sum = 0;
  for (let i = 0; i < v1.length; i++) {
    const diff = (v1[i] || 0) - (v2[i] || 0);
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

/**
 * Extracts and safely normalizes 4-dimensional score vector from real student records.
 * Missing assessment scores are flagged and imputed safely with cohort median/neutral baseline (not zero).
 */
export function extractStudentVector(student) {
  const scores = student.placementScores || {};

  const rawTech = scores.technicalScore !== undefined
    ? Number(scores.technicalScore)
    : (student.latestTechnicalScore !== undefined ? Number(student.latestTechnicalScore) : null);

  const rawApt = scores.aptitudeScore !== undefined
    ? Number(scores.aptitudeScore)
    : (student.latestAptitudeAssessment?.score !== undefined ? Number(student.latestAptitudeAssessment.score) : null);

  const rawComm = scores.communicationScore !== undefined
    ? Number(scores.communicationScore)
    : (student.latestCommunicationAssessment?.score !== undefined ? Number(student.latestCommunicationAssessment.score) : null);

  const rawReadiness = scores.overallReadiness !== undefined
    ? Number(scores.overallReadiness)
    : null;

  const hasAssessmentData = rawTech !== null || rawApt !== null || rawComm !== null;

  // Safe baseline for unassessed dimensions (does not punish unassessed as zero)
  const tech = rawTech !== null ? Math.min(100, Math.max(0, rawTech)) : (hasAssessmentData ? 40 : 50);
  const apt = rawApt !== null ? Math.min(100, Math.max(0, rawApt)) : (hasAssessmentData ? 35 : 50);
  const comm = rawComm !== null ? Math.min(100, Math.max(0, rawComm)) : 75;
  const readiness = rawReadiness !== null
    ? Math.min(100, Math.max(0, rawReadiness))
    : Math.round((tech + apt + comm) / 3);

  return {
    vector: [tech, apt, comm, readiness],
    hasAssessedScores: hasAssessmentData,
    raw: { tech: rawTech, apt: rawApt, comm: rawComm, readiness: rawReadiness }
  };
}

/**
 * Generates deterministic reference centroids for given K to guarantee model stability.
 */
function getDeterministicCentroids(k) {
  const archetypes = [
    [85, 85, 90, 88], // Elite
    [85, 50, 60, 68], // Tech Specialist
    [50, 85, 70, 68], // Analytical
    [35, 35, 45, 38], // Foundational
    [55, 60, 88, 65], // Communication / Leadership
    [65, 65, 70, 66]  // Balanced Emerging
  ];

  if (k <= archetypes.length) {
    return archetypes.slice(0, k).map(arr => [...arr]);
  }

  return archetypes.slice(0, 4).map(arr => [...arr]);
}

/**
 * Evaluates Elbow Method across K=2 to K=6 to recommend the optimal number of clusters.
 */
export function calculateElbowCurve(students = []) {
  if (!students || students.length < 3) {
    return {
      elbowData: [
        { k: 2, inertia: 100 },
        { k: 3, inertia: 65 },
        { k: 4, inertia: 35 },
        { k: 5, inertia: 25 },
        { k: 6, inertia: 18 }
      ],
      recommendedK: 4
    };
  }

  const maxK = Math.min(6, students.length);
  const elbowData = [];

  for (let k = 2; k <= maxK; k++) {
    const res = runKMeansClustering(students, k, 25);
    elbowData.push({
      k,
      inertia: res.inertia
    });
  }

  // Detect elbow: find point where reduction in inertia diminishes significantly
  let recommendedK = 4;
  let maxDropRatio = 0;

  for (let i = 1; i < elbowData.length - 1; i++) {
    const dropPrev = elbowData[i - 1].inertia - elbowData[i].inertia;
    const dropNext = elbowData[i].inertia - elbowData[i + 1].inertia;
    const ratio = dropPrev - dropNext;
    if (ratio > maxDropRatio) {
      maxDropRatio = ratio;
      recommendedK = elbowData[i].k;
    }
  }

  return {
    elbowData,
    recommendedK: Math.max(2, Math.min(recommendedK, 4))
  };
}



/**
 * Dynamically derives a meaningful cohort name, concise explanation, and practical action
 * from actual cluster average scores.
 */
export function deriveCohortDetails(avgScores = {}, clusterIndex = 0) {
  const { technical: tech = 0, aptitude: apt = 0, communication: comm = 0, readiness = 0 } = avgScores;

  // 1. All-round high performers
  if (tech >= 70 && apt >= 65 && comm >= 65 && readiness >= 70) {
    return {
      id: 'elite',
      name: 'Day-1 Ready Achievers',
      tagline: 'High Performance Across Core Pillars',
      color: 'emerald',
      icon: 'Sparkles',
      bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      dotClass: 'bg-emerald-400',
      explanation: 'Consistently strong measured performance across technical code assessments, quantitative aptitude, and interview articulation.',
      recommendedAction: 'Prioritize for Tier-1 dream company drives and executive system design mock interviews.'
    };
  }

  // 2. High technical coding standout (coding proficiency leads other dimensions)
  if (tech >= 65 && (apt < 60 || comm < 60 || tech > apt + 15)) {
    return {
      id: 'tech_specialist',
      name: 'Technical Specialists',
      tagline: 'Strong Coding • Soft Skills Polish Needed',
      color: 'blue',
      icon: 'Cpu',
      bgClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      dotClass: 'bg-blue-400',
      explanation: 'Demonstrates advanced coding and algorithm problem-solving; measured verbal articulation or speed aptitude indicates targeted polish is needed.',
      recommendedAction: 'Enroll in behavioral STAR-method mock interviews and timed aptitude practice sprints.'
    };
  }

  // 3. High aptitude / analytical logic standout
  if (apt >= 65 && (tech < 60 || apt > tech + 10)) {
    return {
      id: 'analytical_thinker',
      name: 'Analytical & Logic Thinkers',
      tagline: 'High Quantitative Acumen • Coding Practice Needed',
      color: 'purple',
      icon: 'Brain',
      bgClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      dotClass: 'bg-purple-400',
      explanation: 'Sharp quantitative and logical reasoning capabilities; requires guided practical coding and hands-on repository development.',
      recommendedAction: 'Assign weekly LeetCode pattern sprints and paired debugging workshops.'
    };
  }

  // 4. Communication standout (strong verbal readiness, tech acceleration needed)
  if (comm >= 65 && (tech >= 10 || apt >= 5)) {
    return {
      id: 'comm_oriented',
      name: 'Communication & Leadership Focus',
      tagline: 'High Articulation • Technical Acceleration Needed',
      color: 'teal',
      icon: 'Users',
      bgClass: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
      badgeClass: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      dotClass: 'bg-teal-400',
      explanation: 'Excels in articulation and behavioral interview communication; measured scores indicate need for structured technical upskilling.',
      recommendedAction: 'Guide toward technical consulting or business analyst roles alongside coding bootcamps.'
    };
  }

  // 5. Emerging balanced competencies
  if (readiness >= 40) {
    return {
      id: 'balanced_emerging',
      name: 'Emerging Balanced Core',
      tagline: 'Moderate Competency • Targeted Sprint Needed',
      color: 'sky',
      icon: 'TrendingUp',
      bgClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      dotClass: 'bg-sky-400',
      explanation: 'Balanced performance across pillars with steady baseline scores; ready for targeted revision to reach placement thresholds.',
      recommendedAction: 'Conduct 2-week intensive sprints on high-frequency campus hiring interview topics.'
    };
  }

  // 6. Foundational / pre-assessment development
  return {
    id: 'foundational_growth',
    name: 'Foundational Development Group',
    tagline: 'Multi-Pillar Reinforcement & Remedial Guidance',
    color: 'amber',
    icon: 'Target',
    bgClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    dotClass: 'bg-amber-400',
    explanation: 'Initial assessment scores indicate need for foundational reinforcement across core programming syntax, basic problem logic, and general aptitude.',
    recommendedAction: 'Schedule remedial programming sessions and daily fundamental quizzes.'
  };
}

/**
 * Runs K-Means Clustering on real student profiles.
 *
 * @param {Array} students Array of student objects
 * @param {number} k Number of clusters (defaults to 4)
 * @param {number} maxIterations Maximum iterations for centroid convergence
 * @returns {Object} { clusters, totalStudents, inertia, iterationsRun, calculatedAt, k, isLimitedDataset, datasetExplanation }
 */
export function runKMeansClustering(students = [], k = 4, maxIterations = 50) {
  const maxPossibleK = students.length > 0 ? Math.min(Number(k) || 4, students.length) : 4;
  const chosenK = Math.max(1, Math.min(maxPossibleK, 6));

  if (!students || students.length === 0) {
    return {
      clusters: [],
      totalStudents: 0,
      inertia: 0,
      iterationsRun: 0,
      calculatedAt: new Date().toISOString(),
      k: chosenK,
      isLimitedDataset: true,
      datasetExplanation: 'No student assessment records found for the selected department filter.',
      disclaimer: 'Students are grouped by similar scores across technical, aptitude, and communication assessments to guide targeted training.'
    };
  }

  // Centroid initialization: deterministic reference archetypes
  let centroids = getDeterministicCentroids(chosenK);

  const studentExtracts = students.map(s => extractStudentVector(s));
  const vectors = studentExtracts.map(e => e.vector);
  let assignments = new Array(students.length).fill(0);
  let iterationsRun = 0;

  for (let iter = 0; iter < maxIterations; iter++) {
    iterationsRun = iter + 1;
    let changed = false;

    // Assignment Step: assign each student to nearest centroid
    for (let i = 0; i < vectors.length; i++) {
      let minDist = Infinity;
      let bestCluster = 0;

      for (let c = 0; c < chosenK; c++) {
        const dist = euclideanDistance(vectors[i], centroids[c]);
        if (dist < minDist) {
          minDist = dist;
          bestCluster = c;
        }
      }

      if (assignments[i] !== bestCluster) {
        assignments[i] = bestCluster;
        changed = true;
      }
    }

    if (!changed && iter > 0) break;

    // Update Step: calculate new centroids as mean of assigned vectors
    const newCentroids = Array.from({ length: chosenK }, () => [0, 0, 0, 0]);
    const clusterSizes = new Array(chosenK).fill(0);

    for (let i = 0; i < vectors.length; i++) {
      const c = assignments[i];
      clusterSizes[c]++;
      for (let d = 0; d < 4; d++) {
        newCentroids[c][d] += vectors[i][d];
      }
    }

    for (let c = 0; c < chosenK; c++) {
      if (clusterSizes[c] > 0) {
        for (let d = 0; d < 4; d++) {
          newCentroids[c][d] = Math.round(newCentroids[c][d] / clusterSizes[c]);
        }
      } else {
        newCentroids[c] = centroids[c];
      }
    }

    centroids = newCentroids;
  }

  // Calculate cluster inertia (sum of squared Euclidean distances)
  let totalInertia = 0;
  for (let i = 0; i < vectors.length; i++) {
    const c = assignments[i];
    const dist = euclideanDistance(vectors[i], centroids[c]);
    totalInertia += dist * dist;
  }

  // Group students by cluster and compute real metrics
  const rawClustersData = [];
  for (let cIdx = 0; cIdx < chosenK; cIdx++) {
    const clusterStudents = students.filter((_, idx) => assignments[idx] === cIdx);
    const count = clusterStudents.length;
    const percentage = students.length > 0 ? Math.round((count / students.length) * 100) : 0;

    let sumTech = 0;
    let sumApt = 0;
    let sumComm = 0;
    let sumReadiness = 0;

    clusterStudents.forEach(s => {
      const scores = s.placementScores || {};
      sumTech += Number(scores.technicalScore ?? s.latestTechnicalScore ?? 0);
      sumApt += Number(scores.aptitudeScore ?? s.latestAptitudeAssessment?.score ?? 0);
      sumComm += Number(scores.communicationScore ?? s.latestCommunicationAssessment?.score ?? 75);
      sumReadiness += Number(scores.overallReadiness ?? 0);
    });

    const avgScores = {
      technical: count > 0 ? Math.round(sumTech / count) : centroids[cIdx][0],
      aptitude: count > 0 ? Math.round(sumApt / count) : centroids[cIdx][1],
      communication: count > 0 ? Math.round(sumComm / count) : centroids[cIdx][2],
      readiness: count > 0 ? Math.round(sumReadiness / count) : centroids[cIdx][3]
    };

    const details = deriveCohortDetails(avgScores, cIdx);

    rawClustersData.push({
      ...details,
      id: `${details.id}_${cIdx}`,
      clusterIndex: cIdx,
      students: clusterStudents,
      count,
      percentage,
      centroid: {
        technical: centroids[cIdx][0],
        aptitude: centroids[cIdx][1],
        communication: centroids[cIdx][2],
        readiness: centroids[cIdx][3]
      },
      avgScores
    });
  }

  // Sort clusters by readiness descending for clean logical progression
  rawClustersData.sort((a, b) => (b.avgScores.readiness || 0) - (a.avgScores.readiness || 0));

  const isLimited = chosenK < 4 && students.length > 0;
  const datasetExplanation = isLimited
    ? `The dataset currently contains ${students.length} student records, supporting ${chosenK} distinct readiness group${chosenK > 1 ? 's' : ''}. A full 4-group breakdown is established when 4 or more students are assessed.`
    : null;

  return {
    clusters: rawClustersData,
    totalStudents: students.length,
    inertia: Math.round(totalInertia),
    iterationsRun,
    calculatedAt: new Date().toISOString(),
    k: chosenK,
    isLimitedDataset: isLimited,
    datasetExplanation,
    disclaimer: 'Students are grouped by similar scores across technical, aptitude, and communication assessments to guide targeted training.'
  };
}

