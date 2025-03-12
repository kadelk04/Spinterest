import mongoose from 'mongoose';

export interface IPlaylist {
  spotifyId: string;
  genres?: string[];
  tags?: string[];
}

export const PlaylistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  cover: { type: String, required: true },
  spotifyId: { type: String, required: true },
  genres: { type: [String], required: false },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  creator_name: { type: String, required: true },
  likes: { type: Number, default: 0 },
});
