import { Request, Response } from 'express';
import { getModel } from '../utils/connection';
import { IUser } from '../models/User';
import { getFriends } from '../controllers/spotifyController';

/**
 * Retrieve a user by their username
 * @param req
 * @param res
 * @returns
 */
export const getUserByUsername = async (req: Request, res: Response) => {
  try {
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
    const UserModel = getModel<IUser>('User');
    const user = await UserModel.findOne({ username: req.params.username });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    await user.updateOne(req.body);
    res.status(200).send('User updated');
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
    const UserModel = getModel<IUser>('User');
    const user = await UserModel.findOne({ username: req.params.username });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    await user.deleteOne();
    res.status(200).send('User deleted');
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
    const UserModel = getModel<IUser>('User');
    await UserModel.create(req.body);
    res.status(201).send('User created');
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

export const saveUserSpotifyId = async (req: Request, res: Response) => {
  let accessToken = req.params.accessToken;
  try {
    const UserModel = getModel<IUser>('User');

    let response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      res.status(500).send('Error fetching Spotify ID');
      return;
    }

    const data = await response.json();
    const spotifyId = data.id;

    const user = await UserModel.findOne({ username: req.body.username });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    user.spotifyId = spotifyId;
    await user.save();

    res.status(200).send('Spotify ID saved');
  } catch (err) {
    console.error('Error saving Spotify ID:', err);
    res.status(500).send('Error saving Spotify ID');
  }
};
export const getUserSpotifyId = async (req: Request, res: Response) => {
  try {
    const UserModel = getModel<IUser>('User');
    const user = await UserModel.findOne({ username: req.params.username });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    res.status(200).send({ spotifyId: user.spotifyId });
  } catch (err) {
    console.error('Error fetching Spotify ID:', err);
    res.status(500).send('Error fetching Spotify ID');
  }
};

// export const getAllFriends = async (req: Request, res: Response) => {
//   try {
//       // Replace this URL with the endpoint that fetches friends from Spotify
//       const response = await axios.get('https://api.spotify.com/v1/me/friends', {
//           headers: {
//               Authorization: `Bearer ${accessToken}`,
//           },
//       });
//       return response.data.friends; // Adjust based on the API response structure
//   } catch (error) {
//       console.error('Error fetching friends:', error.message);
//       throw new Error('Failed to fetch friends from Spotify');
//   }
// };
