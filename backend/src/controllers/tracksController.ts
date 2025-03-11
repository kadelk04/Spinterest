import { Request, Response } from 'express';
import axios from 'axios';

export interface Track {
  id: string;
}

export const getUserSavedTracks = async (req: Request, res: Response) => {
    try {
      const payload = {
        spotifyToken: req.query.spotifyToken,
      };
      const response = await axios.get(
        'https://api.spotify.com/v1/me/tracks?limit=50&offset=0',
        {
          headers: {
            Authorization: `Bearer ${payload.spotifyToken}`,
          },
        }
      );
      res.status(200).send(response.data);
    } catch (err) {
      console.error('Error fetching user saved tracks:', err);
      throw new Error('Error fetching user saved tracks');}
  };

  export const getTrackFeatures = async (req: Request, res: Response): Promise<void> => {
    try {
      const spotifyToken = req.headers.authorization;
      const trackId =  req.params.trackId;

      const response = await axios.get(
        `https://api.spotify.com/v1/audio-features/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
          },
        }
      );
  
      res.status(200).send(response);
    } catch (err) {
      console.error('Error fetching track features:', err);
      res.status(500).send('Error fetching track features');
    }
  };

