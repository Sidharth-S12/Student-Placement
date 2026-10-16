import { Router } from 'express';
import {
  startCommunicationAssessment,
  submitCommunicationAnswer,
  evaluatePracticeInterviewAnswer,
  getLatestCommunicationAssessment,
  getCommunicationAssessmentById
} from '../controllers/communicationController.js';

const router = Router();

// Communication & Placement Interview Assessment Session
router.post('/start', startCommunicationAssessment);
router.post('/submit', submitCommunicationAnswer);

// Interactive Mock Interview Practice Studio Evaluation
router.post('/practice-evaluate', evaluatePracticeInterviewAnswer);

// Communication History & Results
router.get('/latest', getLatestCommunicationAssessment);
router.get('/:id', getCommunicationAssessmentById);

export default router;
