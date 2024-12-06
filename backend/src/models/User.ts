import mongoose from 'mongoose';
import { IFavorites } from './Favorites';
import { IPlaylist } from './Playlist';

export interface IUser {
  username: string;
  password: string;
  spotifyId?: string;
  refreshToken?: string;
  status?: string;
  bio?: string;
  location?: string;
  links?: string;
  favorites: IFavorites;
  favoritesId: mongoose.Types.ObjectId;
  annotatedPlaylists?: IPlaylist[];
}

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  spotifyId: String,
  bio: String,
  status: String,
  location: String,
  links: String,
  refreshToken: String,
  favoritesId: { type: mongoose.Schema.Types.ObjectId, ref: 'Favorites' },
  annotatedPlaylists: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' },
  ],
});
