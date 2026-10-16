import { getUserRole, getUserRecord, setUserRole } from '../config/firebaseAdmin.js';

/**
 * GET /api/auth/role/:uid
 * Returns verified role for a user UID or email.
 */
export async function getRole(req, res) {
  try {
    const { uid } = req.params;
    const { email } = req.query;

    const record = await getUserRecord(uid, email);
    const role = record?.role || await getUserRole(uid, email);

    if (!role) {
      return res.status(404).json({ error: 'Role not found for specified user.' });
    }

    return res.status(200).json({
      uid: record?.uid || uid,
      email: record?.email || email || null,
      role,
      displayName: record?.displayName || null,
      companyName: record?.companyName || null
    });
  } catch (err) {
    console.error('[AuthController:getRole] Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve role.' });
  }
}

/**
 * POST /api/auth/sync-role
 * Synchronizes user role during registration.
 * Allows ONLY 'student' or 'company' from frontend.
 * Admin role is strictly forbidden through this endpoint.
 */
export async function syncRole(req, res) {
  try {
    const { uid, email, role, displayName, companyName } = req.body;

    if (!uid) {
      return res.status(400).json({ error: 'User UID is required for role synchronization.' });
    }

    if (!role || !['student', 'company'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid role for registration sync. Only student or company is allowed.'
      });
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const updated = await setUserRole(uid, {
      role,
      email: cleanEmail,
      displayName,
      companyName: role === 'company' ? companyName : null
    });

    console.log(`[AuthController:syncRole] Synchronized role="${role}" for UID="${uid}" (${cleanEmail})`);

    return res.status(200).json({
      success: true,
      message: `Role ${role} synchronized successfully.`,
      user: updated
    });
  } catch (err) {
    console.error('[AuthController:syncRole] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to synchronize role.' });
  }
}

/**
 * POST /api/auth/set-role
 * Assigns a verified role to a user (Admin CLI / backend only).
 */
export async function setRole(req, res) {
  try {
    const { uid, email, role, displayName } = req.body;

    if (!uid && !email) {
      return res.status(400).json({ error: 'UID or Email is required.' });
    }

    if (!['admin', 'company', 'student'].includes(role)) {
      return res.status(400).json({ error: 'Role must be admin, company, or student.' });
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const effectiveUid = uid || `user_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;

    const updated = await setUserRole(effectiveUid, {
      role,
      email: cleanEmail,
      displayName: displayName || (cleanEmail ? cleanEmail.split('@')[0] : 'User')
    });

    return res.status(200).json({
      success: true,
      message: `Role successfully updated to ${role}.`,
      user: updated
    });
  } catch (err) {
    console.error('[AuthController:setRole] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to update role.' });
  }
}
