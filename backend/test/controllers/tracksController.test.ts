import axios from 'axios';
import request from 'supertest';
import { getUserSavedTracks, 
    fetchTrackFeatures, 
    categorizeTrack, 
    determineUserVibes } from '../../src/controllers/tracksController';
import { getModel } from '../../src/utils/connection';

jest.mock('axios');

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('getUserSavedTracks', () => {
    it('should return user saved tracks when Spotify API responds successfully', async () => {
      const mockTracks = { items: [{ track: { id: '123', name: 'Test Song' } }] };
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockTracks });
  
      const result = await getUserSavedTracks('test_token');
      expect(result).toEqual(mockTracks);
    });
  
    it('should throw an error if Spotify API fails', async () => {
      (axios.get as jest.Mock).mockRejectedValueOnce(new Error('API error'));
      await expect(getUserSavedTracks('test_token')).rejects.toThrow('Error fetching user saved tracks');
    });
});

describe('fetchTrackFeatures', () => {
    it('should return track audio features when API responds successfully', async () => {
      const mockFeatures = { danceability: 0.8, energy: 0.9 };
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockFeatures });
  
      const result = await fetchTrackFeatures('test_token', '123');
      expect(result).toEqual(mockFeatures);
    });
  
    it('should return null if Spotify API fails', async () => {
      (axios.get as jest.Mock).mockRejectedValueOnce(new Error('API error'));
      const result = await fetchTrackFeatures('test_token', '123');
      expect(result).toBeNull();
    });
});

describe('categorizeTrack', () => {
  it('should correctly assign a track to a vibe', () => {
    const track = { energy: 0.8, tempo: 140, danceability: 0.7, valence: 0.7, loudness: -5, acousticness: 0.3, instrumentalness: 0.0 };
    expect(categorizeTrack(track)).toBe("Energetic Energy");
});

  it('should return "A song that defies categorization" for a track that does not match any category', () => {
    const track = { energy: 0.1, tempo: 50, danceability: 0.2, valence: 0.2, loudness: -20, acousticness: 0.9, instrumentalness: 1.0 };
    expect(categorizeTrack(track)).toBe("A song that defies categorization");
});
});

describe('determineUserVibes', () => {
  it('should return the most common vibe(s) that meet the threshold', () => {
    const tracks = [
      { energy: 0.8, tempo: 140, danceability: 0.7, valence: 0.7, loudness: -5, acousticness: 0.3, instrumentalness: 0.0 },
      { energy: 0.8, tempo: 140, danceability: 0.7, valence: 0.7, loudness: -5, acousticness: 0.3, instrumentalness: 0.0 },
      { energy: 0.4, tempo: 100, danceability: 0.5, valence: 0.5, loudness: -8, acousticness: 0.7, instrumentalness: 0.5 }
    ];
    expect(determineUserVibes(tracks)).not.toContain("Unknown Vibe");
  });

  it('should return "Unknown Vibe" if no vibes meet the threshold', () => {
    const tracks = [
      { energy: 0.1, tempo: 50, danceability: 0.2, valence: 0.2, loudness: -20, acousticness: 0.9, instrumentalness: 1.0 }
    ];
    expect(determineUserVibes(tracks)).toEqual(["Your vibe is just this song...interesting."]);
});
});
export { getUserSavedTracks };

