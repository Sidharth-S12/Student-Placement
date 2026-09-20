import express from 'express';
import {
  listStudents,
  getProfile,
  updateProfile,
  getStudentHistory,
  migrateLegacy
} from '../controllers/studentController.js';

const router = express.Router();

// GET /api/students (listing with department & search filters)
router.get('/', listStudents);

// GET /api/students/:studentId/history (assessment history)
router.get('/:studentId/history', getStudentHistory);

// GET /api/students/:studentId (single profile)
router.get('/:studentId', getProfile);

// POST /api/students/profile
router.post('/profile', updateProfile);

// POST /api/students/migrate-legacy
router.post('/migrate-legacy', migrateLegacy);

export default router;
