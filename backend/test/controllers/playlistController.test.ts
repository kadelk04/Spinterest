import request from 'supertest';
import express from 'express';
import {
  getAllPlaylists,
  addPlaylist,
  getPlaylistById,
  updatePlaylistById,
  deletePlaylistById,
  getPlaylistsByUsername,
} from '../../src/controllers/playlistController';
import { getModel } from '../../src/utils/connection';
import { IPlaylist } from '../../src/models/Playlist';

jest.mock('../../src/utils/connection');

const app = express();
app.use(express.json());
app.get('/playlists', getAllPlaylists);
app.post('/playlists', addPlaylist);
app.get('/playlists/:playlistId', getPlaylistById);
app.put('/playlists/:playlistId', updatePlaylistById);
app.delete('/playlists/:playlistId', deletePlaylistById);
app.get('/users/:username/playlists', getPlaylistsByUsername);

describe('Playlist Controller', () => {
  let PlaylistModel: {
    find: jest.Mock;
    create: jest.Mock;
    findById: jest.Mock;
  };

  beforeEach(() => {
    PlaylistModel = { find: jest.fn(), create: jest.fn(), findById: jest.fn() };
    (getModel as jest.Mock).mockReturnValue({
      find: PlaylistModel.find,
      create: PlaylistModel.create,
      findById: PlaylistModel.findById,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPlaylists', () => {
    it('should return all playlists', async () => {
      const playlists = [{ name: 'Playlist 1' }, { name: 'Playlist 2' }];
      PlaylistModel.find.mockResolvedValue(playlists);

      const res = await request(app).get('/playlists');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(playlists);
    });

    it('should handle errors', async () => {
      PlaylistModel.find.mockRejectedValue(
        new Error('Error fetching playlists')
      );

      const res = await request(app).get('/playlists');
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error fetching playlists');
    });
  });

  describe('addPlaylist', () => {
    it('should add a new playlist', async () => {
      const newPlaylist: IPlaylist = { spotifyId: '1234', tags: [], likes: 0 };
      PlaylistModel.create.mockResolvedValue(newPlaylist);

      const res = await request(app).post('/playlists').send(newPlaylist);
      expect(res.status).toBe(201);
      expect(res.text).toBe('Playlist created');
    });

    it('should handle errors', async () => {
      PlaylistModel.create.mockRejectedValue(
        new Error('Error adding playlist')
      );

      const res = await request(app)
        .post('/playlists')
        .send({ name: 'New Playlist' });
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error adding playlist');
    });
  });

  describe('getPlaylistById', () => {
    it('should return a playlist by ID', async () => {
      const playlist = { name: 'Playlist 1' };
      PlaylistModel.findById.mockResolvedValue(playlist);

      const res = await request(app).get('/playlists/1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(playlist);
    });

    it('should handle playlist not found', async () => {
      PlaylistModel.findById.mockResolvedValue(null);

      const res = await request(app).get('/playlists/1');
      expect(res.status).toBe(404);
      expect(res.text).toBe('Playlist not found');
    });

    it('should handle errors', async () => {
      PlaylistModel.findById.mockRejectedValue(
        new Error('Error fetching playlist')
      );

      const res = await request(app).get('/playlists/1');
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error fetching playlist');
    });
  });

  describe('updatePlaylistById', () => {
    it('should update a playlist by ID', async () => {
      const updatedPlaylist = { name: 'Updated Playlist' };
      PlaylistModel.findById.mockResolvedValue({
        updateOne: jest.fn().mockResolvedValue({}),
      });

      const res = await request(app).put('/playlists/1').send(updatedPlaylist);
      expect(res.status).toBe(200);
      expect(res.text).toBe('Playlist updated');
    });

    it('should handle playlist not found', async () => {
      PlaylistModel.findById.mockResolvedValue(null);

      const res = await request(app)
        .put('/playlists/1')
        .send({ name: 'Updated Playlist' });
      expect(res.status).toBe(404);
      expect(res.text).toBe('Playlist not found');
    });

    it('should handle errors', async () => {
      PlaylistModel.findById.mockReturnValue({
        updateOne: jest
          .fn()
          .mockRejectedValue(new Error('Error updating playlist')),
      });

      const res = await request(app)
        .put('/playlists/1')
        .send({ name: 'Updated Playlist' });
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error updating playlist');
    });
  });

  describe('deletePlaylistById', () => {
    it('should delete a playlist by ID', async () => {
      PlaylistModel.findById.mockResolvedValue({
        deleteOne: jest.fn().mockResolvedValue({}),
      });

      const res = await request(app).delete('/playlists/1');
      expect(res.status).toBe(200);
      expect(res.text).toBe('Playlist deleted');
    });

    it('should handle playlist not found', async () => {
      PlaylistModel.findById.mockResolvedValue(null);

      const res = await request(app).delete('/playlists/1');
      expect(res.status).toBe(404);
      expect(res.text).toBe('Playlist not found');
    });

    it('should handle errors', async () => {
      PlaylistModel.findById.mockReturnValue({
        deleteOne: jest
          .fn()
          .mockRejectedValue(new Error('Error deleting playlist')),
      });

      const res = await request(app).delete('/playlists/1');
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error deleting playlist');
    });
  });

  describe('getPlaylistsByUsername', () => {
    it('should return all playlists for a user', async () => {
      const playlists = [{ name: 'Playlist 1' }, { name: 'Playlist 2' }];
      PlaylistModel.find.mockResolvedValue(playlists);

      const res = await request(app).get('/users/testuser/playlists');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(playlists);
    });

    it('should handle errors', async () => {
      PlaylistModel.find.mockRejectedValue(
        new Error('Error fetching playlists')
      );

      const res = await request(app).get('/users/testuser/playlists');
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error fetching playlists');
    });
  });
});
