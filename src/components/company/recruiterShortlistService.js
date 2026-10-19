/**
 * Recruiter Shortlist & Preferences Storage Service
 * Provides persistent local management for company shortlisted candidates and recruiter settings.
 */

const SHORTLIST_STORAGE_PREFIX = 'placement_recruiter_shortlist_';
const PROFILE_STORAGE_PREFIX = 'placement_recruiter_profile_';

export function getRecruiterShortlist(recruiterId) {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const key = `${SHORTLIST_STORAGE_PREFIX}${recruiterId || 'default'}`;
    const raw = window.localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('[RecruiterService] Failed to read shortlist:', err);
  }
  return [];
}

export function saveRecruiterShortlist(recruiterId, shortlist) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const key = `${SHORTLIST_STORAGE_PREFIX}${recruiterId || 'default'}`;
    window.localStorage.setItem(key, JSON.stringify(shortlist));
  } catch (err) {
    console.warn('[RecruiterService] Failed to save shortlist:', err);
  }
}

export function getRecruiterProfile(recruiterId, fallbackUser = {}) {
  const defaultProfile = {
    companyName: fallbackUser.displayName || 'Campus Hiring Partner',
    recruiterEmail: fallbackUser.email || 'recruiter@company.com',
    industry: 'Technology & Software Engineering',
    contactPerson: fallbackUser.displayName || 'Hiring Lead',
    phone: '+91 98765 43210',
    website: 'https://careers.company.com',
    targetMinCgpa: 7.0,
    targetMinReadiness: 65,
    targetDepartments: ['CSE', 'ECE', 'AI & DS'],
    keySkillsRequired: ['Python', 'React', 'Data Structures', 'SQL']
  };

  if (typeof window === 'undefined' || !window.localStorage) return defaultProfile;

  try {
    const key = `${PROFILE_STORAGE_PREFIX}${recruiterId || 'default'}`;
    const raw = window.localStorage.getItem(key);
    if (raw) {
      return { ...defaultProfile, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.warn('[RecruiterService] Failed to read company profile:', err);
  }

  return defaultProfile;
}

export function saveRecruiterProfile(recruiterId, profile) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const key = `${PROFILE_STORAGE_PREFIX}${recruiterId || 'default'}`;
    window.localStorage.setItem(key, JSON.stringify(profile));
  } catch (err) {
    console.warn('[RecruiterService] Failed to save company profile:', err);
  }
}
