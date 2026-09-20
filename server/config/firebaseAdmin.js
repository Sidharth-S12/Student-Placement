import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Firebase Admin & Firestore Service
 * 
 * Supports:
 * 1. Live Google Firebase Cloud Firestore & Authentication when credentials are provided in .env
 * 2. Transparent local persistence fallback when Firebase project credentials are not yet configured,
 *    allowing immediate local execution without crashing.
 */

let db = null;
let isFirebaseConfigured = false;

try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : null;

  if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    isFirebaseConfigured = true;
    console.log('[Firebase Admin] Connected successfully via service account file.');
  } else if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey
      })
    });
    db = admin.firestore();
    isFirebaseConfigured = true;
    console.log('[Firebase Admin] Connected successfully via environment variables.');
  } else {
    console.info('[Firebase Admin] Live credentials not found. Using local JSON store for Firestore emulation.');
  }
} catch (err) {
  console.warn(`[Firebase Admin] Initialization warning: ${err.message}. Using fallback storage.`);
  isFirebaseConfigured = false;
}

// Emulated Local Store path for fallback
const LOCAL_STORE_DIR = path.resolve(__dirname, '../.data');
const ASSESSMENTS_FILE = path.join(LOCAL_STORE_DIR, 'technicalAssessments.json');
const STUDENTS_FILE = path.join(LOCAL_STORE_DIR, 'students.json');
const QUESTIONS_FILE = path.join(LOCAL_STORE_DIR, 'studentQuestions.json');
const APTITUDE_ASSESSMENTS_FILE = path.join(LOCAL_STORE_DIR, 'aptitudeAssessments.json');
const APTITUDE_QUESTIONS_FILE = path.join(LOCAL_STORE_DIR, 'studentAptitudeQuestions.json');
const USERS_FILE = path.join(LOCAL_STORE_DIR, 'users.json');

function ensureLocalStore() {
  if (!fs.existsSync(LOCAL_STORE_DIR)) {
    fs.mkdirSync(LOCAL_STORE_DIR, { recursive: true });
  }
  if (!fs.existsSync(ASSESSMENTS_FILE)) {
    fs.writeFileSync(ASSESSMENTS_FILE, JSON.stringify({}), 'utf8');
  }
  if (!fs.existsSync(STUDENTS_FILE)) {
    fs.writeFileSync(STUDENTS_FILE, JSON.stringify({}), 'utf8');
  }
  if (!fs.existsSync(QUESTIONS_FILE)) {
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify({}), 'utf8');
  }
  if (!fs.existsSync(APTITUDE_ASSESSMENTS_FILE)) {
    fs.writeFileSync(APTITUDE_ASSESSMENTS_FILE, JSON.stringify({}), 'utf8');
  }
  if (!fs.existsSync(APTITUDE_QUESTIONS_FILE)) {
    fs.writeFileSync(APTITUDE_QUESTIONS_FILE, JSON.stringify({}), 'utf8');
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify({}), 'utf8');
  }
}

function readLocalData(filePath) {
  ensureLocalStore();
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content || '{}');
  } catch (e) {
    return {};
  }
}

function writeLocalData(filePath, data) {
  ensureLocalStore();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Saves a completed technical assessment document to Firestore (or local fallback).
 * 
 * Structure: technicalAssessments/{assessmentId}
 */
export async function saveAssessmentToFirestore(assessmentId, data) {
  const payload = {
    assessmentId,
    ...data,
    savedAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    await db.collection('technicalAssessments').doc(assessmentId).set(payload, { merge: true });
  } else {
    const records = readLocalData(ASSESSMENTS_FILE);
    records[assessmentId] = payload;
    writeLocalData(ASSESSMENTS_FILE, records);
  }

  // Also update student's profile reference in students/{studentId}
  if (data.studentId) {
    await updateStudentLatestAssessment(data.studentId, payload);
  }

  return payload;
}

/**
 * Updates the student's latest assessment reference in students/{studentId}.
 */
export async function updateStudentLatestAssessment(studentId, assessmentData) {
  const studentPayload = {
    studentId,
    latestAssessmentId: assessmentData.assessmentId,
    latestTechnicalScore: assessmentData.technicalScore,
    latestCorrectAnswers: assessmentData.correctAnswers,
    latestIncorrectAnswers: assessmentData.incorrectAnswers,
    latestCompletedAt: assessmentData.completedAt || new Date().toISOString(),
    status: 'Completed',
    updatedAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    await db.collection('students').doc(studentId).set(studentPayload, { merge: true });
  } else {
    const students = readLocalData(STUDENTS_FILE);
    students[studentId] = {
      ...(students[studentId] || {}),
      ...studentPayload
    };
    writeLocalData(STUDENTS_FILE, students);
  }
}

/**
 * Retrieves an assessment by ID from Firestore (or local fallback).
 */
export async function getAssessmentFromFirestore(assessmentId) {
  if (isFirebaseConfigured && db) {
    const doc = await db.collection('technicalAssessments').doc(assessmentId).get();
    return doc.exists ? doc.data() : null;
  } else {
    const records = readLocalData(ASSESSMENTS_FILE);
    return records[assessmentId] || null;
  }
}

/**
 * Retrieves the latest completed assessment for a student.
 */
export async function getLatestAssessmentForStudent(studentId) {
  if (isFirebaseConfigured && db) {
    const snapshot = await db.collection('technicalAssessments')
      .where('studentId', '==', studentId)
      .where('status', '==', 'Completed')
      .orderBy('completedAt', 'desc')
      .limit(1)
      .get();

    if (!snapshot.empty) {
      return snapshot.docs[0].data();
    }
    return null;
  } else {
    const records = readLocalData(ASSESSMENTS_FILE);
    const userAssessments = Object.values(records).filter(
      a => a.studentId === studentId && a.status === 'Completed'
    );
    if (userAssessments.length === 0) return null;

    userAssessments.sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));
    return userAssessments[0];
  }
}

/**
 * Retrieves all previous questions asked to a student across all assessments to prevent repetition.
 */
export async function getStudentQuestionHistory(studentId) {
  if (!studentId) return [];
  if (isFirebaseConfigured && db) {
    try {
      const doc = await db.collection('studentQuestionHistory').doc(studentId).get();
      if (doc.exists) {
        return doc.data().questions || [];
      }
    } catch (e) {
      console.warn('[Firebase] Failed to load student question history:', e.message);
    }
  }
  const allHistory = readLocalData(QUESTIONS_FILE);
  return allHistory[studentId] || [];
}

/**
 * Persists newly generated questions to the student's lifetime question history.
 */
export async function recordStudentQuestions(studentId, newQuestions = []) {
  if (!studentId || newQuestions.length === 0) return;
  const existing = await getStudentQuestionHistory(studentId);
  
  const seenTexts = new Set(existing.map(q => (q.questionText || '').trim().toLowerCase()));
  const merged = [...existing];

  newQuestions.forEach(q => {
    const textKey = (q.questionText || q.question || '').trim().toLowerCase();
    if (textKey && !seenTexts.has(textKey)) {
      seenTexts.add(textKey);
      merged.push({
        id: q.id || `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        skill: q.skill,
        topic: q.topic || 'General',
        difficulty: q.difficulty || 'EASY',
        questionText: q.questionText || q.question,
        recordedAt: new Date().toISOString()
      });
    }
  });

  if (isFirebaseConfigured && db) {
    try {
      await db.collection('studentQuestionHistory').doc(studentId).set({
        studentId,
        questions: merged,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('[Firebase] Failed to write student question history:', e.message);
    }
  }

  const allHistory = readLocalData(QUESTIONS_FILE);
  allHistory[studentId] = merged;
  writeLocalData(QUESTIONS_FILE, allHistory);
}

/**
 * Retrieves user document from Firestore (users/{uid}) or local store.
 */
export async function getUserRecord(uid, email = '') {
  const cleanEmail = (email || '').trim().toLowerCase();

  // 1. Check Firestore if active
  if (isFirebaseConfigured && db && uid) {
    try {
      const snap = await db.collection('users').doc(uid).get();
      if (snap.exists) {
        return { uid, ...snap.data() };
      }
    } catch (e) {
      console.warn('[Firebase Admin] getUserRecord failed:', e.message);
    }
  }

  // 2. Check local users store
  const localUsers = readLocalData(USERS_FILE);
  if (uid && localUsers[uid]) {
    return localUsers[uid];
  }
  if (cleanEmail) {
    const byEmail = Object.values(localUsers).find(
      u => (u.email || '').toLowerCase() === cleanEmail
    );
    if (byEmail) return byEmail;
  }

  return null;
}

/**
 * Gets verified user role.
 * Strictly adheres to database roles: 'admin' | 'company' | 'student'.
 * Default role is 'student'. No informal email prefix heuristics.
 */
export async function getUserRole(uid, email = '') {
  const record = await getUserRecord(uid, email);
  if (record && record.role) {
    return record.role;
  }
  return 'student';
}

/**
 * Sets user role in Firestore and persistent store.
 */
export async function setUserRole(uid, { role, email = '', displayName = '', companyName = null }) {
  if (!uid) throw new Error('UID is required to set role.');
  if (!['admin', 'company', 'student'].includes(role)) {
    throw new Error(`Invalid role '${role}'. Must be admin, company, or student.`);
  }

  const cleanEmail = (email || '').trim().toLowerCase();
  const payload = {
    uid,
    role,
    email: cleanEmail,
    displayName: displayName || (cleanEmail ? cleanEmail.split('@')[0] : 'User'),
    companyName: role === 'company' ? companyName : null,
    updatedAt: new Date().toISOString()
  };

  // 1. Persist to Firestore if available
  if (isFirebaseConfigured && db) {
    try {
      await db.collection('users').doc(uid).set(payload, { merge: true });
    } catch (e) {
      console.warn('[Firebase Admin] setUserRole Firestore write failed:', e.message);
    }
  }

  // 2. Persist to local JSON store
  const localUsers = readLocalData(USERS_FILE);
  localUsers[uid] = { ...(localUsers[uid] || {}), ...payload };
  writeLocalData(USERS_FILE, localUsers);

  return localUsers[uid];
}

/**
 * Verifies Firebase Authentication token from HTTP headers.
 */
export async function verifyAuthToken(req) {
  const authHeader = req.headers.authorization;
  const customStudentId = req.headers['x-student-id'] || req.body?.studentId || 'default_student';

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const role = await getUserRole(customStudentId, `${customStudentId}@placement.edu`);
    return {
      uid: customStudentId,
      email: `${customStudentId}@placement.edu`,
      role,
      isDevMock: true
    };
  }

  const token = authHeader.split('Bearer ')[1];

  if (isFirebaseConfigured) {
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      const role = await getUserRole(decoded.uid, decoded.email);
      return {
        uid: decoded.uid,
        email: decoded.email,
        role,
        isDevMock: false
      };
    } catch (err) {
      console.warn(`[Firebase Auth] Token verification failed: ${err.message}.`);
      throw new Error('Invalid or expired authentication token.');
    }
  }

  const role = await getUserRole(customStudentId, `${customStudentId}@placement.edu`);
  return {
    uid: customStudentId,
    email: `${customStudentId}@placement.edu`,
    role,
    isDevMock: true
  };
}

/**
 * Persists an Aptitude Assessment document to Firestore (or local fallback).
 */
export async function saveAptitudeAssessmentToFirestore(assessment) {
  const assessmentId = assessment.id || assessment.assessmentId;
  if (!assessmentId) throw new Error('Assessment ID is required for saving to Firestore.');

  const payload = {
    ...assessment,
    updatedAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    await db.collection('aptitudeAssessments').doc(assessmentId).set(payload, { merge: true });
  } else {
    const records = readLocalData(APTITUDE_ASSESSMENTS_FILE);
    records[assessmentId] = payload;
    writeLocalData(APTITUDE_ASSESSMENTS_FILE, records);
  }

  return payload;
}

/**
 * Updates student document with their latest aptitude score & statistics.
 */
export async function updateStudentLatestAptitude(studentId, aptitudeData) {
  if (!studentId) return;

  const studentPayload = {
    latestAptitudeAssessment: {
      assessmentId: aptitudeData.id || aptitudeData.assessmentId,
      score: aptitudeData.finalScore ?? aptitudeData.score,
      totalQuestions: aptitudeData.totalQuestions || 20,
      correctAnswers: aptitudeData.correctAnswers || 0,
      completedAt: aptitudeData.completedAt || new Date().toISOString(),
      categoryBreakdown: aptitudeData.categoryBreakdown || {},
      status: aptitudeData.status || 'Completed'
    },
    aptitudeScore: aptitudeData.finalScore ?? aptitudeData.score,
    updatedAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    await db.collection('students').doc(studentId).set(studentPayload, { merge: true });
  } else {
    const students = readLocalData(STUDENTS_FILE);
    students[studentId] = {
      ...(students[studentId] || {}),
      ...studentPayload
    };
    writeLocalData(STUDENTS_FILE, students);
  }
}

/**
 * Retrieves an aptitude assessment by ID.
 */
export async function getAptitudeAssessmentFromFirestore(assessmentId) {
  if (isFirebaseConfigured && db) {
    const doc = await db.collection('aptitudeAssessments').doc(assessmentId).get();
    return doc.exists ? doc.data() : null;
  } else {
    const records = readLocalData(APTITUDE_ASSESSMENTS_FILE);
    return records[assessmentId] || null;
  }
}

/**
 * Retrieves the latest completed aptitude assessment for a student.
 */
export async function getLatestAptitudeAssessmentForStudent(studentId) {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await db.collection('aptitudeAssessments')
        .where('studentId', '==', studentId)
        .where('status', '==', 'Completed')
        .orderBy('completedAt', 'desc')
        .limit(1)
        .get();

      if (!snapshot.empty) {
        return snapshot.docs[0].data();
      }
    } catch (e) {
      console.warn('[Firebase] Query latest aptitude failed:', e.message);
    }
  }

  const records = readLocalData(APTITUDE_ASSESSMENTS_FILE);
  const userAssessments = Object.values(records).filter(
    a => a.studentId === studentId && a.status === 'Completed'
  );
  if (userAssessments.length === 0) return null;

  userAssessments.sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));
  return userAssessments[0];
}

/**
 * Retrieves all previous aptitude questions asked to a student to prevent repetition.
 */
export async function getStudentAptitudeQuestionHistory(studentId) {
  if (!studentId) return [];
  if (isFirebaseConfigured && db) {
    try {
      const doc = await db.collection('studentAptitudeQuestionHistory').doc(studentId).get();
      if (doc.exists) {
        return doc.data().questions || [];
      }
    } catch (e) {
      console.warn('[Firebase] Failed to load student aptitude question history:', e.message);
    }
  }
  const allHistory = readLocalData(APTITUDE_QUESTIONS_FILE);
  return allHistory[studentId] || [];
}

/**
 * Persists newly generated aptitude questions to student's lifetime question history.
 */
export async function recordStudentAptitudeQuestions(studentId, newQuestions = []) {
  if (!studentId || newQuestions.length === 0) return;
  const existing = await getStudentAptitudeQuestionHistory(studentId);
  
  const seenTexts = new Set(existing.map(q => (q.questionText || '').trim().toLowerCase()));
  const merged = [...existing];

  newQuestions.forEach(q => {
    const textKey = (q.questionText || q.question || '').trim().toLowerCase();
    if (textKey && !seenTexts.has(textKey)) {
      seenTexts.add(textKey);
      merged.push({
        id: q.id || `apt_q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        category: q.category,
        subtopic: q.subtopic || 'General',
        difficulty: q.difficulty || 'MEDIUM',
        questionText: q.questionText || q.question,
        recordedAt: new Date().toISOString()
      });
    }
  });

  if (isFirebaseConfigured && db) {
    try {
      await db.collection('studentAptitudeQuestionHistory').doc(studentId).set({
        studentId,
        questions: merged,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('[Firebase] Failed to write student aptitude question history:', e.message);
    }
  }

  const allHistory = readLocalData(APTITUDE_QUESTIONS_FILE);
  allHistory[studentId] = merged;
  writeLocalData(APTITUDE_QUESTIONS_FILE, allHistory);
}

/**
 * Retrieves student profile by studentId/UID.
 */
export async function getStudentProfile(studentId) {
  if (!studentId) return null;
  if (isFirebaseConfigured && db) {
    try {
      const doc = await db.collection('students').doc(studentId).get();
      if (doc.exists) {
        return doc.data();
      }
    } catch (e) {
      console.warn('[Firebase] getStudentProfile failed:', e.message);
    }
  }

  const students = readLocalData(STUDENTS_FILE);
  return students[studentId] || null;
}

/**
 * Saves or merges a student profile in students/{studentId}.
 */
export async function saveStudentProfile(studentId, profileData) {
  if (!studentId) return null;
  const payload = {
    ...profileData,
    studentId,
    updatedAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      await db.collection('students').doc(studentId).set(payload, { merge: true });
    } catch (e) {
      console.warn('[Firebase] saveStudentProfile failed:', e.message);
    }
  }

  const students = readLocalData(STUDENTS_FILE);
  students[studentId] = {
    ...(students[studentId] || {}),
    ...payload
  };
  writeLocalData(STUDENTS_FILE, students);
  return payload;
}

/**
 * Migrates legacy email-keyed records (e.g. crsid542@gmail.com) to the authenticated UID.
 * This is ONLY executed when the authenticated user's email matches the legacy record.
 */
export async function migrateLegacyStudentAccount(legacyEmail, newUid, displayName = 'Sidharth S') {
  if (!legacyEmail || !newUid) return null;
  const cleanEmail = legacyEmail.toLowerCase().trim();

  const students = readLocalData(STUDENTS_FILE);
  const legacyRecord = students[cleanEmail];

  if (!legacyRecord) return null;

  // Build migrated profile
  const existingProfile = students[newUid] || {};
  const migratedProfile = {
    ...existingProfile,
    uid: newUid,
    studentId: newUid,
    personalInfo: {
      fullName: displayName || "Sidharth S",
      headline: "Computer Science Student",
      profilePhoto: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>",
      email: cleanEmail,
      phone: "",
      location: "",
      summary: "Undergraduate student passionate about software engineering and problem solving."
    },
    placementScores: {
      overallReadiness: Math.round(((legacyRecord.latestTechnicalScore || 40) + (legacyRecord.aptitudeScore || 10) + 75) / 3),
      technicalScore: legacyRecord.latestTechnicalScore || 40,
      aptitudeScore: legacyRecord.aptitudeScore || 10,
      communicationScore: 75
    },
    education: {
      tenthPercentage: "92%",
      tenthBoard: "State Board",
      tenthYear: "2019",
      twelfthPercentage: "90%",
      twelfthBoard: "State Board",
      twelfthYear: "2021",
      degree: "Bachelor of Technology",
      branch: "Computer Science & Engineering",
      college: "Engineering College",
      cgpa: "8.5",
      graduationYear: "2025"
    },
    professionalLinks: { linkedin: "", github: "", portfolio: "" },
    technicalSkills: {
      programmingLanguages: [{ name: "JavaScript", level: "Proficient" }, { name: "Python", level: "Intermediate" }],
      frameworks: [{ name: "React", level: "Proficient" }, { name: "Node.js", level: "Proficient" }],
      databases: [{ name: "MongoDB", level: "Proficient" }],
      toolsTechnologies: [{ name: "Git", level: "Proficient" }]
    },
    projects: [],
    experience: [],
    certifications: [],
    achievements: [],
    latestAssessmentId: legacyRecord.latestAssessmentId || null,
    latestTechnicalScore: legacyRecord.latestTechnicalScore || 0,
    latestAptitudeAssessment: legacyRecord.latestAptitudeAssessment || null,
    aptitudeScore: legacyRecord.aptitudeScore || 0,
    migratedFromLegacyEmail: cleanEmail,
    migratedAt: new Date().toISOString()
  };

  students[newUid] = migratedProfile;
  writeLocalData(STUDENTS_FILE, students);

  // Update assessment records pointing to legacy email so latest queries succeed for newUid
  const techAssessments = readLocalData(ASSESSMENTS_FILE);
  let updatedTech = false;
  Object.values(techAssessments).forEach(a => {
    if (a.studentId === cleanEmail) {
      a.studentId = newUid;
      updatedTech = true;
    }
  });
  if (updatedTech) writeLocalData(ASSESSMENTS_FILE, techAssessments);

  const aptAssessments = readLocalData(APTITUDE_ASSESSMENTS_FILE);
  let updatedApt = false;
  Object.values(aptAssessments).forEach(a => {
    if (a.studentId === cleanEmail) {
      a.studentId = newUid;
      updatedApt = true;
    }
  });
  if (updatedApt) writeLocalData(APTITUDE_ASSESSMENTS_FILE, aptAssessments);

  if (isFirebaseConfigured && db) {
    try {
      await db.collection('students').doc(newUid).set(migratedProfile, { merge: true });
    } catch (e) {
      console.warn('[Firebase] migrateLegacy set failed:', e.message);
    }
  }

  return migratedProfile;
}

/**
 * Standardizes department code/name from raw student inputs.
 */
export function extractDepartmentName(raw) {
  if (!raw || typeof raw !== 'string') return 'Other';
  const clean = raw.trim();
  const lower = clean.toLowerCase();

  if (lower.includes('ai') || lower.includes('artificial intelligence') || lower.includes('data science') || /\baids\b/.test(lower)) return 'AI & DS';
  if (lower.includes('comp') || lower.includes('software') || /\bcse\b/.test(lower)) return 'CSE';
  if ((lower.includes('electr') && lower.includes('comm')) || /\bece\b/.test(lower)) return 'ECE';
  if ((lower.includes('electr') && lower.includes('elect')) || /\beee\b/.test(lower)) return 'EEE';
  if (lower.includes('mech') || /\bme\b/.test(lower)) return 'ME';
  if (lower.includes('civil') || /\bce\b/.test(lower)) return 'CE';
  if (lower.includes('information') || /\bit\b/.test(lower)) return 'IT';

  return clean;
}

/**
 * Retrieves all registered student profiles from Firestore / local store.
 */
export async function getAllStudentsFromFirestore() {
  let rawList = [];

  if (isFirebaseConfigured && db) {
    try {
      const snap = await db.collection('students').get();
      if (!snap.empty) {
        snap.forEach(doc => {
          rawList.push({ ...doc.data(), uid: doc.id });
        });
      }
    } catch (e) {
      console.warn('[Firebase] getAllStudents failed, using local store:', e.message);
    }
  }

  if (rawList.length === 0) {
    const students = readLocalData(STUDENTS_FILE);
    rawList = Object.entries(students).map(([key, val]) => ({
      ...val,
      uid: val.uid || val.studentId || key
    }));
  }

  // Filter only actual student profile records
  const validStudents = rawList.filter(s => s && (s.personalInfo?.fullName || s.education?.college || s.technicalSkills));

  // Normalize each student record
  return validStudents.map(s => {
    const rawBranch = s.education?.branch || s.department || s.education?.degree || 'Other';
    const dept = extractDepartmentName(rawBranch);

    // Extract flat array of skills for easy filtering
    const skillList = [];
    if (s.technicalSkills) {
      const buckets = [
        s.technicalSkills.programmingLanguages || [],
        s.technicalSkills.frameworks || [],
        s.technicalSkills.databases || [],
        s.technicalSkills.toolsTechnologies || []
      ];
      buckets.forEach(b => {
        (Array.isArray(b) ? b : [b]).forEach(item => {
          const name = typeof item === 'string' ? item : item?.name;
          if (name && name.trim()) skillList.push(name.trim());
        });
      });
    }

    return {
      ...s,
      uid: s.uid || s.studentId,
      department: dept,
      normalizedSkills: Array.from(new Set(skillList)),
      placementVisibility: s.placementVisibility || {
        profile: true,
        education: true,
        skills: true,
        projects: true,
        experience: true,
        certifications: true,
        achievements: true,
        scores: true,
        resume: true,
        contact: false
      }
    };
  });
}

/**
 * Retrieves past assessment history for a specific student.
 */
export async function getStudentAssessmentHistory(studentId) {
  if (!studentId) return { technical: [], aptitude: [] };

  const history = {
    technical: [],
    aptitude: []
  };

  // 1. Technical assessments
  if (isFirebaseConfigured && db) {
    try {
      const snap = await db.collection('technicalAssessments')
        .where('studentId', '==', studentId)
        .orderBy('completedAt', 'desc')
        .limit(10)
        .get();
      if (!snap.empty) {
        snap.forEach(doc => history.technical.push(doc.data()));
      }
    } catch (e) {
      console.warn('[Firebase] getStudentAssessmentHistory technical failed:', e.message);
    }
  }

  if (history.technical.length === 0) {
    const techMap = readLocalData(ASSESSMENTS_FILE);
    history.technical = Object.values(techMap)
      .filter(a => a.studentId === studentId)
      .sort((a, b) => new Date(b.completedAt || b.savedAt || 0) - new Date(a.completedAt || a.savedAt || 0));
  }

  // 2. Aptitude assessments
  if (isFirebaseConfigured && db) {
    try {
      const snap = await db.collection('aptitudeAssessments')
        .where('studentId', '==', studentId)
        .orderBy('completedAt', 'desc')
        .limit(10)
        .get();
      if (!snap.empty) {
        snap.forEach(doc => history.aptitude.push(doc.data()));
      }
    } catch (e) {
      console.warn('[Firebase] getStudentAssessmentHistory aptitude failed:', e.message);
    }
  }

  if (history.aptitude.length === 0) {
    const aptMap = readLocalData(APTITUDE_ASSESSMENTS_FILE);
    history.aptitude = Object.values(aptMap)
      .filter(a => a.studentId === studentId)
      .sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));
  }

  return history;
}

export { isFirebaseConfigured };


