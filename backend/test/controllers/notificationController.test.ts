import request from 'supertest';
import express from 'express';
import {
  createFollowRequestNotification,
  createFollowNotification,
  findFollowRequestNotification,
  getAllNotifications,
  updateNotification,
  deleteNotification,
  getNotification,
} from '../../src/controllers/notificationController';
import { getModel } from '../../src/utils/connection';

jest.mock('../../src/utils/connection');
jest.mock('axios');

const app = express();
app.use(express.json());
app.post(
  '/notifications/followRequest/:userMongoId',
  createFollowRequestNotification
);
app.post('/notifications/follow/:userMongoId', createFollowNotification);
app.get(
  '/notifications/followRequest/:userMongoId',
  findFollowRequestNotification
);
app.get('/notifications/all/:userMongoId', getAllNotifications);
app.put('/notifications/update/:notificationId', updateNotification);
app.delete('/notifications/delete/:notificationId', deleteNotification);
app.get('/notifications/:notificationId', getNotification);

describe('Notification Controller', () => {
  let NotificationModel: {
    create: jest.Mock;
    find: jest.Mock;
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    findByIdAndDelete: jest.Mock;
  };
  let UserModel: { findOne: jest.Mock };

  beforeEach(() => {
    NotificationModel = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };
    UserModel = { findOne: jest.fn() };
    (getModel as jest.Mock).mockImplementation((modelName: string) => {
      if (modelName === 'Notification') return NotificationModel;
      if (modelName === 'User') return UserModel;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createFollowRequestNotification', () => {
    it('should create a new follow request notification', async () => {
      UserModel.findOne.mockResolvedValue({ username: 'testuser' });
      NotificationModel.create.mockResolvedValue({});

      const res = await request(app)
        .post('/notifications/followRequest/12345')
        .send({ follower: '67890' });

      expect(res.status).toBe(200);
      expect(NotificationModel.create).toHaveBeenCalled();
    });

    it('should return 404 if user is not found', async () => {
      UserModel.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/notifications/followRequest/12345')
        .send({ follower: '67890' });

      expect(res.status).toBe(404);
      expect(res.text).toBe('User not found');
    });

    it('should return 500 if there is an error finding the user', async () => {
      UserModel.findOne.mockRejectedValue(new Error('Error finding user'));

      const res = await request(app)
        .post('/notifications/followRequest/12345')
        .send({ follower: '67890' });

      expect(res.status).toBe(500);
      expect(res.text).toBe('Error finding user');
    });

    it('should return 500 if there is an error creating the notification', async () => {
      UserModel.findOne.mockResolvedValue({ username: 'testuser' });
      NotificationModel.create.mockRejectedValue(
        new Error('Error creating notification')
      );

      const res = await request(app)
        .post('/notifications/followRequest/12345')
        .send({ follower: '67890' });

      expect(res.status).toBe(500);
      expect(res.text).toBe('Error creating follow notification');
    });
  });

  describe('createFollowNotification', () => {
    it('should create a new follow notification', async () => {
      UserModel.findOne.mockResolvedValue({ username: 'testuser' });
      NotificationModel.create.mockResolvedValue({});

      const res = await request(app)
        .post('/notifications/follow/12345')
        .send({ follower: '67890' });

      expect(res.status).toBe(200);
      expect(NotificationModel.create).toHaveBeenCalled();
    });

    it('should return 404 if user is not found', async () => {
      UserModel.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/notifications/follow/12345')
        .send({ follower: '67890' });

      expect(res.status).toBe(404);
      expect(res.text).toBe('User not found');
    });

    it('should return 500 if there is an error finding the user', async () => {
      UserModel.findOne.mockRejectedValue(new Error('Error finding user'));

      const res = await request(app)
        .post('/notifications/follow/12345')
        .send({ follower: '67890' });

      expect(res.status).toBe(500);
      expect(res.text).toBe('Error finding user');
    });

    it('should return 500 if there is an error creating the notification', async () => {
      UserModel.findOne.mockResolvedValue({ username: 'testuser' });
      NotificationModel.create.mockRejectedValue(
        new Error('Error creating notification')
      );

      const res = await request(app)
        .post('/notifications/follow/12345')
        .send({ follower: '67890' });

      expect(res.status).toBe(500);
      expect(res.text).toBe('Error creating follow notification');
    });
  });

  describe('findFollowRequestNotification', () => {
    it('should find follow request notifications', async () => {
      NotificationModel.find.mockResolvedValue([
        { message: 'testfollower requested to follow you!' },
      ]);

      const res = await request(app)
        .get('/notifications/followRequest/12345')
        .query({ follower: 'testfollower' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(true);
    });

    it('should return 404 if no follow request notifications are found', async () => {
      NotificationModel.find.mockResolvedValue([]);

      const res = await request(app)
        .get('/notifications/followRequest/12345')
        .query({ follower: 'testfollower' });

      expect(res.status).toBe(404);
      expect(res.text).toBe('No follow request notifications found');
    });

    it('should return 500 if there is an error finding follow request notifications', async () => {
      NotificationModel.find.mockRejectedValue(
        new Error('Error finding follow request notifications')
      );

      const res = await request(app)
        .get('/notifications/followRequest/12345')
        .query({ follower: 'testfollower' });

      expect(res.status).toBe(500);
      expect(res.text).toBe('Error finding follow request notifications');
    });
  });

  describe('getAllNotifications', () => {
    it('should get all notifications for a user', async () => {
      NotificationModel.find.mockResolvedValue([
        { message: 'test notification' },
      ]);

      const res = await request(app).get('/notifications/all/12345');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ message: 'test notification' }]);
    });

    it('should return 404 if no notifications are found', async () => {
      NotificationModel.find.mockResolvedValue([]);

      const res = await request(app).get('/notifications/all/12345');

      expect(res.status).toBe(404);
      expect(res.text).toBe('No notifications found');
    });

    it('should return 500 if there is an error getting notifications', async () => {
      NotificationModel.find.mockRejectedValue(
        new Error('Error getting notifications')
      );

      const res = await request(app).get('/notifications/all/12345');

      expect(res.status).toBe(500);
      expect(res.text).toBe('Error retrieving notifications');
    });
  });

  describe('updateNotification', () => {
    it('should update a notification', async () => {
      NotificationModel.findById.mockResolvedValue({ sender: '67890' });
      UserModel.findOne.mockResolvedValue({ username: 'testuser' });
      NotificationModel.findByIdAndUpdate.mockResolvedValue({
        message: 'updated notification',
      });

      const res = await request(app)
        .put('/notifications/update/12345')
        .send({ message: 'updated notification' });

      expect(res.status).toBe(200);
      expect(NotificationModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should return 404 if notification is not found', async () => {
      NotificationModel.findById.mockResolvedValue(null);

      const res = await request(app)
        .put('/notifications/update/12345')
        .send({ message: 'updated notification' });

      expect(res.status).toBe(404);
      expect(res.text).toBe('Notification not found');
    });

    it('should return 404 if user is not found', async () => {
      NotificationModel.findById.mockResolvedValue({ sender: '67890' });
      UserModel.findOne.mockResolvedValue(null);

      const res = await request(app)
        .put('/notifications/update/12345')
        .send({ message: 'updated notification' });

      expect(res.status).toBe(404);
      expect(res.text).toBe('User not found');
    });

    it('should return 500 if there is an error updating the notification', async () => {
      NotificationModel.findById.mockResolvedValue({ sender: '67890' });
      UserModel.findOne.mockResolvedValue({ username: 'testuser' });
      NotificationModel.findByIdAndUpdate.mockRejectedValue(
        new Error('Error updating notification')
      );

      const res = await request(app)
        .put('/notifications/update/12345')
        .send({ message: 'updated notification' });

      expect(res.status).toBe(500);
      expect(res.text).toBe('Internal server error');
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification', async () => {
      NotificationModel.findByIdAndDelete.mockResolvedValue({});

      const res = await request(app).delete('/notifications/delete/12345');

      expect(res.status).toBe(200);
      expect(res.text).toBe('Notification deleted');
    });

    it('should return 404 if notification is not found', async () => {
      NotificationModel.findByIdAndDelete.mockResolvedValue(null);

      const res = await request(app).delete('/notifications/delete/12345');

      expect(res.status).toBe(404);
      expect(res.text).toBe('Notification not found');
    });

    it('should return 500 if there is an error deleting the notification', async () => {
      NotificationModel.findByIdAndDelete.mockRejectedValue(
        new Error('Error deleting notification')
      );

      const res = await request(app).delete('/notifications/delete/12345');

      expect(res.status).toBe(500);
      expect(res.text).toBe('Error deleting notification');
    });
  });

  describe('getNotification', () => {
    it('should get a notification by id', async () => {
      NotificationModel.findById.mockResolvedValue({
        message: 'test notification',
      });

      const res = await request(app).get('/notifications/12345');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'test notification' });
    });

    it('should return 404 if notification is not found', async () => {
      NotificationModel.findById.mockResolvedValue(null);

      const res = await request(app).get('/notifications/12345');

      expect(res.status).toBe(404);
      expect(res.text).toBe('Notification not found');
    });

    it('should return 500 if there is an error retrieving the notification', async () => {
      NotificationModel.findById.mockRejectedValue(
        new Error('Error retrieving notification')
      );

      const res = await request(app).get('/notifications/12345');

      expect(res.status).toBe(500);
      expect(res.text).toBe('Error retrieving notification');
    });
  });
});
