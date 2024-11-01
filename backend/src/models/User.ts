import { Schema, model } from 'mongoose';
import Favorites from './Favorites';
import Playlist from './Playlist';

const User = new Schema({
  username: String,
  password: String,
  spotifyId: String,
  bio: String,
  location: String,
  favorites: Favorites,
  annotatedPlaylists: [Playlist],
});

const UserModel = model('User', User);
