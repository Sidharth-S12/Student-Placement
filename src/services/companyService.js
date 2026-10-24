import { getAuthHeaders } from './firebaseClient';

/**
 * Company Recruiter Client Service
 */

export async function fetchCompanyProfile() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/company/profile', { headers });
    if (res.ok) {
      const data = await res.json();
      return data.profile || null;
    }
  } catch (err) {
    console.error('[CompanyService] fetchCompanyProfile failed:', err);
  }
  return null;
}

export async function updateCompanyProfile(profileData) {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/company/profile', {
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profileData)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update company profile.');
  }
  return data.profile;
}

export async function fetchCompanyDrives() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/company/drives', { headers });
    if (res.ok) {
      const data = await res.json();
      return data.drives || [];
    }
  } catch (err) {
    console.error('[CompanyService] fetchCompanyDrives failed:', err);
  }
  return [];
}

export async function postCompanyDrive(driveData) {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/company/drives', {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(driveData)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to submit recruitment drive.');
  }
  return data.drive;
}

export async function updateCompanyDrive(id, driveData) {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/company/drives/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(driveData)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update recruitment drive.');
  }
  return data.drive;
}

export async function fetchCompanyOverview() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/company/overview', { headers });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.error('[CompanyService] fetchCompanyOverview failed:', err);
  }
  return null;
}

export async function deleteCompanyDrive(id) {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/company/drives/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete recruitment drive.');
  }
  return data;
}

export async function fetchJobEligibleStudents(jobId) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/company/drives/${encodeURIComponent(jobId)}/eligible-students`, { headers });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.error('[CompanyService] fetchJobEligibleStudents failed:', err);
  }
  return { success: false, eligibleStudents: [], drive: null, criteria: null };
}

export async function fetchJobCandidates(jobId) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/company/drives/${encodeURIComponent(jobId)}/candidates`, { headers });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.error('[CompanyService] fetchJobCandidates failed:', err);
  }
  return { drive: null, directApplicants: [], nominations: [], candidates: [], summary: {} };
}

export async function toggleJobCandidateShortlist(jobId, studentId) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/company/drives/${encodeURIComponent(jobId)}/shortlist`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ studentId })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to toggle candidate shortlist.');
    }
    return data;
  } catch (err) {
    console.error('[CompanyService] toggleJobCandidateShortlist failed:', err);
    throw err;
  }
}

export async function updateApplicationStatus(applicationId, payload) {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/company/applications/${encodeURIComponent(applicationId)}/status`, {
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update candidate status.');
  }
  return data.application;
}

export async function fetchCompanyStudentProfile(studentId) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/company/students/${encodeURIComponent(studentId)}`, { headers });
    if (res.ok) {
      const data = await res.json();
      return data.student || null;
    }
  } catch (err) {
    console.error('[CompanyService] fetchCompanyStudentProfile failed:', err);
  }
  return null;
}

