import { Router } from 'express';

import {
  getProfileInfo,
  getPlaylists,
  getFriends,
  getPlaylistTracks,
  getUserPlaylists,
  getUserPlaylistTracks,
  getArtistInfo,
  getPlaylist,
  getMyPlaylists,
  getMultipleArtistInfo,
} from '../../controllers/spotifyController';
import { authenticateUser } from '../../middleware/auth';

const router = Router();

router.get('/profile', authenticateUser, getProfileInfo);
router.get('/playlists', authenticateUser, getMyPlaylists);
router.get('/friends', authenticateUser, getFriends);
router.get('/playlists/:playlistId', authenticateUser, getPlaylistTracks);
router.get('/user/:userId/playlists/', authenticateUser, getUserPlaylists);
router.get(
  '/user/:userId/playlists/:playlistId',
  authenticateUser,
  getUserPlaylistTracks
);
router.get('/artist/:artistId', authenticateUser, getArtistInfo);
router.get('/artists', authenticateUser, getMultipleArtistInfo);

export default router;
