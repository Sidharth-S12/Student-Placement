import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isConfigured, getAuthHeaders } from './firebaseClient';
import { defaultAvatarSvg } from '../data/mockStudentData';

const PROFILE_CACHE_PREFIX = 'placement_student_profile_';

export const createBlankProfile = (uid, user = {}) => {
  const displayName = user?.displayName || (user?.email ? user.email.split('@')[0] : '');
  const email = user?.email || '';

  return {
    uid,
    personalInfo: {
      fullName: displayName,
      headline: '',
      profilePhoto: defaultAvatarSvg,
      email: email,
      phone: '',
      location: '',
      summary: ''
    },
    placementScores: {
      overallReadiness: 0,
      technicalScore: 0,
      aptitudeScore: 0,
      communicationScore: 0
    },
    education: {
      tenthPercentage: '',
      tenthBoard: '',
      tenthYear: '',
      twelfthPercentage: '',
      twelfthBoard: '',
      twelfthYear: '',
      degree: '',
      branch: '',
      college: '',
      cgpa: '',
      graduationYear: ''
    },
    professionalLinks: {
      linkedin: '',
      github: '',
      portfolio: ''
    },
    technicalSkills: {
      programmingLanguages: [],
      frameworks: [],
      databases: [],
      toolsTechnologies: []
    },
    projects: [],
    experience: [],
    certifications: [],
    achievements: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

/**
 * Gets cached profile for a specific UID from localStorage.
 */
export function getCachedProfile(uid) {
  if (!uid || typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(`${PROFILE_CACHE_PREFIX}${uid}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure the cached profile matches the requested UID
      if (parsed && (parsed.uid === uid || !parsed.uid)) {
        return { ...parsed, uid };
      }
    }
  } catch (e) {
    console.warn(`[ProfileService] Error reading cached profile for ${uid}:`, e);
  }
  return null;
}

/**
 * Caches profile for a specific UID to localStorage.
 */
export function setCachedProfile(uid, profileData) {
  if (!uid || typeof window === 'undefined' || !window.localStorage) return;
  try {
    const toSave = { ...profileData, uid };
    window.localStorage.setItem(`${PROFILE_CACHE_PREFIX}${uid}`, JSON.stringify(toSave));
  } catch (e) {
    console.warn(`[ProfileService] Error saving cached profile for ${uid}:`, e);
  }
}

/**
 * Fetches student profile strictly for the authenticated UID.
 * Flow:
 * 1. Checks Firestore students/{uid}
 * 2. Checks Backend API /api/students/{uid}
 * 3. Checks UID-scoped local cache
 * 4. Checks legacy migration if email matches crsid542@gmail.com
 * 5. If no profile exists, creates a fresh new profile using user's authenticated email & name
 * NEVER returns Aarav Sharma or another user's profile.
 */
export async function fetchStudentProfile(uid, user) {
  if (!uid) {
    throw new Error('Authenticated user UID is required to fetch student profile.');
  }

  // 1. Try Firestore client directly if configured
  if (isConfigured && db) {
    try {
      const studentDocRef = doc(db, 'students', uid);
      const snap = await getDoc(studentDocRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data && data.personalInfo) {
          const profile = { ...data, uid };
          setCachedProfile(uid, profile);
          return profile;
        }
      }
    } catch (err) {
      console.warn(`[ProfileService] Firestore read failed for ${uid}:`, err.message);
    }
  }

  // 2. Try Backend API
  try {
    const headers = await getAuthHeaders(uid);
    const res = await fetch(`/api/students/${encodeURIComponent(uid)}`, { headers });
    if (res.ok) {
      const json = await res.json();
      if (json && json.found && json.profile && json.profile.personalInfo) {
        const profile = { ...json.profile, uid };
        setCachedProfile(uid, profile);
        return profile;
      }
    }
  } catch (err) {
    console.warn(`[ProfileService] Backend API read failed for ${uid}:`, err.message);
  }

  // 3. Try UID-scoped cache
  const cached = getCachedProfile(uid);
  if (cached && cached.personalInfo) {
    return cached;
  }

  // 4. Check for legacy account migration (Sidharth S / crsid542@gmail.com)
  if (user?.email && user.email.toLowerCase().trim() === 'crsid542@gmail.com') {
    try {
      const headers = await getAuthHeaders(uid);
      const migRes = await fetch(`/api/students/migrate-legacy`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          legacyEmail: 'crsid542@gmail.com',
          uid,
          displayName: user.displayName || 'Sidharth S'
        })
      });
      if (migRes.ok) {
        const migJson = await migRes.json();
        if (migJson.profile) {
          const profile = { ...migJson.profile, uid };
          setCachedProfile(uid, profile);
          return profile;
        }
      }
    } catch (migErr) {
      console.warn('[ProfileService] Legacy migration attempt failed:', migErr.message);
    }
  }

  // 5. First-time login: Create brand new profile for this UID
  const newProfile = createBlankProfile(uid, user);
  await saveStudentProfile(uid, newProfile);
  return newProfile;
}

/**
 * Persists student profile strictly to students/{uid}.
 */
export async function saveStudentProfile(uid, profileData) {
  if (!uid) throw new Error('Cannot save student profile without a valid UID.');

  const payload = {
    ...profileData,
    uid,
    updatedAt: new Date().toISOString()
  };

  // 1. Update local cache for this UID immediately
  setCachedProfile(uid, payload);

  // 2. Persist to Firestore if configured
  if (isConfigured && db) {
    try {
      const studentDocRef = doc(db, 'students', uid);
      await setDoc(studentDocRef, payload, { merge: true });
    } catch (err) {
      console.warn(`[ProfileService] Firestore write failed for ${uid}:`, err.message);
    }
  }

  // 3. Persist to Backend API
  try {
    const headers = await getAuthHeaders(uid);
    await fetch('/api/students/profile', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        studentId: uid,
        profile: payload
      })
    });
  } catch (err) {
    console.warn(`[ProfileService] Backend API write failed for ${uid}:`, err.message);
  }

  return payload;
}

/**
 * Fetches all registered students for Admin and Company portals.
 * Supports filtering by department, keyword search, or skill query.
 */
export async function fetchAllStudents({ department = 'all', search = '', skill = '' } = {}) {
  try {
    const params = new URLSearchParams();
    if (department && department !== 'all') params.append('department', department);
    if (search && search.trim()) params.append('search', search.trim());
    if (skill && skill.trim()) params.append('skill', skill.trim());

    const headers = await getAuthHeaders();
    const url = `/api/students?${params.toString()}`;
    const res = await fetch(url, { headers });

    if (res.ok) {
      const data = await res.json();
      return {
        students: data.students || [],
        departments: data.departments || [],
        totalCount: data.totalCount || 0
      };
    }
  } catch (err) {
    console.error('[ProfileService] fetchAllStudents failed:', err.message);
  }

  return {
    students: [],
    departments: [],
    totalCount: 0
  };
}

/**
 * Fetches assessment history (technical & aptitude runs) for a specific student.
 */
export async function fetchStudentAssessmentHistory(studentId) {
  if (!studentId) return { technical: [], aptitude: [] };
  try {
    const headers = await getAuthHeaders(studentId);
    const res = await fetch(`/api/students/${encodeURIComponent(studentId)}/history`, { headers });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[ProfileService] fetchStudentAssessmentHistory failed:', err.message);
  }
  return { technical: [], aptitude: [] };
}
