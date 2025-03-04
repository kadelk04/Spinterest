import { Router } from 'express';
import {
  createFollowRequestNotification,
  getAllNotifications,
  updateNotification,
  deleteNotification,
  respondToFollowRequest,
  findFollowRequestNotification,
  createFollowNotification
} from '../../controllers/notificationController';
const router = Router();

router.post('/followRequest/:username', createFollowRequestNotification);
router.post('/follow/:username', createFollowNotification);
router.get('/getFollowRequest/:userMongoId', findFollowRequestNotification);
router.get('/all/:userMongoId', getAllNotifications);

export default router;
