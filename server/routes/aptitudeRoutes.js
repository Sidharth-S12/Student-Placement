import { Router } from 'express';
import {
  startAptitudeAssessment,
  submitAptitudeAnswer,
  getLatestAptitudeAssessment,
  getAptitudeAssessmentById
} from '../controllers/aptitudeController.js';

const router = Router();

// Aptitude Assessment Session
router.post('/start', startAptitudeAssessment);
router.post('/submit', submitAptitudeAnswer);

// Aptitude History & Results
router.get('/latest', getLatestAptitudeAssessment);
router.get('/:id', getAptitudeAssessmentById);

export default router;
