import { Router } from 'express';
import { getUserSavedTracks , getTrackFeatures } from '../../controllers/tracksController'; 
import { analyzeAndStoreUserVibes, fetchUserVibes } from '../../controllers/vibesController';
const router = Router();

router.get('/savedtracks', getUserSavedTracks);
router.get('/track/:trackId', getTrackFeatures);
router.post('/analyze/:username', analyzeAndStoreUserVibes);
router.get('/:username', fetchUserVibes);


export default router;
