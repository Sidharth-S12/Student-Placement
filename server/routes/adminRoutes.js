import express from 'express';
import {
  requireAdminAuth,
  requirePrimaryAdminAuth,
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
  updateApplicationStatus,
  runKMeansPython,
  verifyOfficerLoginHandler
} from '../controllers/adminController.js';

const router = express.Router();

// Placement Officer Authentication Verification
router.post('/verify-login', verifyOfficerLoginHandler);

// Placement Officers Management (Creation and modification strictly restricted to Primary Super Admin)
router.get('/officers', listOfficers);
router.post('/officers', requirePrimaryAdminAuth, createOfficer);
router.put('/officers/:uid', requirePrimaryAdminAuth, updateOfficer);
router.patch('/officers/:uid/status', requirePrimaryAdminAuth, toggleOfficerStatusHandler);
router.delete('/officers/:uid', requirePrimaryAdminAuth, deleteOfficer);

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

// Python Machine Learning K-Means Clustering
router.post('/kmeans', runKMeansPython);
router.get('/kmeans', runKMeansPython);

export default router;

