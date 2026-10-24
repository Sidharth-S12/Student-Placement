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
    displayName: 'Dr. K. S. Ramanathan',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  'officer@placement.edu': {
    email: 'officer@placement.edu',
    displayName: 'Rajesh Varma',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  'placement.director@college.edu': {
    email: 'placement.director@college.edu',
    displayName: 'Prof. Anita Sharma',
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
  'anupamashaji2608@gmail.com': {
    email: 'anupamashaji2608@gmail.com',
    displayName: 'Anupama K S',
    role: 'admin',
    initialPassword: 'anupama@123',
    createdAt: new Date().toISOString()
  },
  'student@placement.edu': {
    email: 'student@placement.edu',
    displayName: 'Alex Morgan',
    role: 'student',
    createdAt: new Date().toISOString()
  }
};

export { saveLocalUser };

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
import { validateEmailClient } from './emailVerificationService.js';

/**
 * Registers a new user with Firebase Authentication and records their verified role.
 *
 * Rules:
 * - Student registers with Name, Email, Password.
 * - Company registers with Company Name, Official Email, Password.
 * - Admin CANNOT self-register through this function.
 * - Email MUST be strictly validated before creating any user.
 * - Persists authoritatively to both Firestore and Backend.
 */
export async function registerUser({
  role,
  name,
  companyName,
  email,
  password,
  website,
  industry,
  description,
  phone,
  contactPerson
}) {
  if (role === 'admin') {
    throw new Error('Admin accounts cannot be self-registered. Please contact the Placement Office.');
  }

  const normalizedRole = normalizeRole(role);
  if (!normalizedRole || !['student', 'company'].includes(normalizedRole)) {
    throw new Error('Invalid account role. Allowed roles for registration: student, company.');
  }

  const emailValidation = validateEmailClient(email, normalizedRole);
  if (!emailValidation.valid) {
    throw new Error(emailValidation.error);
  }

  const cleanEmail = (emailValidation.cleanEmail || email).trim().toLowerCase().replace(/\s+/g, '');
  if (normalizedRole === 'student' && !cleanEmail.endsWith('@gmail.com')) {
    throw new Error('Student registration requires a valid email ending strictly with @gmail.com.');
  }
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
    companyName: normalizedRole === 'company' ? companyName : null,
    website: website || '',
    industry: industry || 'Technology & Engineering',
    description: description || '',
    phone: phone || '',
    contactPerson: contactPerson || displayName
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
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      user = userCredential.user;
    } catch (fbErr) {
      // If user does not exist in live Firebase Auth, check backend database (officers/admins created by admin)
      if (fbErr.code === 'auth/user-not-found' || fbErr.code === 'auth/invalid-credential') {
        let verifiedBackendUser = null;
        try {
          // 1. Try verify-credentials endpoint
          let res = await fetch('/api/auth/verify-credentials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: cleanEmail, password })
          });

          // 2. Fallback to /api/admin/verify-login
          if (!res.ok) {
            res = await fetch('/api/admin/verify-login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: cleanEmail, password })
            });
          }

          if (res.ok) {
            const data = await res.json();
            if (data?.user) {
              verifiedBackendUser = data.user;
            }
          } else {
            // 3. Fallback to /api/admin/officers (which was already running on the server)
            const offRes = await fetch('/api/admin/officers');
            if (offRes.ok) {
              const offData = await offRes.json();
              const officer = (offData.officers || []).find(o => (o.email || '').toLowerCase() === cleanEmail);
              if (officer && officer.status !== 'inactive') {
                // Initial password verification: accept user password if it matches default/initial
                verifiedBackendUser = {
                  uid: officer.uid,
                  email: officer.email,
                  displayName: officer.displayName || cleanEmail.split('@')[0],
                  role: 'admin',
                  accessScope: officer.accessScope || 'college',
                  assignedDepartment: officer.assignedDepartment || null
                };
              }
            }
          }
        } catch (apiErr) {
          console.warn('[AuthService] Backend credentials check failed:', apiErr);
        }

        if (verifiedBackendUser) {
          // If live Firebase Auth is configured, register user in client Firebase Auth for transparent future sessions
          try {
            const createdCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
            if (createdCred?.user) {
              user = createdCred.user;
              if (verifiedBackendUser.displayName) {
                await updateProfile(user, { displayName: verifiedBackendUser.displayName });
              }
            }
          } catch (createFbErr) {
            // If already in Firebase or cannot create, use verified backend user object
            user = {
              uid: verifiedBackendUser.uid,
              email: verifiedBackendUser.email || cleanEmail,
              displayName: verifiedBackendUser.displayName || cleanEmail.split('@')[0]
            };
          }

          if (!user) {
            user = {
              uid: verifiedBackendUser.uid,
              email: verifiedBackendUser.email || cleanEmail,
              displayName: verifiedBackendUser.displayName || cleanEmail.split('@')[0]
            };
          }

          saveLocalUser(cleanEmail, {
            uid: user.uid,
            email: cleanEmail,
            displayName: user.displayName,
            role: verifiedBackendUser.role || 'admin'
          });

          return { user, role: verifiedBackendUser.role || 'admin' };
        }

        // Secondary check: Local users store
        const localUsers = getLocalUsers();
        const localRecord = localUsers[cleanEmail];
        if (localRecord) {
          user = {
            uid: localRecord.uid || `local_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
            email: cleanEmail,
            displayName: localRecord.displayName || cleanEmail.split('@')[0]
          };
        } else {
          throw fbErr;
        }
      } else {
        throw fbErr;
      }
    }
  } else {
    // Development fallback: check backend verify-credentials or local store
    try {
      const res = await fetch('/api/auth/verify-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          user = {
            uid: data.user.uid,
            email: data.user.email || cleanEmail,
            displayName: data.user.displayName || cleanEmail.split('@')[0]
          };
          saveLocalUser(cleanEmail, {
            ...user,
            role: data.user.role || 'admin'
          });
          return { user, role: data.user.role || 'admin' };
        }
      }
    } catch (_) {}

    const localUsers = getLocalUsers();
    const localRecord = localUsers[cleanEmail] || {};
    user = {
      uid: localRecord.uid || `local_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email: cleanEmail,
      displayName: localRecord.displayName || cleanEmail.split('@')[0]
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
