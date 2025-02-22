import React from 'react';
import { useEffect, useState } from 'react';
import { Box, TextField, Typography, Paper, Grid } from '@mui/material';
import { WidgetData } from '../../data/playlistUtils';

interface PinnedMusicComponentProps {
  username: string;
  isOwnProfile: boolean;
}

const PinnedMusicComponent: React.FC<PinnedMusicComponentProps> = ({
  username,
  isOwnProfile,
}) => {
  const [pinnedPlaylists, setPinnedPlaylists] = useState<WidgetData[]>([]);

  useEffect(() => {
    if (!username) {
      console.error('No username provided');
      return;
    }
    fetchPlaylistsData(username);
  }, [username]);

  const fetchPlaylistsData = async (username: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/profile/getPinnedPlaylists/${username}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem('jwttoken')}`,
          },
        }
      );
  
      const { pinnedPlaylists } = await response.json();
  
      const playlists = await Promise.all(
        pinnedPlaylists.map(async (playlistId: string) => {
          try {
            const playlistResponse = await fetch(
              `http://localhost:8000/api/playlists/${playlistId}`,
              {
                headers: {
                  authorization: `Bearer ${localStorage.getItem('jwttoken')}`,
                },
              }
            );
  
            if (!playlistResponse.ok) {
              return null;
            }
  
            const playlistData = await playlistResponse.json();
            
            // Skip removed or deleted playlists
            if (playlistData.isDeleted || playlistData.removedFromProfile) {
              return null;
            }
  
            return {
              id: playlistId,
              title: playlistData.title,
              cover: playlistData.cover,
              owner: playlistData.owner
            };
          } catch (error) {
            console.error(`Error fetching playlist ${playlistId}:`, error);
            return null;
          }
        })
      );
  
      setPinnedPlaylists(playlists.filter((playlist): playlist is WidgetData => playlist !== null));
    } catch (error) {
      console.error('Failed to fetch playlists:', error);
    }
  };

  return (
    <Paper sx={{ p: 3, bgcolor: '#ECE6F0' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        PINNED MUSIC
      </Typography>
      <Grid container spacing={2}>
        {pinnedPlaylists.length > 0 ? (
          pinnedPlaylists.map((playlist, i) => (
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
    </Paper>
  );
};

export default PinnedMusicComponent;