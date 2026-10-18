/**
 * Unsupervised K-Means Clustering Engine for Student Placement Readiness
 *
 * Performs multi-dimensional vector clustering on real student assessment scores:
 * Dimensions: [Technical Score, Aptitude Score, Communication Score, Overall Readiness]
 */

const COHORT_DEFINITIONS = [
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
    targetPersona: 'Exceptional programmers and problem solvers whose verbal communication or general aptitude scores currently trail their coding acumen.',
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

function extractVector(student) {
  const scores = student.placementScores || {};
  const tech = Number(scores.technicalScore || student.latestTechnicalScore || 0);
  const apt = Number(scores.aptitudeScore || 0);
  const comm = Number(scores.communicationScore || 75);
  const readiness = Number(scores.overallReadiness || 0);

  return [tech, apt, comm, readiness];
}

/**
 * Runs K-Means Clustering on real student profiles.
 *
 * @param {Array} students Array of student objects
 * @param {number} k Number of clusters (defaults to 4)
 * @param {number} maxIterations Maximum iterations for centroid convergence
 * @returns {Object} { clusters, totalStudents, inertia, iterationsRun }
 */
export function runKMeansClustering(students = [], k = 4, maxIterations = 50) {
  if (!students || students.length === 0) {
    return {
      clusters: COHORT_DEFINITIONS.map(def => ({
        ...def,
        students: [],
        count: 0,
        percentage: 0,
        centroid: { technical: 0, aptitude: 0, communication: 0, readiness: 0 },
        avgScores: { technical: 0, aptitude: 0, communication: 0, readiness: 0 }
      })),
      totalStudents: 0,
      inertia: 0,
      iterationsRun: 0
    };
  }

  // Pre-seed 4 archetypal reference centroids to ensure deterministic cohort mapping
  let centroids = [
    [85, 85, 90, 88], // Elite
    [85, 50, 60, 68], // Tech Specialist
    [50, 85, 70, 68], // Analytical
    [35, 35, 45, 38]  // Foundational
  ];

  if (k !== 4) {
    // Fallback to random initialization if k differs
    centroids = [];
    for (let i = 0; i < k; i++) {
      const randIdx = Math.floor(Math.random() * students.length);
      centroids.push([...extractVector(students[randIdx])]);
    }
  }

  const vectors = students.map(s => extractVector(s));
  let assignments = new Array(students.length).fill(0);
  let iterationsRun = 0;

  for (let iter = 0; iter < maxIterations; iter++) {
    iterationsRun = iter + 1;
    let changed = false;

    // Assignment Step: assign each student to nearest centroid
    for (let i = 0; i < vectors.length; i++) {
      let minDist = Infinity;
      let bestCluster = 0;

      for (let c = 0; c < k; c++) {
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
    const newCentroids = Array.from({ length: k }, () => [0, 0, 0, 0]);
    const clusterSizes = new Array(k).fill(0);

    for (let i = 0; i < vectors.length; i++) {
      const c = assignments[i];
      clusterSizes[c]++;
      for (let d = 0; d < 4; d++) {
        newCentroids[c][d] += vectors[i][d];
      }
    }

    for (let c = 0; c < k; c++) {
      if (clusterSizes[c] > 0) {
        for (let d = 0; d < 4; d++) {
          newCentroids[c][d] = Math.round(newCentroids[c][d] / clusterSizes[c]);
        }
      } else {
        // Keep previous centroid if no students assigned to prevent collapse
        newCentroids[c] = centroids[c];
      }
    }

    centroids = newCentroids;
  }

  // Calculate cluster inertia (sum of squared distances to centroid)
  let totalInertia = 0;
  for (let i = 0; i < vectors.length; i++) {
    const c = assignments[i];
    const dist = euclideanDistance(vectors[i], centroids[c]);
    totalInertia += dist * dist;
  }

  // Group students by cluster
  const clustersData = COHORT_DEFINITIONS.slice(0, k).map((def, cIdx) => {
    const clusterStudents = students.filter((_, idx) => assignments[idx] === cIdx);
    const count = clusterStudents.length;
    const percentage = students.length > 0 ? Math.round((count / students.length) * 100) : 0;

    let sumTech = 0;
    let sumApt = 0;
    let sumComm = 0;
    let sumReadiness = 0;

    clusterStudents.forEach(s => {
      const scores = s.placementScores || {};
      sumTech += Number(scores.technicalScore || s.latestTechnicalScore || 0);
      sumApt += Number(scores.aptitudeScore || 0);
      sumComm += Number(scores.communicationScore || 75);
      sumReadiness += Number(scores.overallReadiness || 0);
    });

    const avgScores = {
      technical: count > 0 ? Math.round(sumTech / count) : centroids[cIdx][0],
      aptitude: count > 0 ? Math.round(sumApt / count) : centroids[cIdx][1],
      communication: count > 0 ? Math.round(sumComm / count) : centroids[cIdx][2],
      readiness: count > 0 ? Math.round(sumReadiness / count) : centroids[cIdx][3]
    };

    return {
      ...def,
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
    };
  });

  return {
    clusters: clustersData,
    totalStudents: students.length,
    inertia: Math.round(totalInertia),
    iterationsRun
  };
}
