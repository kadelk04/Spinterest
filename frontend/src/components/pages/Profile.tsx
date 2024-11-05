import { FunctionComponent, useState, useEffect } from 'react';
import { getRefreshedToken, logout } from '../data/SpotifyAuth';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Settings as SettingsIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
  Grid,
  IconButton,
} from '@mui/material';

interface SpotifyProfile {
  display_name: string;
  images: { url: string }[];
}

export const Profile: FunctionComponent = () => {
  const accessToken = window.localStorage.getItem('spotify_token');
  const refreshToken = window.localStorage.getItem('spotify_refresh_token');
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const navigate = useNavigate();

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
          console.log(data);
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: {xs: 'column', md: 'row'}, 
      }}
    >
      {/* Profile and Friends Column */}
      <Box sx={{ flex: { xs: '100%', md: 1 }}}>
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: '#ECE6F0',
            borderRadius: 2,
            p: 3,
            mb: {xs: 2, md: 4},
            width: {xs: '100%', md: '90%'}, 
          }}
        >
          {profile ? (
            <>
              <Avatar src={profile.images[0]?.url} sx={{ width: 224, height: 224, mb: 3 }} />
              <Typography variant="h5">{profile.display_name}</Typography>
              <Button
                sx={{ mt: 2 }}
                variant="contained"
                onClick={() => {
                logout();
                navigate('/login');
                }}
                >
                Logout
              </Button>
              <TextField id="blurb" label="current status" sx={{ maxWidth: '80%', mt: 2 }} />
            </>
          ) : (
            <>
              <Avatar src="/broken-image.jpg" sx={{ bgcolor: '#7C6BBB', width: 224, height: 224}} />
              <TextField id="profile-name" label="Profile Name" sx={{ maxWidth: '80%', mb: 2 }} />
            </>
          )}
        </Paper>

        {/* Friends Section */}
        <Paper
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            bgcolor: '#ECE6F0',
            borderRadius: 2,
            width: {xs: '100%', md: '90%'},
            height: 300, 
            p: 2,
          }}
        >
          <TextField
            id="search-friends"
            label="Friends"
            fullWidth
            sx={{ flex: 1 }}
            InputProps={{
              endAdornment: (
                <IconButton>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
          <IconButton>
            <SettingsIcon sx={{ ml: 1 }} />
          </IconButton>
        </Paper>
      </Box>

      {/* About, Favorites, and Pinned Music Column */}
      <Box sx={{ flex: { xs: '100%', md: 2 }, mt: { xs: 4, md: 0}}}>
        {/* About and Favorites Section */}
        <Paper
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            p: 3,
            gap: 2,
            mb: 4,
            bgcolor: '#ECE6F0',
          }}
        >
          {/* About Section */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              ABOUT
            </Typography>
            {/* Add content or fields for the About section here if needed */}
          </Box>

          {/* Favorites Section */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              FAVORITES
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth placeholder="Favorite Genre" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth placeholder="Favorite Artist" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth placeholder="Album #1" variant="outlined" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth placeholder="Favorite Genre" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth placeholder="Favorite Artist" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth placeholder="Album #2" variant="outlined" />
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Pinned Music Section */}
        <PinnedMusicSection />
      </Box>
    </Box>
  );
};

// Pinned Music Section Component
const PinnedMusicSection: FunctionComponent = () => (
  <Paper sx={{ p: 3, bgcolor: '#ECE6F0' }}>
    <Typography variant="h5" sx={{ mb: 2 }}>
      PINNED MUSIC
    </Typography>
    <TextField
      fullWidth
      placeholder="Pinned Music"
      variant="outlined"
      sx={{
        mb: 2,
        '& .MuiOutlinedInput-root': {
          bgcolor: '#F5EFF7',
          '&:hover fieldset': {
            borderColor: '#000000',
          },
        },
      }}
    />
    <Grid container spacing={2}>
      {[...Array(6)].map((_, i) => (
        <Grid item xs={4} key={i}>
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
