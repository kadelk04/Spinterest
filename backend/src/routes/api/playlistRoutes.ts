import { Router } from 'express';

import {
  addPlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylistById,
  deletePlaylistById,
} from '../../controllers/playlistController';
import auth from '../../middleware/auth';

const router = Router();

router.get('/', getAllPlaylists);
router.post('/', addPlaylist);
router.get('/:playlistId', getPlaylistById);
router.put('/:playlistId', updatePlaylistById);
router.delete('/:playlistId', deletePlaylistById);

export default router;
