import mongoose, { Schema } from 'mongoose';

export interface IPlaylist {
  spotifyId: string;
  tags: string[];
}

const Playlist = new Schema({
  spotifyId: { type: String, required: true },
  tags: [String],
});

export default mongoose.model<IPlaylist>('Playlist', Playlist);
