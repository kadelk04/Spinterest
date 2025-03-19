import { Request, Response } from 'express';
import { IUser } from '../models/User';
import { getModel } from '../utils/connection';

/**
 * Fetches the user's bio
 */
export const getUserBio = async (req: Request, res: Response) => {
  try {
    const { username } = req.query; // Get username from query parameters

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const UserM = getModel<IUser>('User');
    const user = await UserM.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ bio: user.bio || '' }); // Return the bio or empty string
  } catch (err) {
    console.error('Error fetching bio:', err);
    res.status(500).json({ error: 'Error fetching bio' });
  }
};

/**
 * Updates profile page attributes (bio, username)
 */
export const updateSettingsPgInfo = async (req: Request, res: Response) => {
  try {
    const { username, biography } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const UserM = getModel<IUser>('User');
    const user = await UserM.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (biography !== undefined) {
      user.bio = biography; // Update bio
    }

    await user.save(); // Save updated user data

    res.status(200).json({ message: 'Settings updated successfully' });
  } catch (err) {
    console.error('Error saving settings data', err);
    res.status(500).json({ error: 'Error saving settings data' });
  }
};
