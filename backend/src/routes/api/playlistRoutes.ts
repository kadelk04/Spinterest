import { Router } from 'express';

import {
  addPlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylistById,
  deletePlaylistById,
} from '../../controllers/playlistController';
import { authenticateUser } from '../../middleware/auth';

const router = Router();

router.get('/', authenticateUser, getAllPlaylists);
router.post('/', authenticateUser, addPlaylist);
router.get('/:playlistId', authenticateUser, getPlaylistById);
router.put('/:playlistId', authenticateUser, updatePlaylistById);
router.delete('/:playlistId', authenticateUser, deletePlaylistById);

export default router;
