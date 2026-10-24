import express from 'express';
import {
  getRole,
  setRole,
  syncRole,
  sendVerificationCode,
  verifyCode,
  validateEmailEndpoint
} from '../controllers/authController.js';

const router = express.Router();

// GET /api/auth/role/:uid
router.get('/role/:uid', getRole);

// POST /api/auth/sync-role (Registration role persistence)
router.post('/sync-role', syncRole);

// POST /api/auth/set-role (Admin management)
router.post('/set-role', setRole);

// POST /api/auth/send-verification-code (Send OTP)
router.post('/send-verification-code', sendVerificationCode);

// POST /api/auth/verify-code (Verify OTP)
router.post('/verify-code', verifyCode);

// POST /api/auth/validate-email (Strict email syntax check)
router.post('/validate-email', validateEmailEndpoint);

export default router;

