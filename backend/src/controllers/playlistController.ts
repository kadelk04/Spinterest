import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { getDbConnection } from '../utils/connection';

/**
 * Retrieve all playlists
 * @param req
 * @param res
 * @param connection
 * @returns
 * */
export const getAllPlaylists = async (req: Request, res: Response) => {
  const connection = getDbConnection();
  const playlistModel = connection.model('Playlist');
  const playlists = await playlistModel.find();
  res.status(200).send(playlists);
};

/**
 * Create a new playlist
 * @param req
 * @param res
 * @returns
 * */
export const createPlaylist = async (req: Request, res: Response) => {
  const connection = getDbConnection();
  if (!req.body || !req.body.name || !req.body.songs) {
    res.status(400).send('Invalid request');
    return;
  }
  const playlistModel = connection.model('Playlist');
  try {
    const playlist = new playlistModel({
      name: req.body.name,
      songs: req.body.songs,
    });
    await playlist.save();
    res.status(201).send('Playlist created');
  } catch (err) {
    res.status(500).send('Error creating playlist');
  }
};

/**
 * Get a playlist by its ID
 * @param req
 * @param res
 * @returns
 * */
export const getPlaylistById = async (req: Request, res: Response) => {
  const connection = getDbConnection();
  if (!req.params.playlistId) {
    res.status(400).send('Invalid request');
    return;
  }
  const playlistModel = connection.model('Playlist');
  const playlist = await playlistModel.findById(req.params.playlistId);
  if (!playlist) {
    res.status(404).send('Playlist not found');
    return;
  }
  res.status(200).send(playlist);
};

/**
 * Update a playlist by its ID
 * @param req
 * @param res
 * @param connection
 * @returns
 * */
export const updatePlaylistById = async (req: Request, res: Response) => {
  const connection = getDbConnection();
  if (!req.params.playlistId || !req.body) {
    res.status(400).send('Invalid request');
    return;
  }
  const playlistModel = connection.model('Playlist');
  const playlist = await playlistModel.findById(req.params.playlistId);
  if (!playlist) {
    res.status(404).send('Playlist not found');
    return;
  }
  try {
    await playlist.updateOne(req.body);
    res.status(200).send('Playlist updated');
  } catch (err) {
    res.status(500).send('Error updating playlist');
  }
};

/**
 * Delete a playlist by its ID
 * @param req
 * @param res
 * @returns
 * */
export const deletePlaylistById = async (req: Request, res: Response) => {
  const connection = getDbConnection();
  if (!req.params.playlistId) {
    res.status(400).send('Invalid request');
    return;
  }
  const playlistModel = connection.model('Playlist');
  const playlist = await playlistModel.findById(req.params.playlistId);
  if (!playlist) {
    res.status(404).send('Playlist not found');
    return;
  }
  try {
    await playlist.deleteOne();
    res.status(200).send('Playlist deleted');
  } catch (err) {
    res.status(500).send('Error deleting playlist');
  }
};

/**
 * Retrieve all of a user's playlists
 * @param req
 * @param res
 * @returns
 */
export const getPlaylistByUsername = async (req: Request, res: Response) => {
  const connection = getDbConnection();
  if (!req.params.username) {
    res.status(400).send('Invalid request');
    return;
  }
  const userModel = connection.model('User');
  const user = await userModel.findOne({ username: req.params.username });
  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  res.status(200).send(user.playlist);
};
