import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { WidgetData } from '../../data/playlistUtils';

interface PinnedMusicComponentProps {
  username: string;
  isOwnProfile: boolean;
}

function isAxiosError(error: any): error is {
  isAxiosError: boolean;
  response?: {
    status: number;
    data: any;
  };
} {
  return error && typeof error === 'object' && 'isAxiosError' in error;
}

const PinnedMusicComponent: React.FC<PinnedMusicComponentProps> = ({
  username,
}) => {
  const [pinnedPlaylists, setPinnedPlaylists] = useState<WidgetData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      console.error('No username provided');
      setLoading(false);
      return;
    }
    
    loadPinnedPlaylists();
  }, [username]);

  const loadPinnedPlaylists = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const accessToken = localStorage.getItem('spotify_token');
      const jwtToken = localStorage.getItem('jwttoken');
      
      if (!accessToken || !jwtToken) {
        throw new Error('Authentication tokens missing');
      }
      
      // Step 1: Clean up any unavailable playlists
      await axios.post(
        `http://localhost:8000/api/profile/cleanup-playlists/${username}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'x-auth-token': jwtToken
          }
        }
      );
      
      // Step 2: Get the remaining (valid) pinned playlists
      interface PinnedPlaylistsResponse {
        pinnedPlaylists: string[];
        message: string;
      }
      
      const response = await axios.get<PinnedPlaylistsResponse>(
        `http://localhost:8000/api/profile/getPinnedPlaylists/${username}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`
          }
        }
      );
      
      const pinnedIds = response.data.pinnedPlaylists || [];
      
      if (pinnedIds.length === 0) {
        setPinnedPlaylists([]);
        setLoading(false);
        // No error message for empty playlists - it's a valid state
        return;
      }
      
      // Step 3: Fetch playlist details from Spotify
      interface SpotifyPlaylistDetails {
        id: string;
        name: string;
        images: Array<{ url: string }>;
        owner: {
          display_name: string;
        };
      }
      
      const playlistPromises = pinnedIds.map(async (playlistId: string) => {
        try {
          const playlistResponse = await axios.get<SpotifyPlaylistDetails>(
            `https://api.spotify.com/v1/playlists/${playlistId}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` }
            }
          );
          
          const playlistData = playlistResponse.data;
          
          return {
            id: playlistId,
            title: playlistData.name,
            cover: playlistData.images[0]?.url || '/default-playlist-cover.jpg',
            owner: playlistData.owner?.display_name || 'Unknown',
            creator_name: playlistData.owner?.display_name || 'Unknown'
          };
        } catch (error) {
          console.error(`Error fetching playlist ${playlistId}:`, error);
          return null;
        }
      });
      
      const loadedPlaylists = await Promise.all(playlistPromises);
      
      // Filter out null results (failed fetches)
      const validPlaylists = loadedPlaylists.filter(
        (playlist): playlist is WidgetData => playlist !== null
      );
      
      setPinnedPlaylists(validPlaylists);
    } catch (err) {
      const error = err as Error;
      console.error('Failed to load pinned playlists:', error);
      
      
      
     // Check if this is a 404 error from the API (no playlists found)
     if (isAxiosError(err) && err.response?.status === 404) {
      // Empty playlists is a valid state, not an error
      setPinnedPlaylists([]);
      setLoading(false);
      return;
    }

      // Only set error for actual errors, not for "no playlists" response
      setError('Failed to load pinned music');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, bgcolor: '#ECE6F0' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        PINNED MUSIC
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ textAlign: 'center' }}>
          {error}
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {pinnedPlaylists.length > 0 ? (
            pinnedPlaylists.map((playlist) => (
              <Grid item xs={4} key={playlist.id}>
                <Box
                  sx={{
                    position: 'relative',
                    paddingTop: '100%',
                    bgcolor: '#FEF7FF',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url(${playlist.cover})`,
                    border: '1px solid #ddd',
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      bgcolor: 'rgba(0,0,0,0.6)',
                      color: '#fff',
                      textAlign: 'center',
                      padding: '4px',
                      fontSize: '12px',
                    }}
                  >
                    {playlist.title}
                  </Typography>
                </Box>
              </Grid>
            ))
          ) : (
            <Typography
              variant="body2"
              sx={{ mt: 2, textAlign: 'center', width: '100%' }}
            >
              No pinned playlists available.
            </Typography>
          )}
        </Grid>
      )}
    </Paper>
  );
};

export default PinnedMusicComponent;