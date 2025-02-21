import request from 'supertest';
import express from 'express';
import {
  getUserByUsername,
  getUserBySpotifyId,
  updateUserByUsername,
  deleteUserByUsername,
  addUser,
  getAllUsers,
  saveUserSpotifyId,
  getUserSpotifyId,
  addFollower,
  getFollowers,
  getFollowing,
  removeFollower,
} from '../../src/controllers/UserController';
import { getModel } from '../../src/utils/connection';

jest.mock('../../src/utils/connection');

const app = express();
app.use(express.json());
app.get('/user/:username', getUserByUsername);
app.get('/user/spotify/:spotifyId', getUserBySpotifyId);
app.put('/user/:username', updateUserByUsername);
app.delete('/user/:username', deleteUserByUsername);
app.post('/user', addUser);
app.get('/users', getAllUsers);
app.post('/user/saveSpotifyId/:accessToken', saveUserSpotifyId);
app.post('/user/getSpotifyId', getUserSpotifyId);
app.put('/user/:username/follow', addFollower);
app.get('/user/:username/followers', getFollowers);
app.get('/user/:username/following', getFollowing);
app.put('/user/:username/unfollow', removeFollower);

describe('UserController', () => {
  let UserModel: any;

  beforeEach(() => {
    UserModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
    };
    (getModel as jest.Mock).mockReturnValue(UserModel);
    global.fetch = jest.fn();
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

  describe('getUserBySpotifyId', () => {
    it('should return 404 if user is not found', async () => {
      UserModel.findOne.mockResolvedValue(null);

      const res = await request(app).get('/user/spotify/nonexistentid');
      expect(res.status).toBe(404);
      expect(res.text).toBe('User not found');
    });

    it('should return 200 and the user if found', async () => {
      const mockUser = { spotifyId: 'testid' };
      UserModel.findOne.mockResolvedValue(mockUser);

      const res = await request(app).get('/user/spotify/testid');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUser);
    });

    it('should return 500 if there is an error fetching the user', async () => {
      UserModel.findOne.mockRejectedValue(new Error('Error fetching user'));

      const res = await request(app).get('/user/spotify/testid');
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

  describe('saveUserSpotifyId', () => {
    it('should return 404 if user is not found', async () => {
      UserModel.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/user/saveSpotifyId/testToken')
        .send({ username: 'nonexistentuser' });
      expect(res.status).toBe(404);
      expect(res.text).toBe('User not found');
    });

    it('should return 200 if Spotify ID is saved', async () => {
      const mockUser = {
        username: 'testuser',
        save: jest.fn().mockResolvedValue({}),
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 'testSpotifyId' }),
      });

      UserModel.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/user/saveSpotifyId/testToken')
        .send({ username: 'testuser' });
      expect(res.status).toBe(200);
      expect(res.text).toBe('Spotify ID saved successfully');
    });

    it('should return 500 if there is an error saving the Spotify ID', async () => {
      UserModel.findOne.mockRejectedValue(new Error('Error saving Spotify ID'));

      const res = await request(app)
        .post('/user/saveSpotifyId/testToken')
        .send({ username: 'testuser' });
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error saving Spotify ID');
    });
  });

  describe('getUserSpotifyId', () => {
    it('should return 200 and the Spotify ID', async () => {
      const mockSpotifyId = 'testSpotifyId';
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: mockSpotifyId }),
      });

      const res = await request(app)
        .post('/user/getSpotifyId')
        .send({ accessToken: 'testToken' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ spotifyId: mockSpotifyId });
    });

    it('should return 500 if there is an error fetching the Spotify ID', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(
        new Error('Error fetching Spotify ID')
      );

      const res = await request(app)
        .post('/user/getSpotifyId')
        .send({ accessToken: 'testToken' });
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error fetching Spotify ID');
    });
  });

  describe('addFollower', () => {
    it('should return 404 if user to follow is not found', async () => {
      UserModel.findOne.mockResolvedValue(null);

      const res = await request(app)
        .put('/user/nonexistentuser/follow')
        .send({ follower: 'testfollower' });
      expect(res.status).toBe(404);
      expect(res.text).toBe('User not found');
    });

    it('should return 404 if follower is not found', async () => {
      const mockUser = { username: 'testuser' };
      UserModel.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null);

      const res = await request(app)
        .put('/user/testuser/follow')
        .send({ follower: 'nonexistentfollower' });
      expect(res.status).toBe(404);
      expect(res.text).toBe('Follower not found');
    });

    it('should return 200 if follower is added', async () => {
      const mockUserToFollow = {
        username: 'testuser',
        followers: [],
        save: jest.fn().mockResolvedValue({}),
      };
      const mockFollower = {
        username: 'testfollower',
        following: [],
        save: jest.fn().mockResolvedValue({}),
      };
      UserModel.findOne
        .mockResolvedValueOnce(mockUserToFollow)
        .mockResolvedValueOnce(mockFollower);

      const res = await request(app)
        .put('/user/testuser/follow')
        .send({ follower: 'testfollower' });
      expect(res.status).toBe(200);
      expect(res.text).toBe('Follower added');
    });

    it('should return 500 if there is an error adding the follower', async () => {
      UserModel.findOne.mockRejectedValue(new Error('Error adding follower'));

      const res = await request(app)
        .put('/user/testuser/follow')
        .send({ follower: 'testfollower' });
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error adding follower');
    });
  });

  describe('getFollowers', () => {
    it('should return 404 if user is not found', async () => {
      UserModel.findOne.mockResolvedValue(null);

      const res = await request(app).get('/user/nonexistentuser/followers');
      expect(res.status).toBe(404);
      expect(res.text).toBe('User not found');
    });

    it('should return 200 and the followers if user is found', async () => {
      const mockUser = {
        username: 'testuser',
        followers: ['follower1', 'follower2'],
      };
      UserModel.findOne.mockResolvedValue(mockUser);

      const res = await request(app).get('/user/testuser/followers');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUser.followers);
    });
  });

  describe('getFollowing', () => {
    it('should return 404 if user is not found', async () => {
      UserModel.findOne.mockResolvedValue(null);

      const res = await request(app).get('/user/nonexistentuser/following');
      expect(res.status).toBe(404);
      expect(res.text).toBe('User not found');
    });

    it('should return 200 and the following if user is found', async () => {
      const mockUser = {
        username: 'testuser',
        following: ['following1', 'following2'],
      };
      UserModel.findOne.mockResolvedValue(mockUser);

      const res = await request(app).get('/user/testuser/following');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUser.following);
    });
  });

  describe('removeFollower', () => {
    it('should return 404 if user to unfollow is not found', async () => {
      UserModel.findOne.mockResolvedValue(null);

      const res = await request(app)
        .put('/user/nonexistentuser/unfollow')
        .send({ unfollower: 'testunfollower' });
      expect(res.status).toBe(404);
      expect(res.text).toBe('User not found');
    });

    it('should return 404 if unfollower is not found', async () => {
      const mockUser = { username: 'testuser' };
      UserModel.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null);

      const res = await request(app)
        .put('/user/testuser/unfollow')
        .send({ unfollower: 'nonexistentunfollower' });
      expect(res.status).toBe(404);
      expect(res.text).toBe('Unfollower not found');
    });

    it('should return 200 if follower is removed', async () => {
      const mockUserToUnfollow = {
        username: 'testuser',
        followers: ['testunfollower'],
        save: jest.fn().mockResolvedValue({}),
      };
      const mockUnfollower = {
        username: 'testunfollower',
        following: ['testuser'],
        save: jest.fn().mockResolvedValue({}),
      };
      UserModel.findOne
        .mockResolvedValueOnce(mockUserToUnfollow)
        .mockResolvedValueOnce(mockUnfollower);

      const res = await request(app)
        .put('/user/testuser/unfollow')
        .send({ unfollower: 'testunfollower' });
      expect(res.status).toBe(200);
      expect(res.text).toBe('Follower removed');
    });

    it('should return 500 if there is an error removing the follower', async () => {
      UserModel.findOne.mockRejectedValue(new Error('Error removing follower'));

      const res = await request(app)
        .put('/user/testuser/unfollow')
        .send({ unfollower: 'testunfollower' });
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error removing follower');
    });
  });
});
