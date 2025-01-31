import mongoose from 'mongoose';

export interface IArtist {
  name: string;
  id: string;
  genres: string[];
}

export const ArtistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true },
  genres: [{ type: String }],
});
