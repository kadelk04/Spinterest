import mongoose from 'mongoose';
export const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  songs: [String],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});
