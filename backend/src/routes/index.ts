import { Router } from 'express';
import userRoutes from './api/userRoutes';
import playlistRoutes from './api/playlistRoutes';
import spotifyRoutes from './api/spotifyRoutes';

const router = Router();

// Auth routes
// router.use('/auth', authRoutes);

// Protected routes
router.use('/user', userRoutes);
router.use('/playlist', playlistRoutes);
router.use('/spotify', spotifyRoutes);

export default router;
