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
profileController.put('/pinPlaylists/:username/:playlistId', pinPlaylist);
profileController.get('/getPinnedPlaylists/:username', getPinnedPlaylist);

export default profileController;
