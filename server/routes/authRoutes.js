import express from 'express';
import { getRole, setRole } from '../controllers/authController.js';

const router = express.Router();

// GET /api/auth/role/:uid
router.get('/role/:uid', getRole);

// POST /api/auth/set-role
router.post('/set-role', setRole);

export default router;
