import express from 'express';
import { getRole, setRole, syncRole } from '../controllers/authController.js';

const router = express.Router();

// GET /api/auth/role/:uid
router.get('/role/:uid', getRole);

// POST /api/auth/sync-role (Registration role persistence)
router.post('/sync-role', syncRole);

// POST /api/auth/set-role (Admin management)
router.post('/set-role', setRole);

export default router;
