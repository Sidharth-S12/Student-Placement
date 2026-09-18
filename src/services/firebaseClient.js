import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

/**
 * Firebase Client SDK Configuration
 * 
 * Configured via Vite environment variables:
 * - VITE_FIREBASE_API_KEY
 * - VITE_FIREBASE_AUTH_DOMAIN
 * - VITE_FIREBASE_PROJECT_ID
 * - VITE_FIREBASE_STORAGE_BUCKET
 * - VITE_FIREBASE_MESSAGING_SENDER_ID
 * - VITE_FIREBASE_APP_ID
 */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

let app = null;
let auth = null;
let db = null;
let isConfigured = false;

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    isConfigured = true;
  } catch (e) {
    console.warn('[Firebase Client] Initialization warning:', e.message);
  }
}

/**
 * Gets authentication token for backend requests.
 */
export async function getAuthHeaders(studentId = 'default_student') {
  if (isConfigured && auth?.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    } catch (err) {
      console.warn('Failed to retrieve Firebase ID token:', err);
    }
  }

  return {
    'Content-Type': 'application/json',
    'x-student-id': studentId
  };
}

/**
 * Directly queries Firestore client for latest assessment if client SDK is active.
 * Otherwise returns null to let the application fall back to the backend API.
 */
export async function fetchClientLatestAssessment(studentId) {
  if (!isConfigured || !db) return null;

  try {
    const q = query(
      collection(db, 'technicalAssessments'),
      where('studentId', '==', studentId),
      where('status', '==', 'Completed'),
      orderBy('completedAt', 'desc'),
      limit(1)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data();
    }
  } catch (err) {
    console.warn('[Firebase Client] Client Firestore query failed, delegating to API:', err.message);
  }

  return null;
}

export { app, auth, db, isConfigured };
