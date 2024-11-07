import { Router } from 'express';

import {
  getProfileInfo,
  getPlaylists,
  getFriends,
  getPlaylistTracks,
  getUserPlaylists,
  getUserPlaylistTracks,
} from '../../controllers/spotifyController';

const router = Router();

router.get('/profile', getProfileInfo);
router.get('/playlists', getPlaylists);
router.get('/friends', getFriends);
router.get('/playlists/:playlistId', getPlaylistTracks);
router.get('/user/:userId/playlists/', getUserPlaylists);
router.get('/user/:userId/playlists/:playlistId', getUserPlaylistTracks);

export default router;
