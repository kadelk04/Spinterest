import { Router } from 'express';
import {
  getPinnedPlaylists,
  getProfilePgInfo,
  pinPlaylist,
  updateProfilePgInfo,
  cleanupPinnedPlaylists
} from '../../controllers/profileController';

const profileController = Router();

profileController.post('/logProfileInput', updateProfilePgInfo);
profileController.get('/logProfileInput', getProfilePgInfo);
profileController.put('/pinPlaylist/:username/:playlistId', pinPlaylist);
profileController.get('/getPinnedPlaylists/:username', getPinnedPlaylists);

profileController.post('/cleanup-playlists/:username', cleanupPinnedPlaylists);


export default profileController;
