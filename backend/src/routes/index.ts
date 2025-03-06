import { Router } from 'express';
import userRoutes from './api/userRoutes';
import playlistRoutes from './api/playlistRoutes';
import spotifyRoutes from './api/spotifyRoutes';
import loginRoutes from './api/loginRoutes';
import profileRoutes from './api/profileRoute';
import artistRoutes from './api/artistRoutes';
import notificationRoutes from './api/notificationRoutes';

const router = Router();

// Protected routes
router.use('/user', userRoutes);
router.use('/playlist', playlistRoutes);
router.use('/artist', artistRoutes);
router.use('/spotify', spotifyRoutes);
router.use('/login', loginRoutes);
router.use('/profile', profileRoutes);
router.use('/notification', notificationRoutes);

router.get('/', (req, res) => {
  res.status(200).send('API is working');
});

export default router;
