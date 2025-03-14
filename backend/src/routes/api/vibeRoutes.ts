import { Router } from 'express';
import { analyzeAndStoreUserVibes, fetchUserVibes } from '../../controllers/vibesController';
const router = Router();

router.post('/analyze/:username', analyzeAndStoreUserVibes);
router.get('/:username', fetchUserVibes);


export default router;
