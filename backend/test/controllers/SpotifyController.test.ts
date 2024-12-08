import request from 'supertest';
import express from 'express';
import {
  getProfileInfo,
  getMyPlaylists,
  getPlaylist,
  getPlaylists,
  getPlaylistTracks,
  getFriends,
  getUserPlaylists,
  getUserPlaylistTracks,
  getArtistInfo,
  getMultipleArtistInfo,
} from '../../src/controllers/spotifyController';
import axios from 'axios';

jest.mock('axios');

const app = express();
app.use(express.json());

app.post('/profile', getProfileInfo);
app.get('/my-playlists', getMyPlaylists);
app.get('/playlist', getPlaylist);
app.get('/playlists/:spotifyToken/:playlistId', getPlaylists);
app.get('/playlist-tracks/:playlistId', getPlaylistTracks);
app.post('/friends', getFriends);
app.get('/user-playlists/:username', getUserPlaylists);
app.get('/user-playlist-tracks/:username/:playlistId', getUserPlaylistTracks);
app.get('/artist/:artistId', getArtistInfo);
app.get('/artists', getMultipleArtistInfo);

describe('Spotify Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get profile info', async () => {
    const mockResponse = { data: { id: 'user123' } };
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const response = await request(app)
      .post('/profile')
      .send({ spotifyToken: 'testToken' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse.data);
  });

  it('should catch errors when getting profile info', async () => {
    (axios.get as jest.Mock).mockRejectedValue(
      new Error('Error fetching profile info')
    );

    const response = await request(app)
      .post('/profile')
      .send({ spotifyToken: 'testToken' });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error fetching profile info');
  });

  it('should get my playlists', async () => {
    const mockResponse = { data: { items: [] } };
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const response = await request(app)
      .get('/my-playlists')
      .query({ spotifyToken: 'testToken' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse.data);
  });

  it('should catch errors when getting my playlists', async () => {
    (axios.get as jest.Mock).mockRejectedValue(
      new Error('Error fetching my playlists')
    );

    const response = await request(app)
      .get('/my-playlists')
      .query({ spotifyToken: 'testToken' });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error fetching playlists');
  });

  it('should get a playlist', async () => {
    const mockResponse = { data: { id: 'playlist123' } };
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const response = await request(app)
      .get('/playlist')
      .query({ spotifyToken: 'testToken' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse.data);
  });

  it('should catch errors when getting a playlist', async () => {
    (axios.get as jest.Mock).mockRejectedValue(
      new Error('Error fetching playlists')
    );

    const response = await request(app)
      .get('/playlist')
      .query({ spotifyToken: 'testToken' });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error fetching playlists');
  });

  it('should get playlists', async () => {
    const mockResponse = { data: { id: 'playlist123' } };
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const response = await request(app).get('/playlists/testToken/playlist123');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse.data);
  });

  it('should catch errors when getting playlists', async () => {
    (axios.get as jest.Mock).mockRejectedValue(
      new Error('Error fetching playlists')
    );

    const response = await request(app).get('/playlists/testToken/playlist123');

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error fetching playlists');
  });

  it('should get playlist tracks', async () => {
    const mockResponse = { data: { items: [] } };
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const response = await request(app)
      .get('/playlist-tracks/playlist123')
      .set('Authorization', 'Bearer testToken');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse.data);
  });

  it('should get playlist tracks with an error', async () => {
    (axios.get as jest.Mock).mockRejectedValue(
      new Error('Error fetching playlist tracks')
    );

    const response = await request(app)
      .get('/playlist-tracks/playlist123')
      .set('Authorization', 'Bearer testToken');

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error fetching playlist tracks');
  });

  it('should get friends', async () => {
    const mockResponse = { data: { items: [] } };
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const response = await request(app)
      .post('/friends')
      .send({ spotifyToken: 'testToken' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse.data);
  });

  it('should catch errors when getting friends', async () => {
    (axios.get as jest.Mock).mockRejectedValue(
      new Error('Error fetching friends')
    );

    const response = await request(app)
      .post('/friends')
      .send({ spotifyToken: 'testToken' });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error fetching friends');
  });

  it('should get user playlists', async () => {
    const mockResponse = { data: { items: [] } };
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const response = await request(app)
      .get('/user-playlists/user123')
      .send({ spotifyToken: 'testToken' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse.data);
  });

  it('should catch errors when getting user playlists', async () => {
    (axios.get as jest.Mock).mockRejectedValue(
      new Error('Error fetching user playlists')
    );

    const response = await request(app)
      .get('/user-playlists/user123')
      .send({ spotifyToken: 'testToken' });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error fetching user playlists');
  });

  it('should get user playlist tracks', async () => {
    const mockResponse = { data: { items: [] } };
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const response = await request(app)
      .get('/user-playlist-tracks/user123/playlist123')
      .send({ spotifyToken: 'testToken' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse.data);
  });

  it('should catch errors when getting user playlist tracks', async () => {
    (axios.get as jest.Mock).mockRejectedValue(
      new Error('Error fetching user playlist tracks')
    );

    const response = await request(app)
      .get('/user-playlist-tracks/user123/playlist123')
      .send({ spotifyToken: 'testToken' });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error fetching user playlist tracks');
  });

  it('should get artist info', async () => {
    const mockResponse = { data: { id: 'artist123' } };
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const response = await request(app)
      .get('/artist/artist123')
      .set('Authorization', 'Bearer testToken');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse.data);
  });

  it('should catch errors when getting artist info', async () => {
    (axios.get as jest.Mock).mockRejectedValue(
      new Error('Error fetching artist info')
    );

    const response = await request(app)
      .get('/artist/artist123')
      .set('Authorization', 'Bearer testToken');

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error fetching artist info');
  });

  it('should get multiple artist info', async () => {
    const mockResponse = { data: { artists: [] } };
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const response = await request(app)
      .get('/artists')
      .query({ ids: 'artist123,artist456' })
      .set('Authorization', 'Bearer testToken');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse.data);
  });

  it('should catch errors when getting multiple artists info', async () => {
    (axios.get as jest.Mock).mockRejectedValue(
      new Error('Error fetching artist info')
    );

    const response = await request(app)
      .get('/artists')
      .query({ ids: 'artist123,artist456' })
      .set('Authorization', 'Bearer testToken');

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error fetching artist info');
  });
});
