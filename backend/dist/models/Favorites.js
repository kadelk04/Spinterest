import mongoose from 'mongoose';
export const FavoritesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  song: String,
  artist: String,
  genre: String,
});
