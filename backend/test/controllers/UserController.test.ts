import request from 'supertest';
import express from 'express';
import {
  getUserByUsername,
  updateUserByUsername,
  deleteUserByUsername,
  addUser,
  getAllUsers,
} from '../../src/controllers/UserController';
import { getModel } from '../../src/utils/connection';
import { IUser } from '../../src/models/User';

jest.mock('../../src/utils/connection');

const app = express();
app.use(express.json());
app.get('/user/:username', getUserByUsername);
app.put('/user/:username', updateUserByUsername);
app.delete('/user/:username', deleteUserByUsername);
app.post('/user', addUser);
app.get('/users', getAllUsers);

describe('UserController', () => {
  let UserModel: any;

  beforeEach(() => {
    UserModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
      find: jest.fn(),
    };
    (getModel as jest.Mock).mockReturnValue(UserModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserByUsername', () => {
    it('should return 404 if user is not found', async () => {
      UserModel.findOne.mockResolvedValue(null);

      const res = await request(app).get('/user/nonexistentuser');
      expect(res.status).toBe(404);
      expect(res.text).toBe('User not found');
    });

    it('should return 200 and the user if found', async () => {
      const mockUser = { username: 'testuser' };
      UserModel.findOne.mockResolvedValue(mockUser);

      const res = await request(app).get('/user/testuser');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUser);
    });

    it('should return 500 if there is an error fetching the user', async () => {
      UserModel.findOne.mockRejectedValue(new Error('Error fetching user'));

      const res = await request(app).get('/user/testuser');
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error fetching user');
    });
  });

  describe('updateUserByUsername', () => {
    it('should return 404 if user is not found', async () => {
      UserModel.findOne.mockResolvedValue(null);

      const res = await request(app)
        .put('/user/nonexistentuser')
        .send({ field: 'value' });
      expect(res.status).toBe(404);
      expect(res.text).toBe('User not found');
    });

    it('should return 200 if user is updated', async () => {
      const mockUser = {
        username: 'testuser',
        updateOne: jest.fn().mockResolvedValue({}),
      };
      UserModel.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .put('/user/testuser')
        .send({ field: 'value' });
      expect(res.status).toBe(200);
      expect(res.text).toBe('User updated');
    });

    it('should return 500 if there is an error updating the user', async () => {
      UserModel.findOne.mockRejectedValue(new Error('Error updating user'));

      const res = await request(app)
        .put('/user/testuser')
        .send({ field: 'value' });
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error updating user');
    });
  });

  describe('deleteUserByUsername', () => {
    it('should return 404 if user is not found', async () => {
      UserModel.findOne.mockResolvedValue(null);

      const res = await request(app).delete('/user/nonexistentuser');
      expect(res.status).toBe(404);
      expect(res.text).toBe('User not found');
    });

    it('should return 200 if user is deleted', async () => {
      const mockUser = {
        username: 'testuser',
        deleteOne: jest.fn().mockResolvedValue({}),
      };
      UserModel.findOne.mockResolvedValue(mockUser);

      const res = await request(app).delete('/user/testuser');
      expect(res.status).toBe(200);
      expect(res.text).toBe('User deleted');
    });

    it('should return 500 if there is an error deleting the user', async () => {
      UserModel.findOne.mockRejectedValue(new Error('Error deleting user'));

      const res = await request(app).delete('/user/testuser');
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error deleting user');
    });
  });

  describe('addUser', () => {
    it('should return 201 if user is created', async () => {
      UserModel.create.mockResolvedValue({});

      const res = await request(app)
        .post('/user')
        .send({ username: 'newuser', password: 'password' });
      expect(res.status).toBe(201);
      expect(res.text).toBe('User created');
    });

    it('should return 500 if there is an error creating the user', async () => {
      UserModel.create.mockRejectedValue(new Error('Error creating user'));

      const res = await request(app)
        .post('/user')
        .send({ username: 'newuser', password: 'password' });
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error creating user');
    });
  });

  describe('getAllUsers', () => {
    it('should return 200 and all users', async () => {
      const mockUsers = [{ username: 'user1' }, { username: 'user2' }];
      UserModel.find.mockResolvedValue(mockUsers);

      const res = await request(app).get('/users');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUsers);
    });

    it('should return 500 if there is an error fetching users', async () => {
      UserModel.find.mockRejectedValue(new Error('Error fetching users'));

      const res = await request(app).get('/users');
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error fetching users');
    });
  });
});
