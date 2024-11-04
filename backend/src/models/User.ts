import { Schema, model } from 'mongoose';
import Favorites, { IFavorites } from './Favorites';
import Playlist, { IPlaylist } from './Playlist';

export interface IUser {
  username: string;
  password: string;
  spotifyId?: string;
  bio?: string;
  location?: string;
  favorites: IFavorites;
  annotatedPlaylists?: IPlaylist[];
}

const User = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  spotifyId: String,
  bio: String,
  location: String,
  favorites: Favorites,
  annotatedPlaylists: [Playlist],
});

export default model<IUser>('User', User);
