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

import { getUserRole, persistUserRole, normalizeRole } from './roleService.js';

/**
 * Registers a new user with Firebase Authentication and records their verified role.
 * 
 * Rules:
 * - Student registers with Name, Email, Password.
 * - Company registers with Company Name, Official Email, Password.
 * - Admin CANNOT self-register through this function.
 * - Persists authoritatively to both Firestore and Backend.
 */
export async function registerUser({ role, name, companyName, email, password }) {
  if (role === 'admin') {
    throw new Error('Admin accounts cannot be self-registered. Please contact the Placement Office.');
  }

  const normalizedRole = normalizeRole(role);
  if (!normalizedRole || !['student', 'company'].includes(normalizedRole)) {
    throw new Error('Invalid account role. Allowed roles for registration: student, company.');
  }

  const cleanEmail = (email || '').trim().toLowerCase();
  const displayName = normalizedRole === 'company' ? (companyName || '').trim() : (name || '').trim();

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
  } else {
    // Development / offline mock mode
    user = {
      uid: `local_uid_${Date.now()}`,
      email: cleanEmail,
      displayName
    };
  }

  // Dual authoritative persistence (Firestore + Backend + local cache)
  await persistUserRole(user.uid, {
    role: normalizedRole,
    email: cleanEmail,
    displayName,
    companyName: normalizedRole === 'company' ? companyName : null
  });

  return { user, role: normalizedRole };
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
    user = {
      uid: `local_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email: cleanEmail,
      displayName: cleanEmail.split('@')[0]
    };
  }

  // Retrieve verified role strictly via RoleService
  const role = await getUserRole(user.uid, cleanEmail);

  return { user, role };
}

/**
 * Fetches the verified role for a user.
 * Delegates to centralized RoleService.
 * Returns valid role string or null. NEVER returns 'student' as a fallback.
 */
export async function fetchUserRole(uid, email = '') {
  return await getUserRole(uid, email);
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
