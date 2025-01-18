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
 * Retrieve a user by their spotifyId
 * @param req
 * @param res
 * @returns
 */
export const getUserBySpotifyId = async (req: Request, res: Response) => {
  try {
    const UserModel = getModel<IUser>('User');
    const user = await UserModel.findOne({ spotifyId: req.params.spotifyId });
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

export const viewProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.params; // Get username from URL parameter

    const UserM = getModel<IUser>('User');
    const user = await UserM.findOne({ username }).populate('favoritesId');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Return user profile data
    res.status(200).json({
      username: user.username,
      status: user.status,
      location: user.location,
      links: user.links,
      biography: user.bio,
      favorites: user.favoritesId,
    });
  } catch (error) {
    console.error('Error viewing profile:', error);
    res.status(500).json({ message: 'Error retrieving profile' });
  }
};

/**
 * Retrieve all users
 * @param req
 * @param res
 * @returns
 */
export const searchUsers = async (req: Request, res: Response) => {
  try {
    console.log('Searching for username:', req.params.username); // Debug log
    const UserModel = getModel<IUser>('User');
    const user = await UserModel.findOne({
      username: { $regex: req.params.username, $options: 'i' },
    });

    if (!user) {
      console.log('No user found'); // Debug log
      res.status(404).json({ message: 'User not found' });
      return;
    }

    console.log('Found user:', user); // Debug log
    res.status(200).json(user);
  } catch (err) {
    console.error('Error in getUserByUsername:', err);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// helper function to use spotify API to get logged in user's spotifyId
const fetchSpotifyId = async (accessToken: string): Promise<string> => {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error fetching Spotify ID from Spotify API');
  }

  const data = await response.json();
  return data.id;
};

export const saveUserSpotifyId = async (req: Request, res: Response) => {
  const accessToken = req.params.accessToken;

  try {
    const UserModel = getModel<IUser>('User');
    const spotifyId = await fetchSpotifyId(accessToken);

    const user = await UserModel.findOne({ username: req.body.username });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    user.spotifyId = spotifyId;
    await user.save();

    res.status(200).send('Spotify ID saved successfully');
  } catch (err) {
    console.error('Error saving Spotify ID:', err);
    res.status(500).send('Error saving Spotify ID');
  }
};

export const getUserSpotifyId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const accessToken = req.body;
  if (!accessToken) {
    console.error('No accessToken');
    return;
  }

  try {
    const spotifyId = await fetchSpotifyId(accessToken);
    res.status(200).send({ spotifyId });
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

export const addFollower = async (req: Request, res: Response) => {
  try {
    const UserModel = getModel<IUser>('User');
    const user = await UserModel.findOne({ username: req.params.username });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    user.followers.push(req.body.follower);
    await user.save();
    res.status(200).send('Follower added');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding follower');
  }
};
export const getFollowers = async (req: Request, res: Response) => {
  const UserModel = getModel<IUser>('User');
  const user = await UserModel.findOne({ username: req.params.username });
  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  res.status(200).send(user.followers);
};
export const getFollowing = async (req: Request, res: Response) => {
  const UserModel = getModel<IUser>('User');
  const user = await UserModel.findOne({ username: req.params.username });
  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  res.status(200).send(user.following);
};
export const removeFollower = async (req: Request, res: Response) => {
  const UserModel = getModel<IUser>('User');
  const user = await UserModel.findOne({ username: req.params.username });
  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  const index = user.followers.indexOf(req.body.follower);
  if (index > -1) {
    user.followers.splice(index, 1);
  }
  await user.save();
  res.status(200).send('Follower removed');
};
