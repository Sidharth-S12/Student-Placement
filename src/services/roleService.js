import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isConfigured } from './firebaseClient.js';

export const VALID_ROLES = Object.freeze(['student', 'company', 'admin']);

const LOCAL_USERS_KEY = 'placement_genie_local_users';

/**
 * Validates whether a given role string is an authorized system role.
 */
export function isValidRole(role) {
  if (!role || typeof role !== 'string') return false;
  return VALID_ROLES.includes(role.toLowerCase().trim());
}

/**
 * Normalizes a role string safely.
 * Returns null if the role is not recognized.
 */
export function normalizeRole(role) {
  if (!isValidRole(role)) return null;
  return role.toLowerCase().trim();
}

/**
 * Reads local user store (emulation / offline mode).
 */
function getLocalUsers() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(LOCAL_USERS_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('[RoleService] Error reading local users:', e);
  }
  return {};
}

/**
 * Saves user record to local store.
 */
function saveLocalUser(cleanEmail, userData) {
  try {
    const current = getLocalUsers();
    if (cleanEmail) {
      current[cleanEmail] = userData;
    }
    if (userData.uid) {
      current[userData.uid] = userData;
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(current));
    }
  } catch (e) {
    console.warn('[RoleService] Error saving to local user store:', e);
  }
}

/**
 * Authoritative role resolver for a user.
 * 
 * Strict Priority:
 * 1. Live Firestore `users/{uid}` via client SDK
 * 2. Backend persistent API `GET /api/auth/role/${uid}`
 * 3. Local user store (offline / dev emulation)
 * 
 * CRITICAL ARCHITECTURAL RULE:
 * If no valid role is found, returns NULL.
 * Under NO CIRCUMSTANCES does this function default to 'student'.
 */
export async function getUserRole(uid, email = '') {
  if (!uid && !email) return null;
  const cleanEmail = (email || '').trim().toLowerCase();

  // 1. Check live Firestore client SDK if active
  if (isConfigured && db && uid) {
    try {
      const userDocRef = doc(db, 'users', uid);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const rawRole = snap.data()?.role;
        const normalized = normalizeRole(rawRole);
        if (normalized) {
          // Cache locally for resilient offline access
          saveLocalUser(cleanEmail, { uid, email: cleanEmail, role: normalized });
          return normalized;
        }
      }
    } catch (e) {
      console.warn('[RoleService] Firestore client read failed:', e.message);
    }
  }

  // 2. Check Backend Auth API (/api/auth/role/:uid)
  try {
    const targetId = uid || cleanEmail;
    const res = await fetch(`/api/auth/role/${encodeURIComponent(targetId)}?email=${encodeURIComponent(cleanEmail)}`);
    if (res.ok) {
      const data = await res.json();
      const normalized = normalizeRole(data.role);
      if (normalized) {
        saveLocalUser(cleanEmail, { uid, email: cleanEmail, role: normalized });
        return normalized;
      }
    }
  } catch (apiErr) {
    // Backend API unreachable or offline
  }

  // 3. Check Local User Store
  const localUsers = getLocalUsers();
  if (uid && localUsers[uid]?.role) {
    const normalized = normalizeRole(localUsers[uid].role);
    if (normalized) return normalized;
  }
  if (cleanEmail && localUsers[cleanEmail]?.role) {
    const normalized = normalizeRole(localUsers[cleanEmail].role);
    if (normalized) return normalized;
  }

  // 4. No valid role could be determined
  // NEVER RETURN 'student' AS A FALLBACK!
  return null;
}

/**
 * Persists a user's role to both Firestore and the backend persistent store.
 * Validates role strictly before writing.
 */
export async function persistUserRole(uid, { role, email, displayName = '', companyName = null }) {
  if (!uid) throw new Error('UID is required to persist user role.');
  
  const normalizedRole = normalizeRole(role);
  if (!normalizedRole) {
    throw new Error(`Cannot persist invalid role: '${role}'. Allowed roles: ${VALID_ROLES.join(', ')}`);
  }

  const cleanEmail = (email || '').trim().toLowerCase();
  const payload = {
    uid,
    role: normalizedRole,
    email: cleanEmail,
    displayName: displayName || (cleanEmail ? cleanEmail.split('@')[0] : 'User'),
    companyName: normalizedRole === 'company' ? companyName : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  let firestoreSuccess = false;
  let backendSuccess = false;

  // 1. Attempt Firestore client write
  if (isConfigured && db) {
    try {
      await setDoc(doc(db, 'users', uid), payload, { merge: true });
      firestoreSuccess = true;
    } catch (dbErr) {
      console.warn('[RoleService] Firestore client write failed (falling back to backend sync):', dbErr.message);
    }
  }

  // 2. Authoritative backend role synchronization
  try {
    const res = await fetch('/api/auth/sync-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      backendSuccess = true;
    } else {
      console.warn('[RoleService] Backend sync-role returned status:', res.status);
    }
  } catch (apiErr) {
    console.warn('[RoleService] Backend sync-role network error:', apiErr.message);
  }

  // 3. Cache locally
  saveLocalUser(cleanEmail, payload);

  // If both network persistence layers failed and we're online, flag warning
  if (isConfigured && !firestoreSuccess && !backendSuccess) {
    console.error('[RoleService] CRITICAL: Both Firestore and Backend role persistence failed.');
  }

  return payload;
}
