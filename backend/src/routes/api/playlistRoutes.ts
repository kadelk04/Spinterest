import { Router } from 'express';

import {
  addPlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylistById,
  deletePlaylistById,
  pinPlaylistById,
  getPinnedPlaylist,
} from '../../controllers/playlistController';
import { authenticateUser } from '../../middleware/auth';

const router = Router();

router.get('/', getAllPlaylists);
router.post('/', addPlaylist);
router.get('/:playlistId', getPlaylistById);
router.put('/:playlistId', updatePlaylistById);
router.delete('/:playlistId', deletePlaylistById);
router.put('/pin-playlist/:playlistId', pinPlaylistById);
router.get('/pinned-playlists', getPinnedPlaylist);

export default router;
