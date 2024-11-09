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
  getMultipleArtistInfo
} from '../../controllers/spotifyController';

const router = Router();

router.get('/profile', getProfileInfo);
router.get('/playlists', getMyPlaylists);
router.get('/friends', getFriends);
router.get('/playlists/:playlistId', getPlaylistTracks);
router.get('/user/:userId/playlists/', getUserPlaylists);
router.get('/user/:userId/playlists/:playlistId', getUserPlaylistTracks);
router.get('/artist/:artistId', getArtistInfo);
router.get('/artists', getMultipleArtistInfo);

export default router;
