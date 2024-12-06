var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import axios from 'axios';
export const getProfileInfo = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
      spotifyToken: req.body.spotifyToken,
    };
    try {
      const response = yield axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${payload.spotifyToken}`,
        },
      });
      res.status(200).send(response.data);
    } catch (err) {
      console.error('Error fetching profile info:', err);
      res.status(500).send('Error fetching profile info');
    }
  });
export const getMyPlaylists = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const payload = {
        spotifyToken: req.query.spotifyToken,
      };
      const response = yield axios.get(
        'https://api.spotify.com/v1/me/playlists',
        {
          headers: {
            Authorization: `Bearer ${payload.spotifyToken}`,
          },
        }
      );
      res.status(200).send(response.data);
    } catch (err) {
      console.error('Error fetching playlists:', err);
      res.status(500).send('Error fetching playlists');
    }
  });
export const getPlaylist = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
      spotifyToken: req.query.spotifyToken || req.body.spotifyToken,
    };
    console.log('Payload:', payload);
    try {
      const response = yield axios.get(`https://api.spotify.com/v1/playlists`, {
        headers: {
          Authorization: `Bearer ${payload.spotifyToken}`,
        },
      });
      res.status(200).send(response.data);
    } catch (err) {
      console.error('Error fetching playlists:', err);
      res.status(500).send('Error fetching playlists');
    }
  });
export const getPlaylists = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
      spotifyToken: req.params.spotifyToken,
      playlistId: req.params.playlistId,
    };
    try {
      const response = yield axios.get(
        `https://api.spotify.com/v1/playlists/${payload.playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${payload.spotifyToken}`,
          },
        }
      );
      res.status(200).send(response.data);
    } catch (err) {
      console.error('Error fetching playlists:', err);
      res.status(500).send('Error fetching playlists');
    }
  });
export const getPlaylistTracks = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // Extract spotifyToken from the Authorization header
      const spotifyToken = req.headers.authorization;
      const playlistId = req.params.playlistId;
      if (!spotifyToken) {
        res.status(400).send('Spotify token is missing');
        return;
      }
      // Make request to Spotify API to get playlist tracks
      const response = yield axios.get(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
          },
        }
      );
      //console.log('Playlist track in getPlaylistTracks:', response.data);
      // Send the data from Spotify API as the response
      res.status(200).send(response.data);
    } catch (err) {
      console.error('Error fetching playlist tracks:', err);
      // Send a 500 error response with more information if available
      res.status(500).send('Error fetching playlist tracks');
    }
  });
export const getFriends = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
      spotifyToken: req.body.spotifyToken,
    };
    try {
      const response = yield axios.get(
        'https://api.spotify.com/v1/me/following?type=user',
        {
          headers: {
            Authorization: `Bearer ${payload.spotifyToken}`,
          },
        }
      );
      res.status(200).send(response.data);
    } catch (err) {
      console.error('Error fetching friends:', err);
      res.status(500).send('Error fetching friends');
    }
  });
export const getUserPlaylists = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
      spotifyToken: req.body.spotifyToken,
      username: req.params.username,
    };
    try {
      const response = yield axios.get(
        `https://api.spotify.com/v1/users/${payload.username}/playlists`,
        {
          headers: {
            Authorization: `Bearer ${payload.spotifyToken}`,
          },
        }
      );
      res.status(200).send(response.data);
    } catch (err) {
      console.error('Error fetching user playlists:', err);
      res.status(500).send('Error fetching user playlists');
    }
  });
export const getUserPlaylistTracks = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
      spotifyToken: req.body.spotifyToken,
      username: req.params.username,
      playlistId: req.params.playlistId,
    };
    try {
      const response = yield axios.get(
        `https://api.spotify.com/v1/users/${payload.username}/playlists/${payload.playlistId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${payload.spotifyToken}`,
          },
        }
      );
      res.status(200).send(response.data);
    } catch (err) {
      console.error('Error fetching user playlist tracks:', err);
      res.status(500).send('Error fetching user playlist tracks');
    }
  });
export const getArtistInfo = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
      const spotifyToken =
        (_a = req.headers.authorization) === null || _a === void 0
          ? void 0
          : _a.split(' ')[1]; // Splits "Bearer token"
      const artistId = req.params.artistId;
      if (!spotifyToken) {
        res.status(400).send('Spotify token is missing');
        return;
      }
      const response = yield axios.get(
        `https://api.spotify.com/v1/artists/${artistId}`,
        {
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
          },
        }
      );
      res.status(200).send(response.data);
    } catch (err) {
      console.error('Error fetching artist info:', err);
      res.status(500).send('Error fetching artist info');
    }
  });
export const getMultipleArtistInfo = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
      const spotifyToken =
        (_a = req.headers.authorization) === null || _a === void 0
          ? void 0
          : _a.split(' ')[1]; // Splits "Bearer token"
      const artistIds =
        (_b = req.query.ids) === null || _b === void 0 ? void 0 : _b.split(',');
      if (!spotifyToken) {
        res.status(400).send('Spotify token is missing');
        return;
      }
      const response = yield axios.get(
        `https://api.spotify.com/v1/artists?ids=${artistIds.join(',')}`,
        {
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
          },
        }
      );
      res.status(200).send(response.data);
    } catch (err) {
      console.error('Error fetching artist info:', err);
      res.status(500).send('Error fetching artist info');
    }
  });
