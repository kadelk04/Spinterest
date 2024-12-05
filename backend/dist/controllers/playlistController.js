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
import { getModel } from '../utils/connection';
/**
 * Retrieve all playlists
 * @param req
 * @param res
 * @param connection
 * @returns
 * */
export const getAllPlaylists = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const PlaylistModel = getModel('Playlist');
      const playlists = yield PlaylistModel.find();
      res.status(200).send(playlists);
    } catch (err) {
      console.error('Error fetching playlists:', err);
      res.status(500).send('Error fetching playlists');
    }
  });
/**
 * Add a new playlist
 * @param req
 * @param res
 * @returns
 * */
export const addPlaylist = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      if (!req.body) {
        res.status(400).send('Invalid request');
        return;
      }
      const PlaylistModel = getModel('Playlist');
      const playlist = new PlaylistModel(req.body);
      yield playlist.save();
      res.status(201).send('Playlist created');
    } catch (err) {
      console.error('Error adding playlist:', err);
      res.status(500).send('Error adding playlist');
    }
  });
/**
 * Get a playlist by its ID
 * @param req
 * @param res
 * @returns
 * */
export const getPlaylistById = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      if (!req.params.playlistId) {
        res.status(400).send('Invalid request');
        return;
      }
      const PlaylistModel = getModel('Playlist');
      const playlist = yield PlaylistModel.findById(req.params.playlistId);
      if (!playlist) {
        res.status(404).send('Playlist not found');
        return;
      }
      res.status(200).send(playlist);
    } catch (err) {
      console.error('Error fetching playlist:', err);
      res.status(500).send('Error fetching playlist');
    }
  });
/**
 * Update a playlist by its ID
 * @param req
 * @param res
 * @param connection
 * @returns
 * */
export const updatePlaylistById = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      if (!req.params.playlistId || !req.body) {
        res.status(400).send('Invalid request');
        return;
      }
      const PlaylistModel = getModel('Playlist');
      const playlist = yield PlaylistModel.findById(req.params.playlistId);
      if (!playlist) {
        res.status(404).send('Playlist not found');
        return;
      }
      yield playlist.updateOne(req.body);
      res.status(200).send('Playlist updated');
    } catch (err) {
      console.error('Error updating playlist:', err);
      res.status(500).send('Error updating playlist');
    }
  });
/**
 * Delete a playlist by its ID
 * @param req
 * @param res
 * @returns
 * */
export const deletePlaylistById = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      if (!req.params.playlistId) {
        res.status(400).send('Invalid request');
        return;
      }
      const PlaylistModel = getModel('Playlist');
      const playlist = yield PlaylistModel.findById(req.params.playlistId);
      if (!playlist) {
        res.status(404).send('Playlist not found');
        return;
      }
      yield playlist.deleteOne();
      res.status(200).send('Playlist deleted');
    } catch (err) {
      console.error('Error deleting playlist:', err);
      res.status(500).send('Error deleting playlist');
    }
  });
/**
 * Retrieve all of a user's playlists
 * @param req
 * @param res
 * @returns
 */
export const getPlaylistsByUsername = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      if (!req.params.username) {
        res.status(400).send('Invalid request');
        return;
      }
      const PlaylistModel = getModel('Playlist');
      const playlists = yield PlaylistModel.find({
        username: req.params.username,
      });
      res.status(200).send(playlists);
    } catch (err) {
      console.error('Error fetching playlists:', err);
      res.status(500).send('Error fetching playlists');
    }
  });
