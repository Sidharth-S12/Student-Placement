import express from 'express';
import {
  listOfficers,
  createOfficer,
  updateOfficer,
  toggleOfficerStatusHandler,
  deleteOfficer,
  listDrives,
  createOrUpdateDrive,
  removeDrive,
  getCampusSummary,
  listApplications,
  updateApplicationStatus
} from '../controllers/adminController.js';

const router = express.Router();

// Placement Officers Management
router.get('/officers', listOfficers);
router.post('/officers', createOfficer);
router.put('/officers/:uid', updateOfficer);
router.patch('/officers/:uid/status', toggleOfficerStatusHandler);
router.delete('/officers/:uid', deleteOfficer);

// Campus Placement Drives Management
router.get('/drives', listDrives);
router.post('/drives', createOrUpdateDrive);
router.delete('/drives/:id', removeDrive);

// Campus Applications & Placement Tracking Management
router.get('/applications', listApplications);
router.patch('/applications/:id/status', updateApplicationStatus);

// Campus Institutional Analytics
router.get('/analytics/summary', getCampusSummary);

export default router;

