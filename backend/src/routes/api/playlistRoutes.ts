import { Router } from 'express';

import {
  addPlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylistById,
  deletePlaylistById,
  likePlaylist,
} from '../../controllers/playlistController';

const router = Router();

router.get('/', getAllPlaylists);
router.post('/', addPlaylist);
router.get('/:playlistId', getPlaylistById);
router.put('/:playlistId', updatePlaylistById);
router.delete('/:playlistId', deletePlaylistById);
router.put('/:playlistId/like', likePlaylist);

export default router;
