import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isConfigured } from './firebaseClient.js';

const LOCAL_USERS_KEY = 'placement_genie_local_users';

// Pre-seeded local user registry for offline/development test accounts
const DEFAULT_PRESEEDED_USERS = {
  'admin@placement.edu': {
    email: 'admin@placement.edu',
    displayName: 'Placement Officer',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  'recruiter@techcorp.com': {
    email: 'recruiter@techcorp.com',
    companyName: 'TechCorp Solutions',
    displayName: 'TechCorp Solutions',
    role: 'company',
    createdAt: new Date().toISOString()
  },
  'student@placement.edu': {
    email: 'student@placement.edu',
    displayName: 'Alex Morgan',
    role: 'student',
    createdAt: new Date().toISOString()
  }
};

function getLocalUsers() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(LOCAL_USERS_KEY);
      if (raw) {
        return { ...DEFAULT_PRESEEDED_USERS, ...JSON.parse(raw) };
      }
    }
  } catch (e) {
    console.warn('Error reading local user store:', e);
  }
  return { ...DEFAULT_PRESEEDED_USERS };
}

function saveLocalUser(email, userData) {
  try {
    const current = getLocalUsers();
    current[email.toLowerCase().trim()] = userData;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(current));
    }
  } catch (e) {
    console.warn('Error saving to local user store:', e);
  }
}

/**
 * Maps raw Firebase error codes to friendly human-readable messages.
 */
export function formatAuthError(err) {
  if (!err) return 'An unexpected error occurred. Please try again.';
  const code = err.code || '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/email-already-in-use':
      return 'This email address is already registered. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact the administrator.';
    case 'auth/too-many-requests':
      return 'Access temporarily disabled due to multiple failed login attempts. Please try again later or reset your password.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    default:
      return err.message || 'Authentication failed. Please try again.';
  }
}

/**
 * Registers a new user with Firebase Authentication and records their verified role.
 * 
 * Rules:
 * - Student registers with Name, Email, Password.
 * - Company registers with Company Name, Official Email, Password.
 * - Admin CANNOT self-register through this function.
 */
export async function registerUser({ role, name, companyName, email, password }) {
  if (role === 'admin') {
    throw new Error('Admin accounts cannot be self-registered. Please contact the Placement Office.');
  }

  const cleanEmail = (email || '').trim().toLowerCase();
  const displayName = role === 'company' ? (companyName || '').trim() : (name || '').trim();

  let user = null;

  if (isConfigured && auth) {
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    user = userCredential.user;

    if (displayName) {
      try {
        await updateProfile(user, { displayName });
      } catch (e) {
        console.warn('Failed to update display name:', e);
      }
    }

    // Persist verified role in Firestore users collection
    if (db) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: cleanEmail,
          displayName,
          companyName: role === 'company' ? companyName : null,
          role,
          createdAt: new Date().toISOString()
        });
      } catch (dbErr) {
        console.warn('[Firestore] Failed to write user profile doc:', dbErr.message);
      }
    }
  } else {
    // Development / offline mock mode
    user = {
      uid: `local_uid_${Date.now()}`,
      email: cleanEmail,
      displayName
    };
  }

  // Also record in local store for resilience
  saveLocalUser(cleanEmail, {
    uid: user.uid,
    email: cleanEmail,
    displayName,
    companyName: role === 'company' ? companyName : null,
    role,
    createdAt: new Date().toISOString()
  });

  return { user, role };
}

/**
 * Logs in an existing user with email and password and retrieves their verified database role.
 */
export async function loginUser(email, password) {
  const cleanEmail = (email || '').trim().toLowerCase();
  let user = null;

  if (isConfigured && auth) {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    user = userCredential.user;
  } else {
    // Development fallback: check local store or allow password verification
    const localUsers = getLocalUsers();
    const existing = localUsers[cleanEmail];
    user = {
      uid: existing?.uid || `local_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email: cleanEmail,
      displayName: existing?.displayName || cleanEmail.split('@')[0]
    };
  }

  // Retrieve verified role from database
  const role = await fetchUserRole(user.uid, cleanEmail);

  return { user, role };
}

/**
 * Fetches the verified role for a user.
 * Priority:
 * 1. Firestore 'users' document for user.uid
 * 2. Backend /api/auth/role endpoint
 * 3. Pre-seeded / local registered users
 * 4. Default to 'student' if unknown (Zero informal email heuristics)
 */
export async function fetchUserRole(uid, email = '') {
  const cleanEmail = (email || '').trim().toLowerCase();

  // 1. Check live Firestore client SDK
  if (isConfigured && db && uid) {
    try {
      const userDocRef = doc(db, 'users', uid);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data.role) return data.role;
      }
    } catch (e) {
      console.warn('[Firestore] Client role retrieval failed:', e.message);
    }
  }

  // 2. Check Backend Auth API (/api/auth/role/:uid)
  if (uid || cleanEmail) {
    try {
      const targetId = uid || cleanEmail;
      const res = await fetch(`http://localhost:5000/api/auth/role/${encodeURIComponent(targetId)}?email=${encodeURIComponent(cleanEmail)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.role) return data.role;
      }
    } catch (apiErr) {
      // Backend unavailable or offline
    }
  }

  // 3. Check Local User Registry
  const localUsers = getLocalUsers();
  if (cleanEmail && localUsers[cleanEmail]?.role) {
    return localUsers[cleanEmail].role;
  }
  if (uid && localUsers[uid]?.role) {
    return localUsers[uid].role;
  }

  // 4. Default to student. Do NOT infer admin or company from email string or domain.
  return 'student';
}

/**
 * Signs out the currently authenticated user.
 */
export async function logoutUser() {
  if (isConfigured && auth) {
    await signOut(auth);
  }
}

/**
 * Sends a password reset email via Firebase Auth.
 */
export async function sendPasswordReset(email) {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (isConfigured && auth) {
    await sendPasswordResetEmail(auth, cleanEmail);
  } else {
    console.log(`[Dev Auth] Mock password reset email sent to ${cleanEmail}`);
  }
  return true;
}

/**
 * Listens to Firebase auth state changes.
 */
export function subscribeToAuthState(callback) {
  if (isConfigured && auth) {
    return onAuthStateChanged(auth, callback);
  } else {
    // If not configured with live Firebase, check localStorage for session
    const savedSession = typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('placement_genie_active_session') : null;
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        callback(parsed);
        return () => {};
      } catch (e) {
        callback(null);
      }
    } else {
      callback(null);
    }
    return () => {};
  }
}
