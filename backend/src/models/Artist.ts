import mongoose from 'mongoose';

export interface IArtist {
  name: string;
  artistId: string;
  genres: string[];
}

export const ArtistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  artistId: { type: String, required: true },
  genres: [{ type: String }],
});
