import { Router } from 'express';

import {
  createPlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylistById,
  deletePlaylistById,
} from '../../controllers/playlistController';
import auth from '../../middleware/auth';

const router = Router();

router.get('/', getAllPlaylists);
router.post('/', auth, createPlaylist);
router.get('/:playlistId', getPlaylistById);
router.put('/:playlistId', auth, updatePlaylistById);
router.delete('/:playlistId', auth, deletePlaylistById);

export default router;
