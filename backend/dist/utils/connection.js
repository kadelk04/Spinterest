var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import mongoose from 'mongoose';
import { FavoritesSchema } from '../models/Favorites';
import { PlaylistSchema } from '../models/Playlist';
import { UserSchema } from '../models/User';
import dotenv from 'dotenv';
let connection = null;
const env = dotenv.config({ path: '.env.local' });
export const getDbConnection = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (connection) {
      return connection;
    }
    const MONGO_URI = `mongodb+srv://spinterest_admin:${(_a = env.parsed) === null || _a === void 0 ? void 0 : _a.MONGO_DB_PASSWORD}@spinterestdb.tw3jz.mongodb.net/?retryWrites=true&w=majority&appName=SpinterestDB`;
    if (
      !((_b = env.parsed) === null || _b === void 0
        ? void 0
        : _b.MONGO_DB_PASSWORD)
    ) {
      console.error('MONGO_DB_PASSWORD environment variable is not set');
      process.exit(1);
    }
    try {
      const conn = yield mongoose.createConnection(MONGO_URI, {}).asPromise();
      // Register models
      conn.model('User', UserSchema);
      conn.model('Playlist', PlaylistSchema);
      conn.model('Favorites', FavoritesSchema);
      connection = conn;
      console.log('DB Connection established');
      return connection;
    } catch (error) {
      console.error('DB Connection error:', error);
      process.exit(1);
    }
  });
export const getModel = (modelName) => {
  if (!connection) {
    throw new Error('Database connection not initialized');
  }
  return connection.model(modelName);
};
