import { Router } from 'express';
import {
  createNotification,
  getAllNotifications,
  updateNotification,
  deleteNotification,
  respondToFollowRequest,
} from '../../controllers/notificationController';
const router = Router();

export default router;
