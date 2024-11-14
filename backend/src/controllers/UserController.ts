import { Request, Response } from 'express';
import { getModel } from '../utils/connection';
import { IUser } from '../models/User';

/**
 * Retrieve a user by their username
 * @param req
 * @param res
 * @returns
 */
export const getUserByUsername = async (req: Request, res: Response) => {
  try {
    if (!req.params.username) {
      res.status(400).send('Invalid request');
      return;
    }
    const UserModel = getModel<IUser>('User');
    const user = await UserModel.findOne({ username: req.params.username });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching user');
  }
};

/**
 * Update any field of a user by their username
 * @param req
 * @param res
 * @returns
 */
export const updateUserByUsername = async (req: Request, res: Response) => {
  try {
    if (!req.params.username || !req.body) {
      res.status(400).send('Invalid request');
      return;
    }
    const UserModel = getModel<IUser>('User');
    const user = await UserModel.findOne({ username: req.params.username });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    try {
      await user.updateOne(req.body);
      res.status(200).send('User updated');
    } catch (err) {
      res.status(500).send('Error updating user: ' + err);
    }
  } catch (err) {
    console.error(err);
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
  try {
    if (!req.params.username) {
      res.status(400).send('Invalid request');
      return;
    }
    const UserModel = getModel<IUser>('User');
    const user = await UserModel.findOne({ username: req.params.username });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    try {
      await user.deleteOne();
      res.status(200).send('User deleted');
    } catch (err) {
      res.status(500).send('Error deleting user: ' + err);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting user');
  }
};

/**
 * Create a new user with the given username and password
 * @param req: the request object containing the username and password
 * @param res
 * @returns
 */
export const addUser = async (req: Request, res: Response) => {
  try {
    if (!req.body.username || !req.body.password) {
      res.status(400).send('Invalid request');
    }
    const UserModel = getModel<IUser>('User');
    const user = new UserModel(req.body);
    try {
      await user.save();
      res.status(201).send('User created');
    } catch (err) {
      res.status(500).send('Error creating user: ' + err);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating user');
  }
};

/**
 * Retrieve all users
 * @param req
 * @param res
 * @returns
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const UserModel = getModel<IUser>('User');
    const users = await UserModel.find({});
    res.status(200).send(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching users');
  }
};
