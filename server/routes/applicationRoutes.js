import express from 'express';
import {
  applyToJob,
  getMyApplications,
  getMyNominations,
  respondNomination,
  withdrawApplication,
  nominateCandidates,
  getJobCandidates,
  getAllApplicationsAdmin,
  updateCandidateStatus,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../controllers/applicationController.js';

const router = express.Router();

// Student Endpoints
router.post('/apply', applyToJob);
router.get('/my-applications', getMyApplications);
router.get('/my-nominations', getMyNominations);
router.post('/respond-nomination', respondNomination);
router.post('/:id/withdraw', withdrawApplication);

// Placement Officer / Admin Endpoints
router.post('/nominate', nominateCandidates);
router.get('/all', getAllApplicationsAdmin);

// Recruiter / Admin Endpoints
router.get('/job/:jobId', getJobCandidates);
router.patch('/:id/status', updateCandidateStatus);

// In-App Notification Endpoints
router.get('/notifications', getNotifications);
router.patch('/notifications/read-all', markAllNotificationsAsRead);
router.patch('/notifications/:id/read', markNotificationAsRead);

export default router;
