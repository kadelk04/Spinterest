import { Router } from 'express';

import {
  addPlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylistById,
  deletePlaylistById,
  removeFromProfile,
} from '../../controllers/playlistController';
import { authenticateUser } from '../../middleware/auth';

const router = Router();

router.get('/', getAllPlaylists);
router.post('/', addPlaylist);
router.get('/:playlistId', getPlaylistById);
router.put('/:playlistId', updatePlaylistById);
router.delete('/:playlistId', deletePlaylistById);
router.put('/:playlistId/removeFromProfile', removeFromProfile);

export default router;
