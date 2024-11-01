import { getDbConnection } from '../../../connection';
import { Schema } from 'mongoose';
const User = require('../../../models/User');
import { Request, Response } from 'express';

/**
 * Create a new user with the given username and password
 * @param req: the request object containing the username and password
 * @param res
 * @returns
 */
export const createUser = async (req: Request, res: Response) => {
  const connection = getDbConnection();
  if (!req.body || !req.body.username || !req.body.password) {
    res.status(400).send('Invalid request');
    return;
  }
  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
  });
  await newUser.save();
  res.status(200).send('User created');
};

/**
 * Get a user by their username
 * @param req: the request object containing the username
 * @param res
 * @returns
 */
export const getUser = async (req: Request, res: Response) => {
  const connection = getDbConnection();
  if (!req.params.username) {
    res.status(400).send('Invalid request');
    return;
  }
  const user = await User.findOne({ username: req.params.username });
  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  res.status(200).send(user);
};

/**
 * Update a user's bio
 * @param req: the request object containing the username and bio
 * @param res
 * @returns
 */
export const updateBio = async (req: Request, res: Response) => {
  const connection = getDbConnection();
  if (!req.body || !req.body.username || !req.body.bio) {
    res.status(400).send('Invalid request');
    return;
  }
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  user.bio = req.body.bio;
  await user.save();
  res.status(200).send('Bio updated');
};

/**
 * Update a user's location
 * @param req: the request object containing the username and location
 * @param res
 * @returns
 */
export const updateLocation = async (req: Request, res: Response) => {
  const connection = getDbConnection();
  if (!req.body || !req.body.username || !req.body.location) {
    res.status(400).send('Invalid request');
    return;
  }
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  user.location = req.body.location;
  await user.save();
  res.status(200).send('Location updated');
};

/**
 * Get a user's bio
 * @param req: the request object containing the username
 * @param res
 * @returns
 */
export const getBio = async (req: Request, res: Response) => {
  const connection = getDbConnection();
  if (!req.params.username) {
    res.status(400).send('Invalid request');
    return;
  }
  const user = await User.findOne({ username: req.params.username });
  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  res.status(200).send(user.bio);
};

/**
 * Get a user's location
 * @param req: the request object containing the username
 * @param res
 * @returns
 */
export const getLocation = async (req: Request, res: Response) => {
  const connection = getDbConnection();
  if (!req.params.username) {
    res.status(400).send('Invalid request');
    return;
  }
  const user = await User.findOne({ username: req.params.username });
  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  res.status(200).send(user.location);
};

/**
 * Delete a user by their username
 * @param req: the request object containing the username
 * @param res
 * @returns
 */
export const deleteUser = async (req: Request, res: Response) => {
  const connection = getDbConnection();
  if (!req.params.username) {
    res.status(400).send('Invalid request');
    return;
  }
  const user = await User.findOne({ username: req.params.username });
  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  await user.remove();
  res.status(200).send('User deleted');
};

/**
 * Get all users
 * @param req
 * @param res
 * @returns
 */
export const getAllUsers = async (req: Request, res: Response) => {
  const connection = getDbConnection();
  const users = await User.find();
  res.status(200).send(users);
};
