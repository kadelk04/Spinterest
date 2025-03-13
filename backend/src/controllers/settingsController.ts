import { Request, Response } from 'express';
import { IUser } from '../models/User';
import { getModel } from '../utils/connection';

/**
 * Updates profile page attributes (status, about section)
 * @param req
 * @param res
 */
export const updateSettingsPgInfo = async (req: Request, res: Response) => {
  try {
    const { username, ...settingsData } = req.body;

    const UserM = getModel<IUser>('User');

    // Find the user by username
    const user = await UserM.findOne({ username });

    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    // Update user profile data (e.g., biography, other fields)
    for (const key in settingsData) {
      if (settingsData[key] !== undefined) {
        if (key === 'biography') {
          user.bio = settingsData[key]; // Ensure bio is saved
        } else {
          (user as Partial<IUser>)[key as keyof IUser] = settingsData[key];
        }
      }
    }

    // Save updated user data
    await user.save();

    // Send response indicating success
    res.status(200).send('Settings updated successfully');
  } catch (err) {
    console.error('Error saving settings data', err);
    res.status(500).send('Error saving settings data');
  }
};
