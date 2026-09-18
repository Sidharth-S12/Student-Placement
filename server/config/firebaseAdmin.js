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
 * Verifies Firebase Authentication token from HTTP headers.
 */
export async function verifyAuthToken(req) {
  const authHeader = req.headers.authorization;
  const customStudentId = req.headers['x-student-id'] || req.body?.studentId || 'default_student';

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // In development mode or before Firebase Auth is attached, allow student ID identification
    return {
      uid: customStudentId,
      email: `${customStudentId}@placement.edu`,
      isDevMock: true
    };
  }

  const token = authHeader.split('Bearer ')[1];

  if (isFirebaseConfigured) {
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      return {
        uid: decoded.uid,
        email: decoded.email,
        isDevMock: false
      };
    } catch (err) {
      console.warn(`[Firebase Auth] Token verification failed: ${err.message}.`);
      throw new Error('Invalid or expired authentication token.');
    }
  }

  return {
    uid: customStudentId,
    email: `${customStudentId}@placement.edu`,
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

export { isFirebaseConfigured };

