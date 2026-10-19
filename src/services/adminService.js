import { getAuthHeaders } from './firebaseClient';

/**
 * Placement Admin & Officer Services
 */

export async function fetchOfficers() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/admin/officers', { headers });
    if (res.ok) {
      const data = await res.json();
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

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to add placement officer.');
  }
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

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update placement officer.');
  }
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

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update officer status.');
  }
  return data.officer;
}

export async function removeOfficer(uid) {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/admin/officers/${encodeURIComponent(uid)}`, {
    method: 'DELETE',
    headers
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to remove placement officer.');
  }
  return data;
}

export async function fetchDrives() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/admin/drives', { headers });
    if (res.ok) {
      const data = await res.json();
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

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to save recruitment drive.');
  }
  return data.drive;
}

export async function deleteDrive(id) {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/admin/drives/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete recruitment drive.');
  }
  return data;
}

export async function fetchCampusSummary() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/admin/analytics/summary', { headers });
    if (res.ok) {
      return await res.json();
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

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update application status.');
  }
  return data.application;
}

