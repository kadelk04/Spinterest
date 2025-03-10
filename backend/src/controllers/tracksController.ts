import { Request, Response } from 'express';
import axios from 'axios';
import { getModel } from '../utils/connection';
import { IUser } from '../models/User';

// TODO: implement a way to determine user vibes, 
// implement caching to prevent 

//should probably move to a different category
//Your Vibe Character
/* 
  1. Energetic Energy -> upbeat, hype
  2. Straight Chilling -> chill, less upbeat
  3. Woe is Me -> sad, lana del rey type vibe
  4. Noise Enjoyer -> loud, noise music
  4. Feel-Good -> medium tempo, sunny day type
*/

interface SavedTracksResponse {
  items: Array<{ track: { id: string } }>;
}

//presetting vibes with TrackFeatures 
interface TrackFeatures {
  energy: number;
  valence: number;
  tempo: number;
  loudness: number;
  danceability: number;
  acousticness: number;
  instrumentalness: number;
}

const vibes = [
  { 
    vibeName: "Energetic Energy",
    conditions: (track: TrackFeatures) =>  
      track.energy > 0.7 && 
      track.tempo > 130 && 
      track.danceability > 0.6 &&
      track.valence > 0.6 &&
      track.loudness > -6
  },
  { 
    vibeName: "Straight Chilling",
    conditions: (track: TrackFeatures) =>  
      (track.energy > 0.3 && track.energy < 0.7) && 
      (track.valence > 0.3 && track.valence < 0.7) &&
      (track.tempo > 80 && track.tempo < 120) &&
      (track.loudness > -12 && track.loudness < -6) &&
      (track.danceability > 0.4 && track.danceability < 0.7)
  },
  {
    vibeName: "Woe is Me",
    conditions: (track: TrackFeatures) =>  
      track.valence < 0.2 &&  
      track.acousticness > 0.7 && 
      track.tempo < 80 && 
      track.energy < 0.3 && 
      track.loudness < -15 
  },  
  { 
    vibeName: "Noise Enjoyer",
    conditions: (track: TrackFeatures) =>  
      track.loudness > -5 && 
      track.instrumentalness > 0.5 &&
      track.energy > 0.8
  },
  { 
    vibeName: "Feel-Good",
    conditions: (track: TrackFeatures) =>  
      (track.energy > 0.5 && track.energy < 0.8) &&
      (track.tempo > 100 && track.tempo < 130) &&
      (track.loudness > 100 && track.loudness < 130) &&
      track.valence > 0.6 && 
      track.danceability > 0.5
  },
];


export const getUserSavedTracks = async (spotifyToken: string) => {
    try {
      const response = await axios.get(
        'https://api.spotify.com/v1/me/tracks',
        {
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error('Error fetching user saved tracks:', err);
      throw new Error('Error fetching user saved tracks');}
  };

  //write getting audio features of saved tracks
  export const fetchTrackFeatures = async (spotifyToken: string, trackId: string) => {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/audio-features/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error(`Error fetching track features for track ${trackId}:`, err);
      return null;
    }
  };
  
  // Modify getTrackFeatures to use fetchTrackFeatures
  export const getTrackFeatures = async (req: Request, res: Response): Promise<void> => {
    try {
      const spotifyToken = req.headers.authorization;
      if (!spotifyToken) {
        res.status(400).send('Spotify token is missing');
        return;
      }
  
      const trackId = req.params.trackId;
      const trackFeatures = await fetchTrackFeatures(spotifyToken, trackId);
  
      if (!trackFeatures) {
        res.status(500).send('Error fetching track features');
        return;
      }
  
      res.status(200).send(trackFeatures);
    } catch (err) {
      console.error('Error fetching track features:', err);
      res.status(500).send('Error fetching track features');
    }
  };
  

  //Move to a different folder, trying to avoid rate limit this way
  //what if a track is not being able to be categorized?
  //Function to categorize a track
  export const categorizeTrack = (track: TrackFeatures) => {
    for (const vibe of vibes) {
      if (vibe.conditions(track)) {
        return vibe.vibeName;
      }
    }
    return "A song that defies categorization";
  }

  //Function to determine user vibes
  export const determineUserVibes = (tracks: TrackFeatures[]) => {
    const vibeCounts: Record<string, number> = {};
    const totalTracks = tracks.length;

    if (tracks.length === 0) {
      return ["No Songs, No Vibes detected :("];
    }
  
    if (tracks.length === 1) {
      return ["Your vibe is just this song...interesting."];
    }
  
    // Categorize each track and count occurrences
    tracks.forEach((track) => {
      const vibe = categorizeTrack(track);
      if (vibe) {
        vibeCounts[vibe] = (vibeCounts[vibe] || 0) + 1;
      }
    });
  
    // Find the vibe(s) that meet the 30% threshold
    const threshold = totalTracks * 0.3;
    const qualifyingVibes = Object.entries(vibeCounts)
      .filter(([_, count]) => count >= threshold) // Keep vibes that meet the threshold
      .map(([vibe]) => vibe); // Extract vibe names
  
    return qualifyingVibes.length > 0 ? qualifyingVibes : ["Vibes are a melting pot of genres"];
  };
  

  //Function to analyze and store user vibes
  export const analyzeAndStoreUserVibes = async (req: Request, res: Response) => {
    try {
      const username = req.query.username as string;
      const spotifyToken = req.headers.authorization;
      if (!spotifyToken) {
        res.status(400).send('Spotify token is missing');
        return;
      }
  
      // Fetch user's saved tracks
      const savedTracksResponse = await getUserSavedTracks(spotifyToken) as SavedTracksResponse; // Type assertion
      if (!savedTracksResponse || !savedTracksResponse.items) {
        res.status(500).send('Error fetching user saved tracks');
        return;
      }
  
      const tracks = savedTracksResponse.items.map((item: any) => item.track);
  
      // Fetch audio features using fetchTrackFeatures
      const trackFeaturesPromises = tracks.map((track: any) =>
        fetchTrackFeatures(spotifyToken, track.id)
      );
  
      const trackFeatures = (await Promise.all(trackFeaturesPromises)).filter(Boolean) as TrackFeatures[];
  
      if (trackFeatures.length === 0) {
        res.status(500).send('Error fetching audio features for tracks');
        return;
      }
  
      // Determine user's vibe
      const userVibe = determineUserVibes(trackFeatures);
  
      // Store the user's vibe in the database
      const UserM = getModel<IUser>('User');
      const user = await UserM.findOne({ username }).populate('favoritesId');
    
      if (!user) {
        res.status(404).send('User not found');
        return;
      }

      user.vibes = userVibe;
      await user.save();
      res.status(200).send({ userVibe });
    } catch (err) {
      console.error('Error analyzing and storing user vibes:', err);
      res.status(500).send('Error analyzing and storing user vibes');
    }
  };

  //Fetch User Vibes from User Model
export const fetchUserVibes = async (req: Request, res: Response): Promise<void> => {
  try {
    const username = req.query.username as string;
    
      const UserM = getModel<IUser>('User');
      const user = await UserM.findOne({ username });
  
      if (!user) {
        res.status(404).send('User not found');
        return;
      }

    res.status(200).json({ vibes: user.vibes });
  } catch (error) {
    console.error('Error fetching user vibes:', error);
    res.status(500).json({ message: 'Error fetching user vibes' });
  }
};
  
  


