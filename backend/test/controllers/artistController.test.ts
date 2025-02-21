import request from 'supertest';
import express from 'express';
import { saveArtist, getArtist } from '../../src/controllers/artistController';
import { getModel } from '../../src/utils/connection';

const app = express();
app.use(express.json());
app.post('/artist', saveArtist);
app.get('/artist/:artistId', getArtist);

jest.mock('../../src/utils/connection');

describe('Artist Controller', () => {
  interface Artist {
    name: string;
    artistId: string;
    genres: string[];
  }

  let ArtistModel: {
    create: jest.Mock<Promise<Artist>, [Artist]>;
    findOne: jest.Mock<Promise<Artist | null>, [Partial<Artist>]>;
  };

  beforeEach(() => {
    ArtistModel = {
      create: jest.fn(),
      findOne: jest.fn(),
    };
    (getModel as jest.Mock).mockReturnValue({
      create: jest.fn(),
      findOne: ArtistModel.findOne,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveArtist', () => {
    it('should save a new artist', async () => {
      ArtistModel.findOne.mockResolvedValue(null);
      ArtistModel.create.mockResolvedValue({
        name: 'Test Artist',
        artistId: '12345',
        genres: ['pop'],
      });

      const response = await request(app)
        .post('/artist')
        .send({
          name: 'Test Artist',
          artistId: '12345',
          genres: ['pop'],
        });

      expect(response.status).toBe(200);
      expect(response.text).toBe('Artist saved: undefined');
    });

    it('should return 200 if artist already exists', async () => {
      ArtistModel.findOne.mockResolvedValue({
        name: 'Test Artist',
        artistId: '12345',
        genres: ['pop'],
      } as Artist);

      const response = await request(app)
        .post('/artist')
        .send({
          name: 'Test Artist',
          artistId: '12345',
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
          artistId: '12345',
          genres: ['pop'],
        });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error saving artist');
    });
  });

  describe('getArtist', () => {
    it('should return an artist', async () => {
      const mockArtist = {
        name: 'Test Artist',
        artistId: '12345',
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
});
