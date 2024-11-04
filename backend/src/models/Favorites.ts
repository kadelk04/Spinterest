import mongoose, { Schema } from 'mongoose';

export interface IFavorites {
  genre?: string;
  artist?: string;
  album?: string;
}

export const FavoritesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  song: String,
  artist: String,
  genre: String,
});
