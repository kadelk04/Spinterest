import { Request, Response, Router } from 'express';
import { IUser } from '../models/User';
import { getModel } from '../utils/connection';
import { IFavorites } from '../models/Favorites';

const profileController = Router();

profileController.post(
  '/logProfileInput',
  async (req: Request, res: Response) => {
    try {
      const {
        username,
        favgen1,
        favgen2,
        fava1,
        fava2,
        favalb1,
        favalb2,
        ...profileData
      } = req.body;

      const UserM = getModel<IUser>('User');
      const FavoritesM = getModel<IFavorites>('Favorites');
      const user = await UserM.findOne({ username });

      if (!user) {
        res.status(404).send('User not found');
        return;
      }

      //updating user profile data
      for (const key in profileData) {
        if (profileData[key] !== undefined) {
          if (key === 'biography') {
            user.bio = profileData[key]; //ensuring bio is saved
          } else {
            user[key as keyof IUser] = profileData[key];
          }
        }
      }

      console.log(profileData);

      //updating the favorites list
      if (!user.favoritesId) {
        const newFavs = new FavoritesM({
          userId: user._id,
          genre: [favgen1, favgen2].filter(Boolean),
          artist: [fava1, fava2].filter(Boolean),
          album: [favalb1, favalb2].filter(Boolean),
        });
        await newFavs.save();
        user.favoritesId = newFavs._id;
      } else {
        await FavoritesM.findOneAndUpdate(
          { _id: user.favoritesId },
          {
            genre: [favgen1, favgen2].filter(Boolean),
            artist: [fava1, fava2].filter(Boolean),
            album: [favalb1, favalb2].filter(Boolean),
          },
          { new: true }
        );
      }

      // Log all received data to the terminal
      console.log('Received Profile Input:');
      console.log('-------------------');

      // Log each field if it exists
      if (profileData.status) {
        console.log(`Status: ${profileData.status}`);
      } else {
        console.log('Status is undefined or not provided');
      }
      if (profileData.location) {
        console.log(`Location: ${profileData.location}`);
      }
      if (profileData.links) {
        console.log(`Links: ${profileData.links}`);
      }
      if (profileData.biography) {
        console.log(`Biography: ${profileData.biography}`);
      }
      if (profileData.favgen1) {
        console.log(`Favorite Genre 1: ${profileData.favgen1}`);
      }
      if (profileData.favgen2) {
        console.log(`Favorite Genre 2: ${profileData.favgen2}`);
      }
      if (profileData.fava1) {
        console.log(`Favorite Artist 1: ${profileData.fava1}`);
      }
      if (profileData.fava2) {
        console.log(`Favorite Artist 2: ${profileData.fava2}`);
      }
      if (profileData.favalb1) {
        console.log(`Favorite Album 1: ${profileData.favalb1}`);
      }
      if (profileData.favalb2) {
        console.log(`Favorite Album 2: ${profileData.favalb2}`);
      }

      await user?.save();

      res.status(200).json({ message: 'Profile input logged successfully' });
    } catch (error) {
      console.error('Error logging profile input:', error);
      res.status(500).json({ message: 'Error processing profile input' });
    }
  }
);

profileController.get(
  '/logProfileInput',
  async (req: Request, res: Response) => {
    try {
      const username = req.query.username as string;

      const UserM = getModel<IUser>('User');
      const user = await UserM.findOne({ username }).populate('favoritesId');

      if (!user) {
        res.status(404).send('User not found');
        return;
      }

      // Sending data fields as the response
      res.status(200).json({
        status: user.status,
        location: user.location,
        links: user.links,
        biography: user.bio,
        favorites: user.favoritesId,
      });
    } catch (error) {
      console.error('Error fetching profile input:', error);
      res.status(500).json({ message: 'Error fetching profile input' });
    }
  }
);

// Start the server
export default profileController;
