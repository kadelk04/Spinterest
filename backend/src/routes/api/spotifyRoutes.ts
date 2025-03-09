import { Router } from 'express';

import {
  getFriends,
  getPlaylistTracks,
  getUserPlaylists,
  getUserPlaylistTracks,
  getArtistInfo,
  getMyPlaylists,
  getMultipleArtistInfo,
} from '../../controllers/spotifyController';
import { authenticateUser } from '../../middleware/auth';
import { getTrackFeatures, getUserSavedTracks } from '../../controllers/tracksController';

const router = Router();

router.get('/playlists', authenticateUser, getMyPlaylists);
router.get('/friends', getFriends);
router.get('/playlists/:playlistId', getPlaylistTracks);
router.get('/user/:userId/playlists/', getUserPlaylists);
router.get('/user/:userId/playlists/:playlistId', getUserPlaylistTracks);
router.get('/artist/:artistId', getArtistInfo);
router.get('/artists', getMultipleArtistInfo);
router.get('/user/:userId/savedTracks', getUserSavedTracks);
router.get('/savedTracks/:trackId', getTrackFeatures);

export default router;
