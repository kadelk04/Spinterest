import { FunctionComponent, useState, useEffect } from 'react';
import { getRefreshedToken } from '../data/SpotifyAuth';
import { 
  Paper,
  Box,
  TextField,
  Typography,
  Grid
} from '@mui/material';

interface SpotifyProfile {
  display_name: string;
  images: { url: string }[];
}

export const Profile: FunctionComponent = () => {
  const accessToken = window.localStorage.getItem('spotify_token');
  const refreshToken = window.localStorage.getItem('spotify_refresh_token');
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!accessToken && !refreshToken) return;

      try {
        let response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 401 && refreshToken) {
          await getRefreshedToken(refreshToken);
          response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem('spotify_token')}`,
            },
          });
        }

        const data = await response.json();
        if (data.error) {
          console.error(data.error.message);
          return;
        }

        const profileData: SpotifyProfile = {
          display_name: data.display_name,
          images: data.images || [],
        };
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile', error);
      }
    };

    fetchProfile();
  }, [accessToken, refreshToken]);

  return (
    <Box sx={{ 
      p: 3, 
      bgcolor: 'white', 
      minHeight: '100vh'
    }}>
      {/* Combined About and Favorites Section */}
      <Paper sx={{ p: 3, bgcolor: '#ECE6F0', mb: 2 }}>
        <Grid container spacing={2}>
          {/* About Section - Now on Left Column */}
          <Grid item xs={6}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              ABOUT
            </Typography>
            {/* This section remains empty as per request */}
          </Grid>

          {/* Favorites Section - Now on Right Column */}
          <Grid item xs={6}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              FAVORITES
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth placeholder="favorite genre" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth placeholder="fav artist" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth placeholder="album #1" variant="outlined" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth placeholder="favorite genre" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth placeholder="fav artist" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth placeholder="album #1" variant="outlined" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Pinned Music Section */}
      <PinnedMusicSection />
    </Box>
  );
};

// Pinned Music Section Component
const PinnedMusicSection: FunctionComponent = () => (
  <Paper sx={{ p: 3, bgcolor: '#ECE6F0' }}>
    <TextField
      fullWidth
      placeholder="Pinned Music"
      variant="outlined"
      sx={{
        mb: 2,
        '& .MuiOutlinedInput-root': {
          bgcolor: '#F5EFF7', // Adjust background color here
          '&:hover fieldset': {
            borderColor: '#000000', // Optional: Adjust border color on hover
          },
        },
      }}
    />
    <Grid container spacing={2}>
      {[...Array(8)].map((_, i) => (
        <Grid item xs={3} key={i}>
          <Paper
            sx={{
              paddingTop: '100%',
              position: 'relative',
              bgcolor: '#FEF7FF',
            }}
          />
        </Grid>
      ))}
    </Grid>
  </Paper>
);

export default Profile;
