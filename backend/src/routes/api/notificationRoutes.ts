import { Router } from 'express';
import {
  createFollowNotification,
  getAllNotifications,
  updateNotification,
  deleteNotification,
  respondToFollowRequest,
} from '../../controllers/notificationController';
const router = Router();

router.post('/follow/:username', createFollowNotification);

export default router;
