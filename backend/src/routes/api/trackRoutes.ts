import { Router } from 'express';
import { analyzeAndStoreUserVibes, fetchUserVibes } from '../../controllers/tracksController'; // Adjust path as needed

const router = Router();

router.post('/user/vibes', analyzeAndStoreUserVibes);
router.get('/user/vibes/:username', fetchUserVibes);

export default router;
