import { Router } from 'express';

import {
  addPlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylistById,
  deletePlaylistById,
} from '../../controllers/playlistController';

const router = Router();

router.get('/', getAllPlaylists);
router.put('/', addPlaylist);
router.get('/:playlistId', getPlaylistById);
router.put('/:playlistId', updatePlaylistById);
router.delete('/:playlistId', deletePlaylistById);

export default router;
