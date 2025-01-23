import { Router } from 'express';
import {
  getProfilePgInfo,
  updateProfilePgInfo,
} from '../../controllers/profileController';

const profileController = Router();

profileController.post('/logProfileInput', updateProfilePgInfo);
profileController.get('/logProfileInput', getProfilePgInfo);

export default profileController;
