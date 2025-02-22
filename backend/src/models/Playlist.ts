import mongoose from 'mongoose';

export interface IPlaylist {
  spotifyId: string;
  tags: string[];
  title: string;
  cover: string;
  songs: string[];
  creator: mongoose.Types.ObjectId;
  isDeleted: boolean;
  removedFromProfile: boolean;
}

export const PlaylistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  cover: { type: String, required: true },
  spotifyId: { type: String, required: true },
  songs: [String],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isDeleted: { type: Boolean, default: false },
  removedFromProfile: { type: Boolean, default: false }
});