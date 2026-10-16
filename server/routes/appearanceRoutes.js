import { Router } from 'express';
import { analyzeAppearance, getAppearanceStatus } from '../controllers/appearanceController.js';

const router = Router();

router.post('/analyze', analyzeAppearance);
router.get('/status', getAppearanceStatus);

export default router;
