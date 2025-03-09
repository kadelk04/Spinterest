import request from 'supertest';
import express from 'express';
import axios from 'axios';
import { getUserSavedTracks, 
        getTrackFeatures, 
        categorizeTrack, 
        determineUserVibes, 
        analyzeAndStoreUserVibes } from '../../src/controllers/tracksController';

jest.mock('../../src/utils/connection');
jest.mock('axios');

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  

describe('getUserSavedTracks', () => {
    it('should return user saved tracks when Spotify API responds successfully', async () => {
      const mockTracks = { items: [{ track: { id: '123', name: 'Test Song' } }] };
  
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockTracks });
  
      const req = { query: { spotifyToken: 'test_token' } } as any;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;
  
      await getUserSavedTracks(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(mockTracks);
    });
  
    it('should return 500 error if Spotify API fails', async () => {
      (axios.get as jest.Mock).mockRejectedValueOnce(new Error('API error'));
  
      const req = { query: { spotifyToken: 'test_token' } } as any;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;
  
      await getUserSavedTracks(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error fetching user saved tracks');
    });
  });

  describe('getTrackFeatures', () => {
    it('should return track audio features when API responds successfully', async () => {
      const mockFeatures = { danceability: 0.8, energy: 0.9 };
  
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockFeatures });
  
      const req = { params: { trackId: '123' }, headers: { authorization: 'test_token' } } as any;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;
  
      await getTrackFeatures(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(mockFeatures);
    });
  
    it('should return 500 if Spotify API fails', async () => {
      (axios.get as jest.Mock).mockRejectedValueOnce(new Error('API error'));
  
      const req = { params: { trackId: '123' }, headers: { authorization: 'test_token' } } as any;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;
  
      await getTrackFeatures(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error fetching track features');
    });
  });

  describe('getTrackFeatures', () => {
    it('should return track audio features when API responds successfully', async () => {
      const mockFeatures = { danceability: 0.8, energy: 0.9 };
  
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockFeatures });
  
      const req = { params: { trackId: '123' }, headers: { authorization: 'test_token' } } as any;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;
  
      await getTrackFeatures(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(mockFeatures);
    });
  
    it('should return 500 if Spotify API fails', async () => {
      (axios.get as jest.Mock).mockRejectedValueOnce(new Error('API error'));
  
      const req = { params: { trackId: '123' }, headers: { authorization: 'test_token' } } as any;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;
  
      await getTrackFeatures(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error fetching track features');
    });
  });

describe('categorizeTrack', () => {
  it('should correctly assign the Energetic Energy vibe', () => {
    const track = {
        energy: 0.8,
        tempo: 140,
        danceability: 0.7,
        valence: 0.7,
        loudness: -5,
        acousticness: 0.3, // Added
        instrumentalness: 0.0, // Added
      };
    expect(categorizeTrack(track)).toBe('Energetic Energy');
  });

  it('should return undefined for tracks that do not match any vibe', () => {
    const track = {
        energy: 0.1,
        tempo: 50,
        danceability: 0.2,
        valence: 0.2,
        loudness: -20,
        acousticness: 0.9, // Added
        instrumentalness: 1.0, // Added
      };
    expect(categorizeTrack(track)).toBeUndefined();
  });
});

describe('determineUserVibes', () => {
    it('should return the most common vibe', () => {
        const tracks = [
            { energy: 0.8, tempo: 140, danceability: 0.7, valence: 0.7, loudness: -5, acousticness: 0.3, instrumentalness: 0.0 },
            { energy: 0.8, tempo: 140, danceability: 0.7, valence: 0.7, loudness: -5, acousticness: 0.3, instrumentalness: 0.0 },
            { energy: 0.4, tempo: 100, danceability: 0.5, valence: 0.5, loudness: -8, acousticness: 0.7, instrumentalness: 0.5 },
          ];
          
  
      expect(determineUserVibes(tracks)).toBe('Energetic Energy');
    });
  
    it('should return null if no tracks match any vibe', () => {
        const tracks = [
          { 
            energy: 0.1, 
            tempo: 50, 
            danceability: 0.2, 
            valence: 0.2, 
            loudness: -20, 
            acousticness: 0.9, // Added
            instrumentalness: 1.0 // Added
          }
        ];
        expect(determineUserVibes(tracks)).toBeNull();
      });
      
  });

  describe('analyzeAndStoreUserVibes', () => {
    it('should analyze and return the user vibe', async () => {
      const mockTracks = { items: [{ track: { id: '123' } }] };
      const mockFeatures = {
        energy: 0.8,
        tempo: 140,
        danceability: 0.7,
        valence: 0.7,
        loudness: -5,
        acousticness: 0.3,
        instrumentalness: 0.0,
      };
        
      (axios.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockTracks }) // First API call: get saved tracks
        .mockResolvedValueOnce({ data: mockFeatures }); // Second API call: get track features
  
      const req = { headers: { authorization: 'test_token' }, params: { userId: 'user123' } } as any;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;
  
      await analyzeAndStoreUserVibes(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ userVibe: 'Energetic Energy' });
    });
  
    it('should return 500 error if API fails', async () => {
      (axios.get as jest.Mock).mockRejectedValueOnce(new Error('API error'));
  
      const req = { headers: { authorization: 'test_token' }, params: { userId: 'user123' } } as any;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;
  
      await analyzeAndStoreUserVibes(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error analyzing and storing user vibes');
    });
  });
  
  