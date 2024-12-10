import { Router } from 'express';
import {
  getPinnedPlaylist,
  getProfilePgInfo,
  pinPlaylist,
  updateProfilePgInfo,
} from '../../controllers/profileController';

const profileController = Router();

profileController.post('/logProfileInput', updateProfilePgInfo);
profileController.get('/logProfileInput', getProfilePgInfo);
profileController.put('/pin-playlist/:username/:playlistId', pinPlaylist);
profileController.get('/pinned-playlists', getPinnedPlaylist);

export default profileController;
