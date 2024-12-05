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
import { getModel } from '../utils/connection';
/**
 * Retrieve all of a user's favorites
 * @param req
 * @param res
 * @returns
 */
export const getUserFavorites = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const FavoritesModel = getModel('Favorites');
      const favorites = yield FavoritesModel.find({
        userId: req.params.userId,
      }).exec();
      res.status(200).json(favorites);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      res.status(500).send('Error fetching favorites');
    }
  });
/**
 * Add a favorite to a user's favorites
 * @param req
 * @param res
 * @returns
 */
export const addFavorite = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const FavoritesModel = getModel('Favorites');
      const { userId, song, artist, genre } = req.body;
      if (!userId || (!song && !artist && !genre)) {
        res.status(400).send('Invalid request');
      }
      const favorite = new FavoritesModel({ userId, song, artist, genre });
      yield favorite.save().catch((err) => {
        console.error('Error saving favorite:', err);
        throw err;
      });
      res.status(201).send('Favorite added');
    } catch (err) {
      console.error('Error adding favorite:', err);
      res.status(500).send('Error adding favorite');
    }
  });
/**
 * Remove a favorite from a user's favorites
 * @param req
 * @param res
 * @returns
 */
export const removeFavorite = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const FavoritesModel = getModel('Favorites');
      const { userId, song, artist, genre } = req.body;
      if (!userId || (!song && !artist && !genre)) {
        res.status(400).send('Invalid request');
      }
      const favorite = yield FavoritesModel.findOneAndDelete({
        userId,
        song,
        artist,
        genre,
      }).exec();
      if (!favorite) {
        res.status(404).send('Favorite not found');
      }
      res.status(200).send('Favorite removed');
    } catch (err) {
      console.error('Error removing favorite:', err);
      res.status(500).send('Error removing favorite');
    }
  });
/**
 * Update a favorite in a user's favorites
 * @param req
 * @param res
 * @returns
 */
export const updateFavorite = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const FavoritesModel = getModel('Favorites');
      const { userId, oldFavorite, newFavorite } = req.body;
      if (!userId || !oldFavorite || !newFavorite) {
        res.status(400).send('Invalid request');
      }
      const favorite = yield FavoritesModel.findOneAndUpdate(
        Object.assign({ userId }, oldFavorite),
        Object.assign({}, newFavorite),
        { new: true }
      ).exec();
      if (!favorite) {
        res.status(404).send('Favorite not found');
      }
      res.status(200).send('Favorite updated');
    } catch (err) {
      console.error('Error updating favorite:', err);
      res.status(500).send('Error updating favorite');
    }
  });
