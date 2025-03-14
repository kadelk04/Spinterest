import request from 'supertest';
import express from 'express';
import {
  saveArtist,
  saveArtistsBulk,
  getArtist,
  getArtists,
  getSavedStatus,
} from '../../src/controllers/artistController';
import { getModel } from '../../src/utils/connection';

const app = express();
app.use(express.json());
app.post('/artist', saveArtist);
app.post('/artists/bulk', saveArtistsBulk);
app.get('/artist/:id', getArtist);
app.post('/artists', getArtists);
app.post('/artists/status', getSavedStatus);

jest.mock('../../src/utils/connection');

describe('Artist Controller', () => {
  interface Artist {
    name: string;
    id: string;
    genres: string[];
  }

  let ArtistModel: {
    create: jest.Mock<Promise<Artist>, [Artist]>;
    findOne: jest.Mock<Promise<Artist | null>, [Partial<Artist>]>;
    find: jest.Mock<Promise<Artist[]>, [Partial<Artist>]>;
  };

  beforeEach(() => {
    ArtistModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    };
    (getModel as jest.Mock).mockReturnValue(ArtistModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveArtist', () => {
    it('should save a new artist', async () => {
      ArtistModel.findOne.mockResolvedValue(null);
      ArtistModel.create.mockResolvedValue({
        name: 'Test Artist',
        id: '12345',
        genres: ['pop'],
      });

      const response = await request(app)
        .post('/artist')
        .send({
          name: 'Test Artist',
          id: '12345',
          genres: ['pop'],
        });

      expect(response.status).toBe(200);
      expect(response.text).toBe('Artist saved: [object Promise]');
    });

    it('should return 200 if artist already exists', async () => {
      ArtistModel.findOne.mockResolvedValue({
        name: 'Test Artist',
        id: '12345',
        genres: ['pop'],
      });

      const response = await request(app)
        .post('/artist')
        .send({
          name: 'Test Artist',
          id: '12345',
          genres: ['pop'],
        });

      expect(response.status).toBe(200);
      expect(response.text).toBe('Artist already saved');
    });

    it('should return 500 on error', async () => {
      ArtistModel.findOne.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/artist')
        .send({
          name: 'Test Artist',
          id: '12345',
          genres: ['pop'],
        });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error saving artist');
    });
  });

  describe('saveArtistsBulk', () => {
    it('should save multiple artists', async () => {
      ArtistModel.findOne.mockResolvedValue(null);
      ArtistModel.create.mockResolvedValue({
        name: 'Test Artist',
        id: '12345',
        genres: ['pop'],
      });

      const response = await request(app)
        .post('/artists/bulk')
        .send({
          artists: [
            { name: 'Test Artist', id: '12345', genres: ['pop'] },
            { name: 'Another Artist', id: '67890', genres: ['rock'] },
          ],
        });

      expect(response.status).toBe(200);
      expect(response.text).toBe('Artists saved successfully');
    });

    it('should return 500 on error', async () => {
      ArtistModel.findOne.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/artists/bulk')
        .send({
          artists: [
            { name: 'Test Artist', id: '12345', genres: ['pop'] },
            { name: 'Another Artist', id: '67890', genres: ['rock'] },
          ],
        });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error saving artists');
    });
  });

  describe('getArtist', () => {
    it('should return an artist', async () => {
      const mockArtist = {
        name: 'Test Artist',
        id: '12345',
        genres: ['pop'],
      };
      ArtistModel.findOne.mockResolvedValue(mockArtist);

      const response = await request(app).get('/artist/12345');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockArtist);
    });

    it('should return 404 if artist not found', async () => {
      ArtistModel.findOne.mockResolvedValue(null);

      const response = await request(app).get('/artist/12345');

      expect(response.status).toBe(404);
      expect(response.text).toBe('Artist not found');
    });

    it('should return 500 on error', async () => {
      ArtistModel.findOne.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/artist/12345');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error fetching artist');
    });
  });

  describe('getArtists', () => {
    it('should return multiple artists', async () => {
      const mockArtists = [
        { name: 'Test Artist', id: '12345', genres: ['pop'] },
        { name: 'Another Artist', id: '67890', genres: ['rock'] },
      ];
      ArtistModel.find.mockResolvedValue(mockArtists);

      const response = await request(app)
        .post('/artists')
        .send({ ids: ['12345', '67890'] });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockArtists);
    });

    it('should return 500 on error', async () => {
      ArtistModel.find.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/artists')
        .send({ ids: ['12345', '67890'] });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error retrieving artists');
    });
  });

  describe('getSavedStatus', () => {
    it('should return 500 on error', async () => {
      ArtistModel.findOne.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/artists/status')
        .send({ ids: ['12345', '67890'] });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error fetching unsaved artists');
    });
  });
});
