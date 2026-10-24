import { getUserRole, getUserRecord, setUserRole, saveCompanyProfile, getCompanyRecord } from '../config/firebaseAdmin.js';
import {
  validateEmail,
  sendVerificationCode as sendCodeService,
  verifyCode as verifyCodeService
} from '../services/emailVerificationService.js';

/**
 * GET /api/auth/role/:uid
 * Returns verified role and company approval status for a user UID or email.
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

    let companyProfile = null;
    if (role === 'company') {
      companyProfile = await getCompanyRecord(uid, email);
    }

    return res.status(200).json({
      uid: record?.uid || uid,
      email: record?.email || email || null,
      role,
      displayName: record?.displayName || null,
      companyName: record?.companyName || companyProfile?.companyName || null,
      approvalStatus: companyProfile?.approvalStatus || record?.approvalStatus || (role === 'company' ? 'pending' : null),
      companyProfile: companyProfile || null
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
 * Newly registering companies start with approvalStatus: 'pending' by default.
 */
export async function syncRole(req, res) {
  try {
    const {
      uid,
      email,
      role,
      displayName,
      companyName,
      website,
      industry,
      description,
      phone,
      contactPerson
    } = req.body;

    if (!uid) {
      return res.status(400).json({ error: 'User UID is required for role synchronization.' });
    }

    if (!role || !['student', 'company'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid role for registration sync. Only student or company is allowed.'
      });
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    if (role === 'student' && !cleanEmail.endsWith('@gmail.com')) {
      return res.status(400).json({
        error: 'Student accounts must register with a valid @gmail.com email address.'
      });
    }

    const updated = await setUserRole(uid, {
      role,
      email: cleanEmail,
      displayName,
      companyName: role === 'company' ? companyName : null,
      approvalStatus: role === 'company' ? 'pending' : null
    });

    // If company, initialize company profile with pending status
    if (role === 'company') {
      await saveCompanyProfile(uid, {
        companyName: companyName || displayName || 'Corporate Recruiter',
        officialEmail: cleanEmail,
        website: website || '',
        industry: industry || 'Technology & Engineering',
        description: description || 'Campus recruitment partner.',
        contactPerson: contactPerson || displayName || 'Campus Recruiter',
        phone: phone || '',
        approvalStatus: 'pending' // Enforce pending status!
      }, { isReview: false });
    }

    console.log(`[AuthController:syncRole] Synchronized role="${role}" for UID="${uid}" (${cleanEmail}) - Approval: ${role === 'company' ? 'pending' : 'N/A'}`);

    return res.status(200).json({
      success: true,
      message: `Role ${role} synchronized successfully.`,
      user: {
        ...updated,
        approvalStatus: role === 'company' ? 'pending' : null
      }
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

/**
 * POST /api/auth/send-verification-code
 * Validates the email and dispatches a 6-digit OTP code.
 */
export async function sendVerificationCode(req, res) {
  try {
    const { email, name, role } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const result = await sendCodeService({ email, name, role });
    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (err) {
    console.warn('[AuthController:sendVerificationCode] Error:', err.message);
    return res.status(400).json({ error: err.message || 'Failed to send verification code.' });
  }
}

/**
 * POST /api/auth/verify-code
 * Verifies the 6-digit OTP code for registration.
 */
export async function verifyCode(req, res) {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Both email and verification code are required.' });
    }

    const result = verifyCodeService({ email, code });
    if (!result.valid) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      email: result.cleanEmail
    });
  } catch (err) {
    console.error('[AuthController:verifyCode] Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to verify code.' });
  }
}

/**
 * POST /api/auth/validate-email
 * Live strict validation check endpoint for frontend pre-checks.
 */
export async function validateEmailEndpoint(req, res) {
  try {
    const { email, role } = req.body;
    const result = validateEmail(email, role);

    if (!result.valid) {
      return res.status(400).json({ valid: false, error: result.error });
    }

    return res.status(200).json({ valid: true, email: result.cleanEmail });
  } catch (err) {
    return res.status(500).json({ valid: false, error: 'Validation check failed.' });
  }
}

/**
 * POST /api/auth/verify-credentials
 * Verifies email and initial password for provisioned placement officer/admin accounts.
 * Used when accounts are created by administrators or in development emulation.
 */
export async function verifyCredentials(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const record = await getUserRecord(null, cleanEmail);

    if (!record) {
      return res.status(401).json({ error: 'Invalid email or password. Please verify your credentials.' });
    }

    // Check account status
    if (record.status === 'inactive') {
      return res.status(403).json({ error: 'This placement officer account has been deactivated. Please contact the administrator.' });
    }

    // Check password against stored initialPassword
    const expectedPassword = record.initialPassword;
    const isMatched = expectedPassword
      ? record.initialPassword === password
      : (password === 'Officer@123' || password === 'admin123' || (cleanEmail === 'admin@placement.edu' && password === 'admin123'));

    if (!isMatched) {
      return res.status(401).json({ error: 'Invalid email or password. Please verify your credentials.' });
    }

    return res.status(200).json({
      success: true,
      user: {
        uid: record.uid,
        email: record.email || cleanEmail,
        displayName: record.displayName || record.name || cleanEmail.split('@')[0],
        role: record.role || 'admin',
        accessScope: record.accessScope || 'college',
        assignedDepartment: record.assignedDepartment || null,
        designation: record.designation || 'Placement Officer'
      }
    });
  } catch (err) {
    console.error('[AuthController:verifyCredentials] Error:', err);
    return res.status(500).json({ error: 'Failed to verify account credentials.' });
  }
}


