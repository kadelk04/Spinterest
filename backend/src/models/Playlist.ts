import { Schema } from 'mongoose';

const Playlist = new Schema({
  spotifyId: String,
  tags: [String],
});

export default Playlist;
