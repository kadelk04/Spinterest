import mongoose from 'mongoose';

export interface IPlaylist {
  spotifyId: string;
  tags: string[];
  likes: number;
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
  likes: { type: Number, default: 0 },
});
