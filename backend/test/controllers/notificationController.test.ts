import request from 'supertest';
import express from 'express';
import {
  createFollowNotification,
  findFollowRequestNotification,
} from '../../src/controllers/notificationController';
import { getModel } from '../../src/utils/connection';
import { INotification } from '../../src/models/Notification';

jest.mock('../../src/utils/connection');

const app = express();
app.use(express.json());
app.post('/notifications/follow/:username', createFollowNotification);
app.get(
  '/notifications/followRequest/:userMongoId',
  findFollowRequestNotification
);

describe('Notification Controller', () => {
  let NotificationModel: any;
  let UserModel: any;

  beforeEach(() => {
    NotificationModel = { create: jest.fn(), find: jest.fn(), save: jest.fn() };
    UserModel = { findOne: jest.fn() };
    (getModel as jest.Mock).mockImplementation((modelName: string) => {
      if (modelName === 'Notification') return NotificationModel;
      if (modelName === 'User') return UserModel;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createFollowNotification', () => {
    it('should create a new follow notification', async () => {
      UserModel.findOne.mockResolvedValue({ _id: '12345' });
      NotificationModel.create.mockResolvedValue({});
      NotificationModel.save.mockResolvedValue({});

      const res = await request(app)
        .post('/notifications/follow/testuser')
        .send({ follower: 'testfollower', privacy: false });

      expect(res.status).toBe(200);
      expect(NotificationModel.create).toHaveBeenCalled();
    });

    it('should return 404 if user is not found', async () => {
      UserModel.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/notifications/follow/testuser')
        .send({ follower: 'testfollower', privacy: false });

      expect(res.status).toBe(404);
      expect(res.text).toBe('User not found');
    });

    it('should return 500 if there is an error finding the user', async () => {
      UserModel.findOne.mockRejectedValue(new Error('Error finding user'));

      const res = await request(app)
        .post('/notifications/follow/testuser')
        .send({ follower: 'testfollower', privacy: false });

      expect(res.status).toBe(500);
      expect(res.text).toBe('Error finding user');
    });

    it('should return 500 if there is an error creating the notification', async () => {
      UserModel.findOne.mockResolvedValue({ _id: '12345' });
      NotificationModel.create.mockRejectedValue(
        new Error('Error creating notification')
      );

      const res = await request(app)
        .post('/notifications/follow/testuser')
        .send({ follower: 'testfollower', privacy: false });

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
});
