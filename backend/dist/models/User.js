import mongoose from 'mongoose';
export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  spotifyId: String,
  bio: String,
  location: String,
  refreshToken: String,
  favorites: { type: mongoose.Schema.Types.ObjectId, ref: 'Favorites' },
  annotatedPlaylists: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' },
  ],
});
