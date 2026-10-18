import express from 'express';
import {
  listOfficers,
  createOfficer,
  deleteOfficer,
  listDrives,
  createOrUpdateDrive,
  removeDrive,
  getCampusSummary
} from '../controllers/adminController.js';

const router = express.Router();

// Placement Officers Management
router.get('/officers', listOfficers);
router.post('/officers', createOfficer);
router.delete('/officers/:uid', deleteOfficer);

// Campus Placement Drives Management
router.get('/drives', listDrives);
router.post('/drives', createOrUpdateDrive);
router.delete('/drives/:id', removeDrive);

// Campus Institutional Analytics
router.get('/analytics/summary', getCampusSummary);

export default router;
