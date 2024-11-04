import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { getDbConnection } from '../utils/connection';

/**
 * Retrieve a user by their username
 * @param req
 * @param res
 * @returns
 */
export const getUserByUsername = async (req: Request, res: Response) => {
  const connection = getDbConnection();
  if (!req.params.username) {
    res.status(400).send('Invalid request');
    return;
  }
  const userModel = connection.model('User');
  const user = await userModel.findOne({ username: req.params.username });
  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  res.status(200).send(user);
};

/**
 * Update any field of a user by their username
 * @param req
 * @param res
 * @returns
 */
export const updateUserByUsername = async (req: Request, res: Response) => {
  const connection = getDbConnection();
  if (!req.params.username || !req.body) {
    res.status(400).send('Invalid request');
    return;
  }
  const userModel = connection.model('User');
  const user = await userModel.findOne({ username: req.params.username });
  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  try {
    await user.updateOne(req.body);
    res.status(200).send('User updated');
  } catch (err) {
    res.status(500).send('Error updating user');
  }
};

/**
 * Delete a user by their username
 * @param req
 * @param res
 * @returns
 */
export const deleteUserByUsername = async (req: Request, res: Response) => {
  const connection = getDbConnection();
  if (!req.params.username) {
    res.status(400).send('Invalid request');
    return;
  }
  const userModel = connection.model('User');
  const user = await userModel.findOne({ username: req.params.username });
  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  try {
    await user.deleteOne();
    res.status(200).send('User deleted');
  } catch (err) {
    res.status(500).send('Error deleting user');
  }
};

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
  const userModel = connection.model('User');
  try {
    const user = new userModel({
      username: req.body.username,
      password: req.body.password,
    });
    await user.save();
    res.status(201).send('User created');
  } catch (err) {
    res.status(500).send('Error creating user');
  }
};

/**
 * Get all users
 * @param req
 * @param res
 * @returns
 */
export const getAllUsers = async (req: Request, res: Response) => {
  const connection = getDbConnection();
  const userModel = connection.model('User');
  const users = await userModel.find();
  res.status(200).send(users);
};
