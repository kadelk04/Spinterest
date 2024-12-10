import request from 'supertest';
import express from 'express';
import {
  getUserFavorites,
  addFavorite,
  removeFavorite,
  updateFavorite,
} from '../../src/controllers/favoritesController';
import { getModel } from '../../src/utils/connection';
import { IFavorites } from '../../src/models/Favorites';

jest.mock('../../src/utils/connection');

const app = express();
app.use(express.json());
app.get('/favorites/:userId', getUserFavorites);
app.post('/favorites', addFavorite);
app.delete('/favorites', removeFavorite);
app.put('/favorites', updateFavorite);

describe('FavoritesController', () => {
  let FavoritesModel: any;

  beforeEach(() => {
    FavoritesModel = {
      find: jest.fn(),
      create: jest.fn(),
      findOneAndDelete: jest.fn(),
      findOneAndUpdate: jest.fn(),
    };
    (getModel as jest.Mock).mockReturnValue(FavoritesModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserFavorites', () => {
    it('should return all favorites for a user', async () => {
      const mockFavorites = [
        { userId: '1', song: 'Song1', artist: 'Artist1', genre: 'Genre1' },
      ];
      FavoritesModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockFavorites),
      });
      const response = await request(app).get('/favorites/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockFavorites);
    });

    it('should handle errors', async () => {
      FavoritesModel.find.mockReturnValue({
        exec: jest
          .fn()
          .mockRejectedValue(new Error('Error fetching favorites')),
      });
      const response = await request(app).get('/favorites/1');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error fetching favorites');
    });
  });

  describe('addFavorite', () => {
    it('should add a favorite', async () => {
      FavoritesModel.create.mockResolvedValue({});
      const body: IFavorites = {
        userId: '1',
        genre: 'Genre1',
        artist: 'Artist1',
        album: 'Album1',
      };
      const response = await request(app).post('/favorites').send(body);

      expect(response.status).toBe(201);
      expect(response.text).toBe('Favorite added');
    });

    it('should handle errors', async () => {
      FavoritesModel.create.mockRejectedValue(
        new Error('Error adding favorite')
      );
      const body: IFavorites = {
        userId: '1',
        genre: 'Genre1',
        artist: 'Artist1',
        album: 'Album1',
      };

      const response = await request(app).post('/favorites').send(body);

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error adding favorite');
    });
  });

  describe('removeFavorite', () => {
    it('should remove a favorite', async () => {
      FavoritesModel.findOneAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      });
      const body: IFavorites = {
        userId: '1',
        genre: 'Genre1',
        artist: 'Artist1',
        album: 'Album1',
      };
      const response = await request(app).delete('/favorites').send(body);

      expect(response.status).toBe(200);
      expect(response.text).toBe('Favorite removed');
    });

    it('should handle errors', async () => {
      FavoritesModel.findOneAndDelete.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Error removing favorite')),
      });

      const body: IFavorites = {
        userId: '1',
        genre: 'Genre1',
        artist: 'Artist1',
        album: 'Album1',
      };
      const response = await request(app).delete('/favorites').send(body);

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error removing favorite');
    });

    it('should return 404 if favorite not found', async () => {
      FavoritesModel.findOneAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      const body: IFavorites = {
        userId: '1',
        genre: 'Genre1',
        artist: 'Artist1',
        album: 'Album1',
      };
      const response = await request(app).delete('/favorites').send(body);
      expect(response.text).toBe('Favorite not found');
    });
  });

  describe('updateFavorite', () => {
    it('should update a favorite', async () => {
      FavoritesModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      });

      const response = await request(app)
        .put('/favorites')
        .send({
          userId: '1',
          oldFavorite: { genre: 'Genre1', artist: 'Artist1', album: 'Album1' },
          newFavorite: { genre: 'Genre2', artist: 'Artist2', album: 'Album2' },
        });

      expect(response.status).toBe(200);
      expect(response.text).toBe('Favorite updated');
    });

    it('should handle errors', async () => {
      FavoritesModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Error updating favorite')),
      });

      const response = await request(app)
        .put('/favorites')
        .send({
          userId: '1',
          oldFavorite: { genre: 'Genre1', artist: 'Artist1', album: 'Album1' },
          newFavorite: { genre: 'Genre2', artist: 'Artist2', album: 'Album2' },
        });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error updating favorite');
    });

    it('should return 404 if favorite not found', async () => {
      FavoritesModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const response = await request(app)
        .put('/favorites')
        .send({
          userId: '1',
          oldFavorite: { genre: 'Genre1', artist: 'Artist1', album: 'Album1' },
          newFavorite: { genre: 'Genre2', artist: 'Artist2', album: 'Album2' },
        });

      expect(response.status).toBe(404);
      expect(response.text).toBe('Favorite not found');
    });
  });
});
