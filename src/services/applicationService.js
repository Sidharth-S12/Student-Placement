import { getAuthHeaders } from './firebaseClient';

/**
 * Job Applications & Placement Nominations Client Service
 */

/**
 * Fetches all campus placement drives.
 */
export async function fetchActiveDrives() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/admin/drives', { headers });
    if (res.ok) {
      const data = await res.json();
      return data.drives || [];
    }
  } catch (err) {
    console.error('[ApplicationService] fetchActiveDrives failed:', err);
  }
  return [];
}

/**
 * Submits a student direct application to a job drive.
 */
export async function applyToDrive({ jobId, coverNote = '' }) {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/applications/apply', {
    method: 'POST',
    headers,
    body: JSON.stringify({ jobId, coverNote })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to submit application.');
  }
  return data;
}

/**
 * Fetches direct applications submitted by the logged-in student.
 */
export async function fetchMyApplications() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/applications/my-applications', { headers });
    if (res.ok) {
      const data = await res.json();
      return data.applications || [];
    }
  } catch (err) {
    console.error('[ApplicationService] fetchMyApplications failed:', err);
  }
  return [];
}

/**
 * Fetches officer nominations for the logged-in student.
 */
export async function fetchMyNominations() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/applications/my-nominations', { headers });
    if (res.ok) {
      const data = await res.json();
      return data.nominations || [];
    }
  } catch (err) {
    console.error('[ApplicationService] fetchMyNominations failed:', err);
  }
  return [];
}

/**
 * Responds to a nomination (consent acceptance or decline).
 */
export async function respondToNomination({ appId, action }) {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/applications/respond-nomination', {
    method: 'POST',
    headers,
    body: JSON.stringify({ appId, action })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to respond to nomination.');
  }
  return data;
}

/**
 * Withdraws a student's active application.
 */
export async function withdrawApplication(appId) {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/applications/${encodeURIComponent(appId)}/withdraw`, {
    method: 'POST',
    headers
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to withdraw application.');
  }
  return data;
}

/**
 * Fetches in-app notifications for the current user.
 */
export async function fetchNotifications() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/notifications', { headers });
    if (res.ok) {
      const data = await res.json();
      return {
        notifications: data.notifications || [],
        unreadCount: data.unreadCount || 0
      };
    }
  } catch (err) {
    console.error('[ApplicationService] fetchNotifications failed:', err);
  }
  return { notifications: [], unreadCount: 0 };
}

/**
 * Marks a single notification as read.
 */
export async function markNotificationAsRead(notifId) {
  try {
    const headers = await getAuthHeaders();
    await fetch(`/api/notifications/${encodeURIComponent(notifId)}/read`, {
      method: 'PATCH',
      headers
    });
  } catch (err) {
    console.warn('[ApplicationService] markNotificationAsRead failed:', err);
  }
}

/**
 * Marks all notifications as read.
 */
export async function markAllNotificationsAsRead() {
  try {
    const headers = await getAuthHeaders();
    await fetch('/api/notifications/read-all', {
      method: 'PATCH',
      headers
    });
  } catch (err) {
    console.warn('[ApplicationService] markAllNotificationsAsRead failed:', err);
  }
}
