import mongoose from 'mongoose';
import { IFavorites } from '../models/Favorites';
import { FavoritesSchema } from '../models/Favorites';
import { IPlaylist } from '../models/Playlist';
import { PlaylistSchema } from '../models/Playlist';
import { IUser } from '../models/User';
import { UserSchema } from '../models/User';
import dotenv from 'dotenv';
import { ArtistSchema, IArtist } from '../models/Artist';

let connection: mongoose.Connection | null = null;
const env = dotenv.config({ path: '.env.local' });

export const getDbConnection = async (): Promise<mongoose.Connection> => {
  if (connection) {
    return connection;
  }

  const MONGO_URI = `mongodb+srv://spinterest_admin:${env.parsed?.MONGO_DB_PASSWORD}@spinterestdb.tw3jz.mongodb.net/?retryWrites=true&w=majority&appName=SpinterestDB`;
  if (!env.parsed?.MONGO_DB_PASSWORD) {
    console.error('MONGO_DB_PASSWORD environment variable is not set');
    process.exit(1);
  }
  try {
    const conn = await mongoose.createConnection(MONGO_URI!, {}).asPromise();

    // Register models
    conn.model<IUser>('User', UserSchema);
    conn.model<IPlaylist>('Playlist', PlaylistSchema);
    conn.model<IFavorites>('Favorites', FavoritesSchema);
    conn.model<IArtist>('Artist', ArtistSchema);

    connection = conn;
    console.log('DB Connection established');
    return connection;
  } catch (error) {
    console.error('DB Connection error:', error);
    process.exit(1);
  }
};

export const getModel = <T>(modelName: string): mongoose.Model<T> => {
  if (!connection) {
    throw new Error('Database connection not initialized');
  }
  return connection.model<T>(modelName);
};
