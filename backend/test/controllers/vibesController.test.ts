import axios from 'axios';
import express from 'express';
import request from 'supertest';
import { Request, Response } from 'express';
import { determineUserVibes, analyzeAndStoreUserVibes, fetchUserVibes } from '../../src/controllers/vibesController';
import { getModel } from '../../src/utils/connection';
jest.mock('../../src/utils/connection', () => ({
  getModel: jest.fn(),
}));
const mockUserModel = {
  findOne: jest.fn(),
};
(getModel as jest.Mock).mockReturnValue(mockUserModel);
jest.mock('axios');
jest.mock('../../src/utils/connection');

const app = express();
app.use(express.json());
app.post('/analyze/:username', analyzeAndStoreUserVibes);
app.get('/:username', fetchUserVibes);

const mockSavedTracks = {
  items: [
    {
      track: {
        id: "track1",
        album: { id: "album1" },
        artists: [{ id: "artist1" }]
      }
    },
    {
      track: {
        id: "track2",
        album: { id: "album2" },
        artists: [{ id: "artist2" }]
      }
    },
    {
      track: {
        id: "track3",
        album: { id: "album3" },
        artists: [{ id: "artist3" }]
      }
    }
  ]
};

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('determineUserVibes', () => {
  it('should return the most common vibes that meet the threshold', () => {
    const genres = ['pop', 'pop', 'rock', 'rock', 'rock', 'alternative'];
    expect(determineUserVibes(genres)).toEqual(["Feel-Good", "Energetic Energy"]);
  });

  it('should return the most frequent vibes if none meet the threshold', () => {
    const genres = ['classical', 'ambient', 'jazz', 'metal'];
    expect(determineUserVibes(genres)).toEqual(["Woe is Me", "Straight Chilling", "Noise Enjoyer"]);
  });

  it('should return a message if the user has no songs', () => {
    expect(determineUserVibes([])).toEqual(["No Songs, No Vibes detected :("]);
  });

  it('should return a unique vibe if only one genre is detected', () => {
    expect(determineUserVibes(["hip hop"])).toEqual(["Your vibe is just this genre...interesting."]);
  });
});

describe('analyzeAndStoreUserVibes', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      params: { username: 'test_user' },
      headers: { authorization: 'Bearer test_token' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  it('should analyze and store user vibes successfully', async () => {
    const mockAlbumGenres = { genres: ['pop', 'dance'] };
    const mockArtistGenres = { genres: ['hip hop'] };

    (axios.get as jest.Mock)
      .mockResolvedValueOnce({ data: mockSavedTracks})
      .mockResolvedValueOnce({ data: mockAlbumGenres }) 
      .mockResolvedValueOnce({ data: mockArtistGenres }); 

    mockUserModel.findOne.mockResolvedValue({ save: jest.fn() });

    await analyzeAndStoreUserVibes(req as Request, res as Response);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ userVibe: ["Feel-Good", "Energetic Energy", "Straight Chilling"] });
  });

  it('should handle missing Spotify token', async () => {
    req.headers = {};
    await analyzeAndStoreUserVibes(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Spotify token is missing');
  });

  it('should return 404 if user is not found', async () => {
    mockUserModel.findOne.mockResolvedValue(null);

    await analyzeAndStoreUserVibes(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('User not found');
});


  it('should return an error message if fetching genres fails', async () => {
    mockUserModel.findOne.mockResolvedValue({ save: jest.fn() });
    await analyzeAndStoreUserVibes(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Error analyzing and storing user vibes');
  });
});

describe('fetchUserVibes', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { params: { username: 'test_user' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  it('should fetch and return user vibes successfully', async () => {
    mockUserModel.findOne.mockResolvedValue({ vibes: ['Feel-Good', 'Energetic Energy'] });

    await fetchUserVibes(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ vibes: ['Feel-Good', 'Energetic Energy'] });
  });

  it('should return 404 if user is not found', async () => {
    mockUserModel.findOne.mockResolvedValue(null);

    await fetchUserVibes(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('User not found');
  });

  it('should return an error message if fetching user vibes fails', async () => {
    mockUserModel.findOne.mockRejectedValue(new Error('Database error'));

    await fetchUserVibes(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching user vibes' });
  });
});
