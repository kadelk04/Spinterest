import { Router } from 'express';
import {
  getUserByUsername,
  getAllUsers,
  updateUserByUsername,
} from '../../controllers/userController';
import auth from '../../middleware/auth';
import {
  addFavorite,
  getUserFavorites,
  removeFavorite,
  updateFavorite,
} from '../../controllers/favoritesController';
import { getPlaylistByUsername } from '../../controllers/playlistController';

const router = Router();

router.get('/', auth, getAllUsers);
router.get('/:username', auth, getUserByUsername);
router.put('/:username', auth, updateUserByUsername);

// Nested routes for user resources
router.get('/:username/playlist', auth, getPlaylistByUsername);
router.get('/:username/favorites', auth, getUserFavorites);
router.post('/:username/favorites', auth, addFavorite);
router.delete('/:username/favorites', auth, removeFavorite);
router.patch('/:username/favorites', auth, updateFavorite);

export default router;
