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

    return res.status(200).json({
      uid,
      email: record?.email || email || null,
      role: role || 'student',
      displayName: record?.displayName || null
    });
  } catch (err) {
    console.error('[AuthController:getRole] Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve role.' });
  }
}

/**
 * POST /api/auth/set-role
 * Assigns a verified role to a user.
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
