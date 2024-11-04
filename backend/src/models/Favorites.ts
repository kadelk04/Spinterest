import mongoose, { Schema } from 'mongoose';

export interface IFavorites {
  genre?: string;
  artist?: string;
  album?: string;
}

const FavoritesSchema = new Schema<IFavorites>({
  genre: { type: String },
  artist: { type: String },
  album: { type: String },
});

export default mongoose.model<IFavorites>('Favorites', FavoritesSchema);
