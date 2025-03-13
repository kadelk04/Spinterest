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

const router = Router();

router.get('/playlists', getMyPlaylists);
router.get('/friends', getFriends);
router.get('/playlists/:playlistId', getPlaylistTracks);
router.get('/user/:userId/playlists/', getUserPlaylists);
router.get('/user/:userId/playlists/:playlistId', getUserPlaylistTracks);
router.get('/artist/:artistId', getArtistInfo);
router.get('/artists', getMultipleArtistInfo);


export default router;
