import express from 'express';
import {
  requireAdminAuth,
  listOfficers,
  createOfficer,
  updateOfficer,
  toggleOfficerStatusHandler,
  deleteOfficer,
  listDrives,
  createOrUpdateDrive,
  removeDrive,
  listCompaniesAdmin,
  getCompanyDetailsAdmin,
  reviewCompanyAdmin,
  listJobsAdmin,
  reviewJobAdmin,
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

// Company Registration Approval Management
router.get('/companies', requireAdminAuth, listCompaniesAdmin);
router.get('/companies/:id', requireAdminAuth, getCompanyDetailsAdmin);
router.post('/companies/:id/review', requireAdminAuth, reviewCompanyAdmin);

// Job Role Approval Management
router.get('/jobs', requireAdminAuth, listJobsAdmin);
router.post('/jobs/:id/review', requireAdminAuth, reviewJobAdmin);

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

