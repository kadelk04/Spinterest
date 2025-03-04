import { Router } from 'express';
import {
  createFollowRequestNotification,
  getAllNotifications,
  updateNotification,
  deleteNotification,
  findFollowRequestNotification,
  createFollowNotification,
  getNotification,
} from '../../controllers/notificationController';
const router = Router();

router.post('/followRequest/:userMongoId', createFollowRequestNotification);
router.post('/follow/:userMongoId', createFollowNotification);
router.get('/getFollowRequest/:userMongoId', findFollowRequestNotification);
router.get('/all/:userMongoId', getAllNotifications);
router.get('/:notificationId', getNotification);
router.put('/update/:notificationId', updateNotification);
router.delete('/delete/:notificationId', deleteNotification);

export default router;
