import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { genreCompilation, returnWidgets, Widget } from '../data/playlistUtils';
import axios from 'axios';
import { redirect } from 'react-router-dom';

interface PlaylistContextType {
  playlists: Widget[];
  isLoading: boolean;
  error: string | null;
}

export interface SpotifyPlaylistResponse {
  id: string;
  images: { url: string }[];
  name: string;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(
  undefined
);

export const usePlaylists = (): PlaylistContextType => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylists must be used within a PlaylistProvider');
  }
  return context;
};

export const PlaylistProvider = ({ children }: { children: ReactNode }) => {
  const [playlists, setPlaylists] = useState<Widget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const accessToken = localStorage.getItem('spotify_token');
      if (!accessToken) {
        setIsLoading(false);
        setError('No Spotify token found');
        return;
      }

      try {
        const selfSpotifyDataResponse = await fetch(
          `https://api.spotify.com/v1/me`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const selfSpotifyData = await selfSpotifyDataResponse.json();
        const profileSpotifyId = selfSpotifyData.id;
        const selfDataResponse = await fetch(
          `http://localhost:8000/api/user/spotify/${profileSpotifyId}?username=${localStorage.getItem(
            'username'
          )}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const myProfileData = await selfDataResponse.json();
        const myMongoId = myProfileData._id;
        if (myMongoId === undefined) {
          redirect('/login');
        }
        const spotifyPlaylists = await fetch(
          `${process.env.REACT_APP_API_URL}/api/spotify/playlists`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const spotifyPlaylistsData = await spotifyPlaylists.json();
        spotifyPlaylistsData.items.map(
          async (playlist: SpotifyPlaylistResponse) => {
            const genres = await genreCompilation(playlist);
            axios.put(`${process.env.REACT_APP_API_URL}/api/playlist`, {
              spotifyId: playlist.id,
              cover: playlist.images[0].url,
              creator: myMongoId,
              title: playlist.name,
              genres: genres,
            });
          }
        );
        const widgets = await returnWidgets();
        setPlaylists(widgets);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        setError('Error fetching playlists');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPlaylists();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const checkAuthentication = () => {
      const accessToken = localStorage.getItem('spotify_token');
      if (accessToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  return (
    <PlaylistContext.Provider value={{ playlists, isLoading, error }}>
      {children}
    </PlaylistContext.Provider>
  );
};
