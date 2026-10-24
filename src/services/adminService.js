import { getAuthHeaders } from './firebaseClient';

/**
 * Safely parses response body as JSON.
 * Avoids throwing "Unexpected end of JSON input" when response is empty, non-JSON, or error page.
 */
async function safeParseResponse(res, defaultErrorMsg = 'Server request failed.') {
  const contentType = res.headers.get('content-type') || '';
  let payload = null;

  if (contentType.includes('application/json')) {
    try {
      payload = await res.json();
    } catch (parseErr) {
      console.warn('[AdminService] JSON parse warning:', parseErr);
    }
  } else {
    try {
      const text = await res.text();
      if (text && text.trim()) {
        payload = { error: text.trim() };
      }
    } catch (_) {}
  }

  if (!res.ok) {
    const errorMsg =
      payload?.error ||
      payload?.message ||
      `${defaultErrorMsg} (Server returned ${res.status}: ${res.statusText || 'Error'})`;
    throw new Error(errorMsg);
  }

  return payload || {};
}

/**
 * Placement Admin & Officer Services
 */

export async function fetchOfficers() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/admin/officers', { headers });
    if (res.ok) {
      const data = await safeParseResponse(res, 'Failed to fetch placement officers.');
      return data.officers || [];
    }
  } catch (err) {
    console.error('[AdminService] fetchOfficers failed:', err);
  }
  return [];
}

export async function addOfficer(officerData) {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/admin/officers', {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(officerData)
  });

  const data = await safeParseResponse(res, 'Failed to add placement officer.');
  return data.officer;
}

export async function updateOfficer(uid, updates) {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/admin/officers/${encodeURIComponent(uid)}`, {
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });

  const data = await safeParseResponse(res, 'Failed to update placement officer.');
  return data.officer;
}

export async function toggleOfficerStatus(uid, status) {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/admin/officers/${encodeURIComponent(uid)}/status`, {
    method: 'PATCH',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  });

  const data = await safeParseResponse(res, 'Failed to update officer status.');
  return data.officer;
}

export async function removeOfficer(uid) {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/admin/officers/${encodeURIComponent(uid)}`, {
    method: 'DELETE',
    headers
  });

  const data = await safeParseResponse(res, 'Failed to remove placement officer.');
  return data;
}

export async function fetchDrives() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/admin/drives', { headers });
    if (res.ok) {
      const data = await safeParseResponse(res, 'Failed to fetch recruitment drives.');
      return data.drives || [];
    }
  } catch (err) {
    console.error('[AdminService] fetchDrives failed:', err);
  }
  return [];
}

export async function saveDrive(driveData) {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/admin/drives', {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(driveData)
  });

  const data = await safeParseResponse(res, 'Failed to save campus recruitment drive.');
  return data.drive;
}

export async function deleteDrive(id) {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/admin/drives/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers
  });

  const data = await safeParseResponse(res, 'Failed to delete recruitment drive.');
  return data;
}

export async function fetchCampusSummary() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/admin/analytics/summary', { headers });
    if (res.ok) {
      return await safeParseResponse(res, 'Failed to fetch campus analytics summary.');
    }
  } catch (err) {
    console.error('[AdminService] fetchCampusSummary failed:', err);
  }
  return null;
}

export async function fetchAdminApplications() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/admin/applications', { headers });
    if (res.ok) {
      const data = await res.json();
      return data.applications || [];
    }
  } catch (err) {
    console.error('[AdminService] fetchAdminApplications failed:', err);
  }
  return [];
}

export async function updateApplicationStatus(id, { status, note }) {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/admin/applications/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status, note })
  });

  const data = await safeParseResponse(res, 'Failed to update application status.');
  return data.application;
}

/**
 * Company Registration Review & Approval Services
 */
export async function fetchAdminCompanies({ status = 'all', search = '' } = {}) {
  try {
    const headers = await getAuthHeaders();
    const query = new URLSearchParams();
    if (status && status !== 'all') query.set('status', status);
    if (search && search.trim()) query.set('search', search.trim());

    const res = await fetch(`/api/admin/companies?${query.toString()}`, { headers });
    if (res.ok) {
      const data = await safeParseResponse(res, 'Failed to fetch companies.');
      return {
        companies: data.companies || [],
        totalCount: data.totalCount || 0,
        counts: data.counts || {}
      };
    } else {
      console.warn(`[AdminService] fetchAdminCompanies returned status ${res.status}`);
    }
  } catch (err) {
    console.error('[AdminService] fetchAdminCompanies failed:', err);
  }
  return { companies: [], totalCount: 0, counts: {} };
}

export async function fetchAdminCompanyDetails(companyId) {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/admin/companies/${encodeURIComponent(companyId)}`, { headers });
  const data = await safeParseResponse(res, 'Failed to fetch company profile.');
  return data;
}

export async function reviewCompany(companyId, { status, reason = '' }) {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/admin/companies/${encodeURIComponent(companyId)}/review`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status, reason })
  });

  const data = await safeParseResponse(res, 'Failed to review company registration.');
  return data.company;
}

/**
 * Job Role Review & Approval Services
 */
export async function fetchAdminJobs({ status = 'all', search = '' } = {}) {
  try {
    const headers = await getAuthHeaders();
    const query = new URLSearchParams();
    if (status && status !== 'all') query.set('status', status);
    if (search && search.trim()) query.set('search', search.trim());

    const res = await fetch(`/api/admin/jobs?${query.toString()}`, { headers });
    if (res.ok) {
      const data = await safeParseResponse(res, 'Failed to fetch job roles.');
      return {
        jobs: data.jobs || [],
        totalCount: data.totalCount || 0,
        counts: data.counts || {}
      };
    } else {
      console.warn(`[AdminService] fetchAdminJobs returned status ${res.status}`);
    }
  } catch (err) {
    console.error('[AdminService] fetchAdminJobs failed:', err);
  }
  return { jobs: [], totalCount: 0, counts: {} };
}

export async function reviewJob(jobId, { status, reason = '' }) {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/admin/jobs/${encodeURIComponent(jobId)}/review`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status, reason })
  });

  const data = await safeParseResponse(res, 'Failed to review job role.');
  return data.drive;
}


