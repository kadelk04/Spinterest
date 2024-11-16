import { Router } from 'express';
import {
  getUserByUsername,
  getAllUsers,
  updateUserByUsername,
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

router.get('/', authenticateUser, getAllUsers);
router.post('/', registerUser);

router.get('/:username', authenticateUser, getUserByUsername);
router.put('/:username', authenticateUser, updateUserByUsername);

// Nested routes for user resources
router.get('/:username/playlist', authenticateUser, getPlaylistsByUsername);
router.get('/:username/favorites', authenticateUser, getUserFavorites);
router.post('/:username/favorites', authenticateUser, addFavorite);
router.delete('/:username/favorites', authenticateUser, removeFavorite);
router.patch('/:username/favorites', authenticateUser, updateFavorite);

export default router;
