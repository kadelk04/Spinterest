import { Router } from 'express';
import { analyzeAndStoreUserVibes, fetchUserVibes,  testAnalyzeUserVibes, fetchTrackFeatures, getUserSavedTracks , getTrackFeatures } from '../../controllers/tracksController'; // Adjust path as needed

const router = Router();

router.post('/determineUserVibe/:username', analyzeAndStoreUserVibes);
router.get('/:username', fetchUserVibes);
router.post('/test/:username', testAnalyzeUserVibes);
router.get('/track/:trackId', getTrackFeatures);
router.post('/testtracks/:username', async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '') || '';
      const data = await getUserSavedTracks(token);
      res.status(200).json(data);
    } catch (error) {
      console.error('Error in test endpoint:', error);
      res.status(500).json({ error: 'Failed to get tracks' });
    }
  });


export default router;
