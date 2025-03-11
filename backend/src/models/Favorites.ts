import mongoose from 'mongoose';

export interface IFavorites {
  userId: string;
  genre?: string[];
  artist?: string[];
  album?: string[];
}

export const FavoritesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  album: [{ type: String }],
  artist: [{ type: String }],
  genre: [{ type: String }],
});
