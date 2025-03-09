import { Request, Response } from 'express';
import axios from 'axios';

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
      track.valence < 0.3 && 
      track.acousticness > 0.5 &&
      track.tempo < 100 &&
      track.valence < 0.3 &&
      track.energy < 0.4 &&
      track.loudness < -10
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
  //handling vibes with no matching conditions
  {
    vibeName: "Unknown Vibe",
    conditions: (track: TrackFeatures) => false // This will never be true 
  }
];


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

  //write getting audio features of saved tracks
  export const getTrackFeatures = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      // Extract spotifyToken from the Authorization header
      const spotifyToken = req.headers.authorization;
      const trackId = req.params.trackId;
  
      // Make request to Spotify API to get audio features of tracks
      const response = await axios.get(
        `https://api.spotify.com/v1/audio-features/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
          },
        }
      );

      // Send the data from Spotify API as the response
      res.status(200).send(response.data);
    } catch (err) {
      console.error('Error fetching track features:', err);
      res.status(500).send('Error fetching track features');
    }
  };

  //Move to a different folder, trying to avoid rate limit this way
  //what if a track is not being able to be categorized?
  //TODO: Function to categorize a track
  export const categorizeTrack = (track: TrackFeatures) => {
    for (const vibe of vibes) {
      if (vibe.conditions(track)) {
        return vibe.vibeName;
      }
    }
  }

  //TODO: Function to determine user vibes
  export const determineUserVibes = (tracks: TrackFeatures[]) => {
    // Initialize a map to count the occurrences of each vibe
    const vibeCounts: Record<string, number> = {};

    // Iterate over each track and categorize it
    tracks.forEach((track) => {
      const vibe = categorizeTrack(track);
      if (vibe) {
        vibeCounts[vibe] = (vibeCounts[vibe] || 0) + 1;
      }
    });

    // Find the vibe with the highest count
    let userVibe = null;
    let maxCount = 0;

    for (const [vibe, count] of Object.entries(vibeCounts)) {
      if (count > maxCount) {
        maxCount = count;
        userVibe = vibe;
      }
    }

    return userVibe;
  }

  //TODO: Function to analyze and store user vibes
export const analyzeAndStoreUserVibes = async (req: Request, res: Response) => {
  try {
    const spotifyToken = req.headers.authorization;
    const userId = req.params.userId;

    // Fetch user's saved tracks
    const tracksResponse = await axios.get(
      'https://api.spotify.com/v1/me/tracks',
      {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      }
    );

    const tracks = tracksResponse.data.items.map((item: any) => item.track);

    // Fetch audio features for each track
    const trackFeaturesPromises = tracks.map((track: any) =>
      axios.get(`https://api.spotify.com/v1/audio-features/${track.id}`, {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      })
    );

    const trackFeaturesResponses = await Promise.all(trackFeaturesPromises);
    const trackFeatures = trackFeaturesResponses.map((response) => response.data);

    // Determine user's vibe
    const userVibe = determineUserVibes(trackFeatures);

    // Store the user's vibe in the database (pseudo-code)
    // await storeUserVibe(userId, userVibe);

    res.status(200).send({ userVibe });
  } catch (err) {
    console.error('Error analyzing and storing user vibes:', err);
    res.status(500).send('Error analyzing and storing user vibes');
  }
}


