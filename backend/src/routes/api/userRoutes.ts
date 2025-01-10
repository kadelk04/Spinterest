import { Router } from 'express';
import {
  getUserByUsername,
  getAllUsers,
  updateUserByUsername,
  saveUserSpotifyId,
  getUserSpotifyId,
} from '../../controllers/UserController';
import {
  addFavorite,
  getUserFavorites,
  removeFavorite,
  updateFavorite,
} from '../../controllers/favoritesController';
import { getPlaylistsByUsername } from '../../controllers/playlistController';
import { authenticateUser, registerUser } from '../../middleware/auth';

const router = Router();

router.get('/', getAllUsers);
router.post('/', registerUser);

// this route is being replaced by /profile/:username route
// router.get('/:username', getUserByUsername);
router.put('/:username', updateUserByUsername);

// Nested routes for user resources
router.get('/:username/playlist', getPlaylistsByUsername);
router.post('/:username/saveSpotifyId', saveUserSpotifyId);
router.get('/:username/getSpotifyId', getUserSpotifyId);
router.get('/:username/favorites', getUserFavorites);
router.post('/:username/favorites', addFavorite);
router.delete('/:username/favorites', removeFavorite);
router.patch('/:username/favorites', updateFavorite);

export default router;
