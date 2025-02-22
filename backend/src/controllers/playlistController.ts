import { Request, Response } from 'express';
import { getModel } from '../utils/connection';
import { IPlaylist } from '../models/Playlist';
import { IUser } from '../models/User';
import { authenticateUser } from '../middleware/auth';
//import mongoose from 'mongoose';

/**
 * Add a new playlist
 * @param req
 * @param res
 * @returns
 * */
export const addPlaylist = async (req: Request, res: Response) => {
  const PlaylistModel = getModel<IPlaylist>('Playlist');
  try {
    const newPlaylist = await PlaylistModel.create(req.body);
    res.status(201).send('Playlist created');
  } catch (error) {
    res.status(500).send('Error adding playlist');
  }
};

export const updatePlaylistById = async (req: Request, res: Response) => {
  try {
    const PlaylistModel = getModel<IPlaylist>('Playlist');
    const playlist = await PlaylistModel.findById(req.params.playlistId);
    
    if (!playlist || playlist.isDeleted) {
      res.status(404).send('Playlist not found');
      return;
    }

    // Only creator can update playlist
    if (playlist.creator.toString() !== req.body.userId) {
      res.status(403).send('Not authorized to update this playlist');
      return;
    }

    await playlist.updateOne(req.body);
    res.status(200).send('Playlist updated');
  } catch (err) {
    console.error('Error updating playlist:', err);
    res.status(500).send('Error updating playlist');
  }
};

export const getAllPlaylists = async (req: Request, res: Response) => {
  try {
    const PlaylistModel = getModel<IPlaylist>('Playlist');
    const playlists = await PlaylistModel.find({
      isDeleted: false,
      removedFromProfile: false
    });
    res.status(200).send(playlists);
  } catch (err) {
    console.error('Error fetching playlists:', err);
    res.status(500).send('Error fetching playlists');
  }
};

export const getPlaylistById = async (req: Request, res: Response) => {
  try {
    const PlaylistModel = getModel<IPlaylist>('Playlist');
    const playlist = await PlaylistModel.findOne({
      _id: req.params.playlistId,
      isDeleted: false,
      removedFromProfile: false
    });
    
    if (!playlist) {
      res.status(404).send('Playlist not found');
      return;
    }
    res.status(200).send(playlist);
  } catch (err) {
    console.error('Error fetching playlist:', err);
    res.status(500).send('Error fetching playlist');
  }
};

export const deletePlaylistById = async (req: Request, res: Response) => {
  try {
    const PlaylistModel = getModel<IPlaylist>('Playlist');
    const playlist = await PlaylistModel.findById(req.params.playlistId);
    
    if (!playlist) {
      res.status(404).send('Playlist not found');
      return;
    }

    // Soft delete by updating flags
    await playlist.updateOne({
      isDeleted: true,
      removedFromProfile: true
    });

    // Remove from any user's pinned playlists
    const UserModel = getModel<IUser>('User');
    await UserModel.updateMany(
      { pinnedPlaylists: playlist._id },
      { $pull: { pinnedPlaylists: playlist._id } }
    );

    res.status(200).send('Playlist deleted');
  } catch (err) {
    console.error('Error deleting playlist:', err);
    res.status(500).send('Error deleting playlist');
  }
};

export const removeFromProfile = async (req: Request, res: Response) => {
  try {
    const PlaylistModel = getModel<IPlaylist>('Playlist');
    const playlist = await PlaylistModel.findById(req.params.playlistId);
    
    if (!playlist) {
      res.status(404).send('Playlist not found');
      return;
    }

    await playlist.updateOne({ removedFromProfile: true });

    // Remove from any user's pinned playlists
    const UserModel = getModel<IUser>('User');
    await UserModel.updateMany(
      { pinnedPlaylists: playlist._id },
      { $pull: { pinnedPlaylists: playlist._id } }
    );

    res.status(200).send('Playlist removed from profile');
  } catch (err) {
    console.error('Error removing playlist from profile:', err);
    res.status(500).send('Error removing playlist from profile');
  }
};