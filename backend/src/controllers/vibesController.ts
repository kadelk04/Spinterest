import { Request, Response } from 'express';
import { getModel } from '../utils/connection';
import { IUser } from '../models/User';
import axios from 'axios';

const genreToVibeMap: Record<string, string> = {
    "pop": "Feel-Good",
    "dance": "Energetic Energy",
    "electronic": "Energetic Energy",
    "hip hop": "Straight Chilling",
    "lo-fi": "Straight Chilling",
    "classical": "Woe is Me",
    "jazz": "Straight Chilling",
    "metal": "Noise Enjoyer",
    "punk": "Noise Enjoyer",
    "indie": "Feel-Good",
    "ambient": "Woe is Me",
    "blues": "Woe is Me",
    "rock": "Energetic Energy",
    "alternative": "Feel-Good"
  };
  
  //Function to determine user vibes
  export const determineUserVibes = (genres: string[]): string[] => {
    const vibeCounts: Record<string, number> = {};
    const totalGenres = genres.length;
  
    if (totalGenres === 0) {
      return ["No Songs, No Vibes detected :("];
    }
  
    if (totalGenres === 1) {
      return ["Your vibe is just this genre...interesting."];
    }
  
    genres.forEach((genre) => {
        const normalizedGenre = genre.toLowerCase();
        const vibe = genreToVibeMap[normalizedGenre];
        
        if (vibe) {
          vibeCounts[vibe] = (vibeCounts[vibe] || 0) + 1;
        }
    });
      
  
    const threshold = totalGenres * 0.15;
    const qualifyingVibes = Object.entries(vibeCounts)
      .filter(([_, count]) => count >= threshold)
      .map(([vibe]) => vibe);
  
    if (qualifyingVibes.length === 0) {
      const sortedVibes = Object.entries(vibeCounts).sort((a, b) => b[1] - a[1]);
      return sortedVibes.slice(0, 2).map(([vibe]) => vibe);
    }
  
    return qualifyingVibes;
  };
  
  

  export const analyzeAndStoreUserVibes = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("Starting analyzeAndStoreUserVibes for username:", req.params.username);
      const username = req.params.username as string;
      const spotifyToken = req.headers.authorization?.split(' ')[1];
  
      if (!spotifyToken) {
        res.status(400).send('Spotify token is missing');
        return;
      }
  
      console.log("Fetching user saved tracks...");
      const savedTracksResponse = await axios.get(
        'https://api.spotify.com/v1/me/tracks?limit=50&offset=0',
        { headers: { Authorization: `Bearer ${spotifyToken}` } }
      );
  
      const savedTracks = savedTracksResponse.data.items;
      if (!savedTracks || savedTracks.length === 0) {
        res.status(500).send('No saved tracks found');
        return;
      }
  
      console.log(`Successfully fetched ${savedTracks.length} tracks`);
  
      console.log("Fetching album genres...");
    const albumGenrePromises = savedTracks.map(async (item: any) => {
    try {
        const albumResponse = await axios.get(
        `https://api.spotify.com/v1/albums/${item.track.album.id}`,
        { headers: { Authorization: `Bearer ${spotifyToken}` } }
        );

        let genres = albumResponse.data.genres; 

        if (!genres || genres.length === 0) {
        const artistId = item.track.artists[0].id; 
        const artistResponse = await axios.get(
            `https://api.spotify.com/v1/artists/${artistId}`,
            { headers: { Authorization: `Bearer ${spotifyToken}` } }
        );
        genres = artistResponse.data.genres;
        }

        return genres; 
    } catch (err) {
        console.error(`Error fetching genres for album ${item.track.album.id}:`);
        return [];
    }
    });

    const albumGenres = (await Promise.all(albumGenrePromises)).flat();
    console.log(`Fetched genres for ${albumGenres.length} albums`);

  
      console.log("Determining user vibes...");
      const userVibe = determineUserVibes(albumGenres);
      console.log("User vibes determined:", userVibe);
  
      console.log("Storing vibes in database...");
      const UserM = getModel<IUser>('User');
      const user = await UserM.findOne({ username }).populate('favoritesId');
  
      if (!user) {
        console.log(`User ${username} not found in database`);
        res.status(404).send('User not found');
        return;
      }
  
      user.vibes = userVibe;
      await user.save();
      console.log("Vibes successfully stored in database");
  
      res.status(200).send({ userVibe });
    } catch (err: any) {
      console.error('Error analyzing and storing user vibes:', err.message, err.stack);
      res.status(500).send('Error analyzing and storing user vibes');
    }
  };
  

   //Fetch User Vibes from User Model
 export const fetchUserVibes = async (req: Request, res: Response): Promise<void> => {
  try {
    const username = req.params.username as string;
    
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