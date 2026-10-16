import { Router } from 'express';
import {
  startAssessment,
  submitAnswer,
  getNextQuestion,
  getLatestAssessment,
  getAssessmentById,
  generateQuestion
} from '../controllers/assessmentController.js';

const router = Router();

// Assessment Session Management
router.post('/start', startAssessment);
router.post('/answer', submitAnswer);
router.post('/next-question', getNextQuestion);
router.post('/generate-question', generateQuestion);

// Assessment Data Retrieval
router.get('/latest', getLatestAssessment);
router.get('/:assessmentId', getAssessmentById);

export default router;
