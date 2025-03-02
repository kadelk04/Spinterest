import { Router } from 'express';
import {
  createFollowNotification,
  getAllNotifications,
  updateNotification,
  deleteNotification,
  respondToFollowRequest,
  findFollowRequestNotification,
} from '../../controllers/notificationController';
const router = Router();

router.post('/follow/:username', createFollowNotification);
router.get('/getFollowRequest/:userMongoId', findFollowRequestNotification);
router.get('/all/:userMongoId', getAllNotifications);

export default router;
