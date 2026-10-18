import { getAuthHeaders } from './firebaseClient';

const API_BASE = '/api/appearance';

/**
 * Service to interact with the backend AI Professional Appearance Analyzer
 */

export async function checkAppearanceStatus() {
  try {
    const response = await fetch(`${API_BASE}/status`);
    if (!response.ok) {
      throw new Error(`Status check failed with HTTP ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.warn('[AppearanceService] Status check error:', err.message);
    return { status: 'offline', error: err.message };
  }
}

export async function analyzeDressCode({ imageDataUrl, interviewContext = 'formal', studentId }) {
  const headers = await getAuthHeaders(studentId);

  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      imageDataUrl,
      interviewContext,
      studentId
    })
  });

  const data = await response.json();

  if (!response.ok && !data.isSetupRequired) {
    throw new Error(data.error || 'Failed to analyze professional attire.');
  }

  return data;
}
