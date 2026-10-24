import express from 'express';
import {
  requireCompanyAuth,
  getCompanyProfileHandler,
  updateCompanyProfileHandler,
  getCompanyOverviewHandler,
  getCompanyDrivesHandler,
  createCompanyDriveHandler,
  updateCompanyDriveHandler,
  deleteCompanyDriveHandler,
  getJobEligibleStudentsHandler,
  getJobCandidatesHandler,
  updateApplicationStatusHandler,
  getCompanyStudentProfileHandler,
  toggleJobCandidateShortlistHandler
} from '../controllers/companyController.js';

const router = express.Router();

// All company routes strictly require authenticated company recruiter role
router.use(requireCompanyAuth);

// Company Profile & Overview
router.get('/profile', getCompanyProfileHandler);
router.put('/profile', updateCompanyProfileHandler);
router.get('/overview', getCompanyOverviewHandler);

// Company Drives & Jobs
router.get('/drives', getCompanyDrivesHandler);
router.post('/drives', createCompanyDriveHandler);
router.put('/drives/:id', updateCompanyDriveHandler);
router.delete('/drives/:id', deleteCompanyDriveHandler);

// Candidates & Eligibility for Specific Drives
router.get('/drives/:id/eligible-students', getJobEligibleStudentsHandler);
router.get('/drives/:id/candidates', getJobCandidatesHandler);
router.post('/drives/:id/shortlist', toggleJobCandidateShortlistHandler);

// Candidate Application Management
router.patch('/applications/:id/status', updateApplicationStatusHandler);
router.put('/applications/:id/status', updateApplicationStatusHandler);

// Authorized Student Profile (Data-minimized)
router.get('/students/:studentId', getCompanyStudentProfileHandler);

export default router;
