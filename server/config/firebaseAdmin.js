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
const COMMUNICATION_ASSESSMENTS_FILE = path.join(LOCAL_STORE_DIR, 'communicationAssessments.json');
const USERS_FILE = path.join(LOCAL_STORE_DIR, 'users.json');
const DRIVES_FILE = path.join(LOCAL_STORE_DIR, 'placementDrives.json');
const APPLICATIONS_FILE = path.join(LOCAL_STORE_DIR, 'applications.json');
const NOTIFICATIONS_FILE = path.join(LOCAL_STORE_DIR, 'notifications.json');

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
  if (!fs.existsSync(DRIVES_FILE)) {
    fs.writeFileSync(DRIVES_FILE, JSON.stringify({}), 'utf8');
  }
  if (!fs.existsSync(APPLICATIONS_FILE)) {
    fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify({}), 'utf8');
  }
  if (!fs.existsSync(NOTIFICATIONS_FILE)) {
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify({}), 'utf8');
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
 * Returns null if no valid record exists. NEVER defaults to 'student'.
 */
export async function getUserRole(uid, email = '') {
  const record = await getUserRecord(uid, email);
  if (record && record.role) {
    return record.role;
  }
  return null;
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
 * Persists a Communication Assessment document to Firestore (or local fallback).
 */
export async function saveCommunicationAssessmentToFirestore(assessment) {
  const assessmentId = assessment.id || assessment.assessmentId;
  if (!assessmentId) throw new Error('Assessment ID is required for saving.');

  const payload = {
    ...assessment,
    updatedAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    await db.collection('communicationAssessments').doc(assessmentId).set(payload, { merge: true });
  } else {
    const records = readLocalData(COMMUNICATION_ASSESSMENTS_FILE);
    records[assessmentId] = payload;
    writeLocalData(COMMUNICATION_ASSESSMENTS_FILE, records);
  }

  return payload;
}

/**
 * Updates student document with their latest communication score & statistics.
 */
export async function updateStudentLatestCommunication(studentId, commData) {
  if (!studentId) return;

  const score = commData.finalScore ?? commData.score ?? 0;
  const studentPayload = {
    latestCommunicationAssessment: {
      assessmentId: commData.id || commData.assessmentId,
      score,
      totalQuestions: commData.totalQuestions || 15,
      correctAnswers: commData.correctAnswers || 0,
      completedAt: commData.completedAt || new Date().toISOString(),
      categoryBreakdown: commData.categoryBreakdown || {},
      status: commData.status || 'Completed'
    },
    communicationScore: score,
    updatedAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    await db.collection('students').doc(studentId).set(studentPayload, { merge: true });
  } else {
    const students = readLocalData(STUDENTS_FILE);
    const existing = students[studentId] || {};
    const placementScores = {
      ...(existing.placementScores || {}),
      communicationScore: score
    };
    students[studentId] = {
      ...existing,
      ...studentPayload,
      placementScores
    };
    writeLocalData(STUDENTS_FILE, students);
  }
}

/**
 * Retrieves a communication assessment by ID.
 */
export async function getCommunicationAssessmentFromFirestore(assessmentId) {
  if (isFirebaseConfigured && db) {
    const doc = await db.collection('communicationAssessments').doc(assessmentId).get();
    return doc.exists ? doc.data() : null;
  } else {
    const records = readLocalData(COMMUNICATION_ASSESSMENTS_FILE);
    return records[assessmentId] || null;
  }
}

/**
 * Retrieves the latest completed communication assessment for a student.
 */
export async function getLatestCommunicationAssessmentForStudent(studentId) {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await db.collection('communicationAssessments')
        .where('studentId', '==', studentId)
        .where('status', '==', 'Completed')
        .orderBy('completedAt', 'desc')
        .limit(1)
        .get();

      if (!snapshot.empty) {
        return snapshot.docs[0].data();
      }
    } catch (e) {
      console.warn('[Firebase] Query latest communication failed:', e.message);
    }
  }

  const records = readLocalData(COMMUNICATION_ASSESSMENTS_FILE);
  const userAssessments = Object.values(records).filter(
    a => a.studentId === studentId && a.status === 'Completed'
  );
  if (userAssessments.length === 0) return null;

  userAssessments.sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));
  return userAssessments[0];
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

/**
 * Retrieves all registered Placement Officers (admin users).
 */
export async function getAllPlacementOfficers() {
  let officersList = [];

  if (isFirebaseConfigured && db) {
    try {
      const snap = await db.collection('users').where('role', '==', 'admin').get();
      if (!snap.empty) {
        snap.forEach(doc => {
          officersList.push({ ...doc.data(), uid: doc.id });
        });
      }
    } catch (e) {
      console.warn('[Firebase Admin] getAllPlacementOfficers failed, using local store:', e.message);
    }
  }

  if (officersList.length === 0) {
    const localUsers = readLocalData(USERS_FILE);
    officersList = Object.values(localUsers).filter(u => u.role === 'admin');
  }

  return officersList.map(o => {
    const rawDept = o.department || 'Central Placement Cell';
    const isCentral = rawDept.toLowerCase().includes('central');
    const defaultScope = isCentral ? 'college' : 'department';
    const accessScope = o.accessScope || defaultScope;
    const assignedDepartment = o.assignedDepartment || (accessScope === 'department' ? rawDept : null);

    return {
      uid: o.uid,
      email: o.email,
      displayName: o.displayName || o.name || 'Placement Officer',
      designation: o.designation || 'Placement Officer',
      department: rawDept,
      accessScope,
      assignedDepartment,
      status: o.status || 'active',
      phone: o.phone || '',
      role: 'admin',
      createdAt: o.createdAt || o.updatedAt || new Date().toISOString(),
      updatedAt: o.updatedAt || new Date().toISOString()
    };
  });
}

/**
 * Adds or registers a Placement Officer.
 * Creates an authenticated Firebase user via Admin SDK without affecting the admin session.
 */
export async function addPlacementOfficer({
  name,
  email,
  designation,
  department,
  phone,
  accessScope,
  assignedDepartment,
  status,
  initialPassword,
  uid
}) {
  if (!email || !email.trim()) throw new Error('Official email is required for Placement Officer.');
  const cleanEmail = email.trim().toLowerCase();

  // Safeguard: Check duplicate email in existing officers
  const existingOfficers = await getAllPlacementOfficers();
  const duplicate = existingOfficers.find(o => (o.email || '').toLowerCase() === cleanEmail && (!uid || o.uid !== uid));
  if (duplicate) {
    throw new Error(`An account with email '${cleanEmail}' is already registered as a Placement Officer.`);
  }

  let effectiveUid = uid;

  // 1. If live Firebase Admin is configured, create the authenticated user securely
  if (isFirebaseConfigured && admin.apps.length > 0) {
    try {
      let authUser = null;
      try {
        authUser = await admin.auth().getUserByEmail(cleanEmail);
      } catch (authErr) {
        if (authErr.code === 'auth/user-not-found') {
          // Create Firebase Authentication user with initial password
          authUser = await admin.auth().createUser({
            email: cleanEmail,
            password: initialPassword || 'Officer@123',
            displayName: (name || cleanEmail.split('@')[0]).trim()
          });
          console.log(`[Firebase Admin] Created new Firebase Auth user for officer: ${cleanEmail} (UID: ${authUser.uid})`);
        } else {
          throw authErr;
        }
      }

      if (authUser && !effectiveUid) {
        effectiveUid = authUser.uid;
      }
    } catch (err) {
      console.warn('[Firebase Admin] Firebase Auth user creation note:', err.message);
    }
  }

  if (!effectiveUid) {
    effectiveUid = `admin_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
  }

  const rawDept = department?.trim() || 'Central Placement Cell';
  const isCentral = rawDept.toLowerCase().includes('central');
  const scope = accessScope || (isCentral ? 'college' : 'department');
  const assignedDept = scope === 'department' ? (assignedDepartment?.trim() || rawDept) : null;
  const officerStatus = status === 'inactive' ? 'inactive' : 'active';

  const payload = {
    uid: effectiveUid,
    role: 'admin',
    email: cleanEmail,
    displayName: (name || cleanEmail.split('@')[0]).trim(),
    designation: designation?.trim() || 'Placement Officer',
    department: rawDept,
    accessScope: scope,
    assignedDepartment: assignedDept,
    status: officerStatus,
    phone: phone?.trim() || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (initialPassword) {
    payload.initialPassword = initialPassword;
  }

  // 2. Persist to Firestore if available
  if (isFirebaseConfigured && db) {
    try {
      await db.collection('users').doc(effectiveUid).set(payload, { merge: true });
    } catch (e) {
      console.warn('[Firebase Admin] addPlacementOfficer Firestore write failed:', e.message);
    }
  }

  // 3. Persist to local JSON store
  const localUsers = readLocalData(USERS_FILE);
  localUsers[effectiveUid] = payload;
  writeLocalData(USERS_FILE, localUsers);

  return payload;
}

/**
 * Updates an existing Placement Officer record (scope, department, status, details).
 */
export async function updatePlacementOfficer(uid, updates = {}) {
  if (!uid) throw new Error('Officer UID is required for update.');

  const localUsers = readLocalData(USERS_FILE);
  const existing = localUsers[uid] || (await getUserRecord(uid));

  if (!existing || existing.role !== 'admin') {
    throw new Error('Placement Officer account not found.');
  }

  const scope = updates.accessScope || existing.accessScope || 'college';
  const assignedDept = scope === 'department'
    ? (updates.assignedDepartment || updates.department || existing.assignedDepartment || existing.department)
    : null;

  const payload = {
    ...existing,
    ...updates,
    uid,
    role: 'admin',
    accessScope: scope,
    assignedDepartment: assignedDept,
    status: updates.status || existing.status || 'active',
    updatedAt: new Date().toISOString()
  };

  // Sync with Firebase Auth display name if changed and live
  if (isFirebaseConfigured && admin.apps.length > 0 && updates.name && !uid.startsWith('admin_')) {
    try {
      await admin.auth().updateUser(uid, { displayName: updates.name });
    } catch (authUpErr) {
      console.warn('[Firebase Admin] updateUser display name failed:', authUpErr.message);
    }
  }

  if (isFirebaseConfigured && db) {
    try {
      await db.collection('users').doc(uid).set(payload, { merge: true });
    } catch (e) {
      console.warn('[Firebase Admin] updatePlacementOfficer Firestore write failed:', e.message);
    }
  }

  localUsers[uid] = payload;
  writeLocalData(USERS_FILE, localUsers);

  return payload;
}

/**
 * Toggles an officer account status between 'active' and 'inactive'.
 * Enforces safeguard: At least one administrator account must remain active.
 */
export async function toggleOfficerStatus(uid, status) {
  if (!uid) throw new Error('Officer UID is required.');
  const newStatus = status === 'inactive' ? 'inactive' : 'active';

  const officers = await getAllPlacementOfficers();
  const target = officers.find(o => o.uid === uid);
  if (!target) {
    throw new Error('Placement Officer not found.');
  }

  if (newStatus === 'inactive') {
    const activeOfficers = officers.filter(o => o.status !== 'inactive' && o.uid !== uid);
    if (activeOfficers.length === 0) {
      throw new Error('Cannot deactivate the only active Placement Administrator. At least one administrator account must remain active.');
    }
  }

  return await updatePlacementOfficer(uid, { status: newStatus });
}

/**
 * Removes a Placement Officer.
 * Safeguard: Prevents removing the only remaining placement officer.
 */
export async function removePlacementOfficer(uid) {
  if (!uid) throw new Error('UID is required.');
  const localUsers = readLocalData(USERS_FILE);

  const adminUsers = Object.values(localUsers).filter(u => u.role === 'admin');
  if (adminUsers.length <= 1 && localUsers[uid]?.role === 'admin') {
    throw new Error('Cannot remove the only remaining Placement Officer. At least one administrator account must be retained.');
  }

  if (localUsers[uid]) {
    delete localUsers[uid];
    writeLocalData(USERS_FILE, localUsers);
  }

  if (isFirebaseConfigured && db) {
    try {
      await db.collection('users').doc(uid).delete();
      if (admin.apps.length > 0) {
        try {
          await admin.auth().deleteUser(uid);
        } catch (authDelErr) {
          console.warn('[Firebase Auth] deleteUser notice:', authDelErr.message);
        }
      }
    } catch (e) {
      console.warn('[Firebase Admin] removePlacementOfficer Firestore delete failed:', e.message);
    }
  }

  return { success: true };
}

/**
 * Retrieves all registered Company / Recruiter accounts.
 */
export async function getAllCompanies() {
  const localUsers = readLocalData(USERS_FILE);
  let companyUsers = Object.values(localUsers).filter(u => u.role === 'company');

  if (isFirebaseConfigured && db) {
    try {
      const snap = await db.collection('users').where('role', '==', 'company').get();
      if (!snap.empty) {
        const firestoreCompanies = [];
        snap.forEach(doc => firestoreCompanies.push({ ...doc.data(), uid: doc.id }));
        return firestoreCompanies;
      }
    } catch (e) {
      console.warn('[Firebase Admin] getAllCompanies Firestore query failed:', e.message);
    }
  }

  return companyUsers;
}

/**
 * Retrieves all Campus Placement Drives.
 */
export async function getAllPlacementDrives() {
  ensureLocalStore();
  let drives = readLocalData(DRIVES_FILE);
  if (!drives || Object.keys(drives).length === 0) {
    const initialDrives = {
      "drive_google_2026": {
        id: "drive_google_2026",
        companyName: "Google Cloud",
        jobRole: "Software Engineer - Campus 2026",
        eligibleDepartments: ["CSE", "ECE", "AI & DS"],
        minCgpa: 8.0,
        minReadiness: 75,
        packageCTC: "28 LPA",
        driveDate: "2026-10-25",
        status: "Upcoming",
        location: "Campus / Virtual",
        jobDescription: "Developing scalable distributed systems, microservices, and AI cloud tools.",
        createdAt: new Date().toISOString()
      },
      "drive_techcorp_2026": {
        id: "drive_techcorp_2026",
        companyName: "TechCorp Solutions",
        jobRole: "Full Stack Developer",
        eligibleDepartments: ["All"],
        minCgpa: 7.0,
        minReadiness: 65,
        packageCTC: "14 LPA",
        driveDate: "2026-10-18",
        status: "Active",
        location: "Main Auditorium",
        jobDescription: "React, Node.js, and cloud application engineering.",
        createdAt: new Date().toISOString()
      },
      "drive_estech_2026": {
        id: "drive_estech_2026",
        companyName: "ES Tech Global",
        jobRole: "Embedded Systems & Firmware Engineer",
        eligibleDepartments: ["ECE", "EEE", "ME"],
        minCgpa: 7.0,
        minReadiness: 60,
        packageCTC: "12 LPA",
        driveDate: "2026-11-05",
        status: "Upcoming",
        location: "Virtual",
        jobDescription: "Microcontrollers, C/C++, RTOS, and IoT hardware integration.",
        createdAt: new Date().toISOString()
      }
    };
    writeLocalData(DRIVES_FILE, initialDrives);
    drives = initialDrives;
  }
  return Object.values(drives).sort((a, b) => new Date(a.driveDate) - new Date(b.driveDate));
}

/**
 * Creates or updates a Campus Placement Drive.
 */
export async function savePlacementDrive(driveData) {
  ensureLocalStore();
  const drives = readLocalData(DRIVES_FILE);
  const id = driveData.id || `drive_${Date.now()}`;
  const payload = {
    ...driveData,
    id,
    updatedAt: new Date().toISOString()
  };
  drives[id] = payload;
  writeLocalData(DRIVES_FILE, drives);
  return payload;
}

/**
 * Deletes a Campus Placement Drive.
 */
export async function deletePlacementDrive(id) {
  ensureLocalStore();
  const drives = readLocalData(DRIVES_FILE);
  if (drives[id]) {
    delete drives[id];
    writeLocalData(DRIVES_FILE, drives);
  }
  return { success: true };
}

/**
 * =========================================================================
 * Job Applications & Placement Officer Nominations
 * =========================================================================
 */

/**
 * Saves or updates a Job Application / Nomination document.
 * Enforces unified document ID: app_${studentId}_${jobId}
 */
export async function saveApplication(appData) {
  ensureLocalStore();
  const studentId = appData.studentId;
  const jobId = appData.jobId;
  if (!studentId || !jobId) {
    throw new Error('Both studentId and jobId are required for an application.');
  }

  const id = appData.id || `app_${studentId}_${jobId}`;
  const existingRecords = readLocalData(APPLICATIONS_FILE);
  const existing = existingRecords[id] || {};

  const payload = {
    ...existing,
    ...appData,
    id,
    updatedAt: new Date().toISOString(),
    createdAt: existing.createdAt || appData.createdAt || new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      await db.collection('applications').doc(id).set(payload, { merge: true });
    } catch (e) {
      console.warn('[Firebase Admin] saveApplication failed:', e.message);
    }
  }

  existingRecords[id] = payload;
  writeLocalData(APPLICATIONS_FILE, existingRecords);
  return payload;
}

/**
 * Retrieves a single application by its unified ID.
 */
export async function getApplicationById(id) {
  ensureLocalStore();
  if (isFirebaseConfigured && db) {
    try {
      const doc = await db.collection('applications').doc(id).get();
      if (doc.exists) return doc.data();
    } catch (e) {
      console.warn('[Firebase Admin] getApplicationById failed:', e.message);
    }
  }
  const records = readLocalData(APPLICATIONS_FILE);
  return records[id] || null;
}

/**
 * Retrieves all applications/nominations for a specific student.
 */
export async function getApplicationsForStudent(studentId) {
  ensureLocalStore();
  if (!studentId) return [];

  if (isFirebaseConfigured && db) {
    try {
      const snap = await db.collection('applications')
        .where('studentId', '==', studentId)
        .get();
      if (!snap.empty) {
        const list = [];
        snap.forEach(doc => list.push(doc.data()));
        return list.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
      }
    } catch (e) {
      console.warn('[Firebase Admin] getApplicationsForStudent failed:', e.message);
    }
  }

  const records = readLocalData(APPLICATIONS_FILE);
  return Object.values(records)
    .filter(a => a.studentId === studentId)
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
}

/**
 * Retrieves all applications/nominations for a specific recruitment drive / job.
 */
export async function getApplicationsForJob(jobId) {
  ensureLocalStore();
  if (!jobId) return [];

  if (isFirebaseConfigured && db) {
    try {
      const snap = await db.collection('applications')
        .where('jobId', '==', jobId)
        .get();
      if (!snap.empty) {
        const list = [];
        snap.forEach(doc => list.push(doc.data()));
        return list.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
      }
    } catch (e) {
      console.warn('[Firebase Admin] getApplicationsForJob failed:', e.message);
    }
  }

  const records = readLocalData(APPLICATIONS_FILE);
  return Object.values(records)
    .filter(a => a.jobId === jobId)
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
}

/**
 * Retrieves all applications across all jobs (for placement officers).
 */
export async function getAllApplications() {
  ensureLocalStore();
  if (isFirebaseConfigured && db) {
    try {
      const snap = await db.collection('applications').get();
      if (!snap.empty) {
        const list = [];
        snap.forEach(doc => list.push(doc.data()));
        return list.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
      }
    } catch (e) {
      console.warn('[Firebase Admin] getAllApplications failed:', e.message);
    }
  }

  const records = readLocalData(APPLICATIONS_FILE);
  return Object.values(records)
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
}

/**
 * =========================================================================
 * In-App Notifications
 * =========================================================================
 */

/**
 * Creates and persists an in-app notification.
 */
export async function createNotification(notifData) {
  ensureLocalStore();
  const id = notifData.id || `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const payload = {
    ...notifData,
    id,
    read: false,
    createdAt: notifData.createdAt || new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      await db.collection('notifications').doc(id).set(payload);
    } catch (e) {
      console.warn('[Firebase Admin] createNotification failed:', e.message);
    }
  }

  const records = readLocalData(NOTIFICATIONS_FILE);
  records[id] = payload;
  writeLocalData(NOTIFICATIONS_FILE, records);
  return payload;
}

/**
 * Retrieves notifications for a specific recipient user.
 */
export async function getNotificationsForUser(userId) {
  ensureLocalStore();
  if (!userId) return [];

  if (isFirebaseConfigured && db) {
    try {
      const snap = await db.collection('notifications')
        .where('recipientId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(30)
        .get();
      if (!snap.empty) {
        const list = [];
        snap.forEach(doc => list.push(doc.data()));
        return list;
      }
    } catch (e) {
      console.warn('[Firebase Admin] getNotificationsForUser failed:', e.message);
    }
  }

  const records = readLocalData(NOTIFICATIONS_FILE);
  return Object.values(records)
    .filter(n => n.recipientId === userId)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

/**
 * Marks a single notification as read.
 */
export async function markNotificationRead(notifId, userId) {
  ensureLocalStore();
  const records = readLocalData(NOTIFICATIONS_FILE);
  if (records[notifId] && (!userId || records[notifId].recipientId === userId)) {
    records[notifId].read = true;
    records[notifId].readAt = new Date().toISOString();
    writeLocalData(NOTIFICATIONS_FILE, records);
  }

  if (isFirebaseConfigured && db) {
    try {
      await db.collection('notifications').doc(notifId).update({
        read: true,
        readAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('[Firebase Admin] markNotificationRead failed:', e.message);
    }
  }

  return { success: true };
}

/**
 * Marks all notifications for a user as read.
 */
export async function markAllNotificationsRead(userId) {
  ensureLocalStore();
  if (!userId) return { success: false };

  const records = readLocalData(NOTIFICATIONS_FILE);
  let updated = false;
  Object.values(records).forEach(n => {
    if (n.recipientId === userId && !n.read) {
      n.read = true;
      n.readAt = new Date().toISOString();
      updated = true;
    }
  });
  if (updated) {
    writeLocalData(NOTIFICATIONS_FILE, records);
  }

  return { success: true };
}

export { isFirebaseConfigured };


