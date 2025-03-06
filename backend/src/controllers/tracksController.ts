import { Request, Response } from 'express';
import axios from 'axios';

export const getUserSavedTracks = async (req: Request, res: Response) => {
    try {
      const payload = {
        spotifyToken: req.query.spotifyToken,
      };
      const response = await axios.get(
        'https://api.spotify.com/v1/me/tracks',
        {
          headers: {
            Authorization: `Bearer ${payload.spotifyToken}`,
          },
        }
      );
      res.status(200).send(response.data);
    } catch (err) {
      console.error('Error fetching user saved tracks:', err);
      res.status(500).send('Error fetching user saved tracks');
    }
  };