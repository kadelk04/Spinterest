import { Request, Response } from 'express';
import { getModel } from '../utils/connection';
import { IFavorites } from '../models/Favorites';

/**
 * Retrieve all of a user's favorites
 * @param req
 * @param res
 * @returns
 */
export const getUserFavorites = async (req: Request, res: Response) => {
  try {
    const FavoritesModel = getModel<IFavorites>('Favorites');
    const favorites = await FavoritesModel.find({
      userId: req.params.userId,
    }).exec();
    res.status(200).json(favorites);
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).send('Error fetching favorites');
  }
};

/**
 * Add a favorite to a user's favorites
 * @param req
 * @param res
 * @returns
 */
export const addFavorite = async (req: Request, res: Response) => {
  try {
    const FavoritesModel = getModel<IFavorites>('Favorites');
    const { userId, song, artist, genre } = req.body;

    if (!userId || (!song && !artist && !genre)) {
      res.status(400).send('Invalid request');
    }
    const favorite = new FavoritesModel({ userId, song, artist, genre });
    await favorite.save().catch((err) => {
      console.error('Error saving favorite:', err);
      throw err;
    });
    res.status(201).send('Favorite added');
  } catch (err) {
    console.error('Error adding favorite:', err);
    res.status(500).send('Error adding favorite');
  }
};

/**
 * Remove a favorite from a user's favorites
 * @param req
 * @param res
 * @returns
 */
export const removeFavorite = async (req: Request, res: Response) => {
  try {
    const FavoritesModel = getModel<IFavorites>('Favorites');
    const { userId, song, artist, genre } = req.body;

    if (!userId || (!song && !artist && !genre)) {
      res.status(400).send('Invalid request');
    }

    const favorite = await FavoritesModel.findOneAndDelete({
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
};

/**
 * Update a favorite in a user's favorites
 * @param req
 * @param res
 * @returns
 */
export const updateFavorite = async (req: Request, res: Response) => {
  try {
    const FavoritesModel = getModel<IFavorites>('Favorites');
    const { userId, oldFavorite, newFavorite } = req.body;

    if (!userId || !oldFavorite || !newFavorite) {
      res.status(400).send('Invalid request');
    }

    const favorite = await FavoritesModel.findOneAndUpdate(
      { userId, ...oldFavorite },
      { ...newFavorite },
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
};
