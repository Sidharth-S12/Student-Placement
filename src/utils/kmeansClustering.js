/**
 * Unsupervised K-Means Clustering Engine for Student Placement Readiness
 *
 * Implements K-Means Machine Learning Clustering in coordination with the Python 3 Backend Engine.
 * Segregates students strictly into 8 strength & development clusters across Technical, Aptitude, and Communication:
 *
 * 1. Technical strong
 * 2. Communication strong
 * 3. Aptitude strong
 * 4. Technical and Aptitude strong
 * 5. Technical and Communication strong
 * 6. Communication and Aptitude strong
 * 7. Technical, Aptitude and Communication strong
 * 8. Weak in technical aptitude and communication
 */

export const COHORT_DEFINITIONS = [
  {
    id: 'tech_strong',
    name: 'Technical strong',
    tagline: 'High Technical Proficiency • Soft Skills & Aptitude Polish Needed',
    color: 'blue',
    icon: 'Cpu',
    bgClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    dotClass: 'bg-blue-400',
    targetPersona: 'Exceptional programmers and problem solvers whose technical code assessments lead their overall profile.',
    interventionStrategy: 'Intensive communication bootcamps, group discussion practice, and timed quantitative aptitude sprints.',
    recommendedActions: [
      'Enroll in 10-day Business Communication & Pitching masterclass',
      'Conduct recorded behavioral STAR-method mock interviews',
      'Daily 20-minute speed aptitude problem sets'
    ],
    initialCentroid: [85, 45, 45, 58]
  },
  {
    id: 'comm_strong',
    name: 'Communication strong',
    tagline: 'High Articulation & Soft Skills • Technical Acceleration Needed',
    color: 'teal',
    icon: 'Users',
    bgClass: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    badgeClass: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    dotClass: 'bg-teal-400',
    targetPersona: 'Strong verbal communicators, persuasive speakers, and leaders whose core coding scores require structured training.',
    interventionStrategy: 'Targeted programming bootcamps focusing on syntax fundamentals, data structures, and algorithmic logic.',
    recommendedActions: [
      'Schedule remedial core programming sessions (C++ / Java / Python)',
      'Assign fundamental algorithm pattern drills',
      'Guide toward client-facing techno-functional and consultant roles'
    ],
    initialCentroid: [45, 45, 85, 58]
  },
  {
    id: 'apt_strong',
    name: 'Aptitude strong',
    tagline: 'High Quantitative Acumen • Hands-On Coding Practice Needed',
    color: 'purple',
    icon: 'Brain',
    bgClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    dotClass: 'bg-purple-400',
    targetPersona: 'Sharp quantitative and logical reasoning thinkers who require guided practical coding and repository deployment.',
    interventionStrategy: 'Structured DSA sprints, live paired debugging clinics, and full-stack project building.',
    recommendedActions: [
      'Assign weekly LeetCode pattern sprints (Arrays, Dynamic Programming, Graphs)',
      'Conduct live paired debugging workshops with faculty mentors',
      'Deploy production-ready GitHub portfolio projects'
    ],
    initialCentroid: [45, 85, 45, 58]
  },
  {
    id: 'tech_apt_strong',
    name: 'Technical and Aptitude strong',
    tagline: 'Strong Code & Analytical Acumen • Verbal Articulation Needed',
    color: 'indigo',
    icon: 'Cpu',
    bgClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    dotClass: 'bg-indigo-400',
    targetPersona: 'High-powered analytical problem solvers with standout performance in coding and mathematics needing interview confidence.',
    interventionStrategy: 'Behavioral interview simulations, executive presentation clinics, and group discussion workshops.',
    recommendedActions: [
      '1-on-1 behavioral HR mock interviews using STAR technique',
      'Executive system architecture pitch practice',
      'Fast-track to Tier-1 engineering campus hiring rounds'
    ],
    initialCentroid: [85, 85, 45, 72]
  },
  {
    id: 'tech_comm_strong',
    name: 'Technical and Communication strong',
    tagline: 'Strong Engineering & Articulation • Aptitude Practice Needed',
    color: 'sky',
    icon: 'TrendingUp',
    bgClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    dotClass: 'bg-sky-400',
    targetPersona: 'Technocrats with articulate verbal delivery whose speed math or timed reasoning test percentiles require focused revision.',
    interventionStrategy: 'Timed speed aptitude practice series, shortcut arithmetic formulas, and pattern recognition drills.',
    recommendedActions: [
      'Daily 30-minute timed quantitative and reasoning test drills',
      'Mental math shortcuts and speed calculation workshops',
      'Prepare for product engineering and technical consulting drives'
    ],
    initialCentroid: [85, 45, 85, 72]
  },
  {
    id: 'comm_apt_strong',
    name: 'Communication and Aptitude strong',
    tagline: 'Strong Logic & Articulation • Hands-On Engineering Polish Needed',
    color: 'amber',
    icon: 'Target',
    bgClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    dotClass: 'bg-amber-400',
    targetPersona: 'Analytical communicators with sharp logical skills ideal for techno-functional consulting who need coding implementation polish.',
    interventionStrategy: 'Practical coding workshops, API integrations, and hands-on repository projects.',
    recommendedActions: [
      'Hands-on coding projects with step-by-step mentor code reviews',
      'Focus on core programming assessment test cases and edge handling',
      'Target Analyst, Techno-Functional, and Product Management campus drives'
    ],
    initialCentroid: [45, 85, 85, 72]
  },
  {
    id: 'all_strong',
    name: 'Technical, Aptitude and Communication strong',
    tagline: 'All-Round Elite Day-1 Ready • High Achievers Across All Pillars',
    color: 'emerald',
    icon: 'Sparkles',
    bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    dotClass: 'bg-emerald-400',
    targetPersona: 'Top-tier candidates demonstrating stellar performance across coding, quantitative acumen, and speech-evaluated interviews.',
    interventionStrategy: 'Fast-track to Tier-1 dream company drives. Provide high-level system design simulations and leadership mock interviews.',
    recommendedActions: [
      'Prioritize for Google, Microsoft, and Tier-1 product campus drives',
      'Schedule 1-on-1 executive architectural mock interviews',
      'Assign as peer-study mentors to boost overall campus morale'
    ],
    initialCentroid: [85, 85, 85, 85]
  },
  {
    id: 'weak_all',
    name: 'Weak in technical aptitude and communication',
    tagline: 'Foundational Remedial Focus Needed Across All Three Pillars',
    color: 'rose',
    icon: 'AlertCircle',
    bgClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    dotClass: 'bg-rose-500',
    targetPersona: 'Students requiring comprehensive baseline upskilling and milestone tracking before active placement recruitment.',
    interventionStrategy: 'Foundational coding syntax clinics, mental math and quantitative basics, plus confidence-building group discussions.',
    recommendedActions: [
      'Enroll in structured Beginner Programming Foundations bootcamp',
      'Daily 30-minute quantitative arithmetic and reasoning problem sets',
      'Attend weekly communication mentoring and speech confidence clinics'
    ],
    initialCentroid: [30, 30, 30, 30]
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
 * Extracts and normalizes 4-dimensional score vector from student records.
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

  const tech = rawTech !== null ? Math.min(100, Math.max(0, rawTech)) : (hasAssessmentData ? 45 : 50);
  const apt = rawApt !== null ? Math.min(100, Math.max(0, rawApt)) : (hasAssessmentData ? 45 : 50);
  const comm = rawComm !== null ? Math.min(100, Math.max(0, rawComm)) : (hasAssessmentData ? 45 : 50);
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
 * Asynchronously runs K-Means Clustering on the Python ML Backend Engine.
 * Falls back to client-side ML engine if the server endpoint is unreachable.
 */
export async function fetchKMeansFromPython(students = []) {
  try {
    const response = await fetch('/api/admin/kmeans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ students })
    });

    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data.clusters) && data.clusters.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('[kmeansClustering] Python backend endpoint unreachable, running client engine:', err.message);
  }

  // Client-side fallback with exact 8 groups
  return runKMeansClustering(students, 8);
}

/**
 * Runs K-Means Clustering dividing students into the 8 strength/development cohorts.
 *
 * @param {Array} students Array of student objects
 * @param {number} k Number of clusters (defaults to 8)
 * @param {number} maxIterations Maximum iterations for centroid convergence
 * @returns {Object} { clusters, totalStudents, inertia, iterationsRun, calculatedAt, k, engine }
 */
export function runKMeansClustering(students = [], k = 8, maxIterations = 50) {
  const chosenK = Math.min(8, Math.max(1, Number(k) || 8));
  const activeCohorts = COHORT_DEFINITIONS.slice(0, chosenK);

  if (!students || students.length === 0) {
    return {
      clusters: activeCohorts.map((spec, cIdx) => ({
        ...spec,
        clusterIndex: cIdx,
        students: [],
        count: 0,
        percentage: 0,
        centroid: {
          technical: spec.initialCentroid[0],
          aptitude: spec.initialCentroid[1],
          communication: spec.initialCentroid[2],
          readiness: spec.initialCentroid[3]
        },
        avgScores: {
          technical: spec.initialCentroid[0],
          aptitude: spec.initialCentroid[1],
          communication: spec.initialCentroid[2],
          readiness: spec.initialCentroid[3]
        }
      })),
      totalStudents: 0,
      inertia: 0,
      iterationsRun: 0,
      calculatedAt: new Date().toISOString(),
      k: chosenK,
      engine: 'Python-Equivalent K-Means Engine (K=7)',
      isLimitedDataset: false,
      datasetExplanation: null,
      disclaimer: 'Students are partitioned into 7 strength-based cohorts across Technical, Aptitude, and Communication assessments.'
    };
  }

  let centroids = activeCohorts.map(spec => [...spec.initialCentroid]);
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

  // Group students by cluster
  const clustersData = activeCohorts.map((spec, cIdx) => {
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

    return {
      ...spec,
      id: spec.id,
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
    };
  });

  return {
    clusters: clustersData,
    totalStudents: students.length,
    inertia: Math.round(totalInertia),
    iterationsRun,
    calculatedAt: new Date().toISOString(),
    k: chosenK,
    engine: 'Python-Equivalent K-Means Engine (K=7)',
    isLimitedDataset: false,
    datasetExplanation: null,
    disclaimer: 'Students are partitioned into 7 strength-based cohorts across Technical, Aptitude, and Communication assessments.'
  };
}
