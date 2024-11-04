import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { getDbConnection } from '../utils/connection';

/**
 * Retrieve all of a user's favorites
 * @param req
 * @param res
 * @returns
 * */
export const getUserFavorites = async (req: Request, res: Response) => {
  const connection = getDbConnection();
  const userModel = connection.model('User');
  const user = await userModel.findOne({ username: req.params.username });
  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  res.status(200).send(user.favorites);
};

/**
 * Add a favorite to a user's favorites
 * @param req
 * @param res
 * @returns
 */
export const addFavorite = async (req: Request, res: Response) => {
  const connection = getDbConnection();
  if (!req.params.username || !req.body || !req.body.favorite) {
    res.status(400).send('Invalid request');
    return;
  }
  const userModel = connection.model('User');
  const user = await userModel.findOne({ username: req.params.username });
  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  user.favorites.push(req.body.favorite);
  try {
    await user.save();
    res.status(201).send('Favorite added');
  } catch (err) {
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
  const connection = getDbConnection();
  if (!req.params.username || !req.body || !req.body.favorite) {
    res.status(400).send('Invalid request');
    return;
  }
  const userModel = connection.model('User');
  const user = await userModel.findOne({ username: req.params.username });
  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  user.favorites = user.favorites.filter(
    (favorite: string) => favorite !== req.body.favorite
  );
  try {
    await user.save();
    res.status(200).send('Favorite removed');
  } catch (err) {
    res.status(500).send('Error removing favorite');
  }
};

/**
 * Update favorite in a user's favorites
 * @param req
 * @param res
 * @returns
 */
export const updateFavorite = async (req: Request, res: Response) => {
  const connection = getDbConnection();
  if (!req.params.username || !req.body || !req.body.favorite) {
    res.status(400).send('Invalid request');
    return;
  }
  const userModel = connection.model('User');
  const user = await userModel.findOne({ username: req.params.username });
  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  user.favorites = user.favorites.map((favorite: string) =>
    favorite === req.body.favorite ? req.body.favorite : favorite
  );
  try {
    await user.save();
    res.status(200).send('Favorite updated');
  } catch (err) {
    res.status(500).send('Error updating favorite');
  }
};
