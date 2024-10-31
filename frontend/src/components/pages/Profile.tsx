import { FunctionComponent, useState, useEffect } from 'react';
import { getRefreshedToken } from '../data/SpotifyAuth';
import { Search as SearchIcon,  Settings as SettingsIcon 
} from '@mui/icons-material';
import {
  Box,
  TextField,
  Typography,
  Paper,
  Avatar,
  Grid,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Form } from 'react-router-dom';

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
    <div>
      <h1>Profile</h1>
      {profile ? (
        <>
          <h1>{profile.display_name}</h1>
          {profile.images.length > 0 ? (
            <img src={profile.images[0].url} alt={profile.display_name} />
          ) : null}
        </>
      ) : (
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          height: 468,
          width: 340, 
          bgcolor: '#eae6ef', 
          borderRadius: 10,
          position: 'relative',
          alignItems: 'center',  
          justifyContent: 'center',
          left: '44px',
            }}>
          <Avatar src="/broken-image.jpg" 
            sx={{
              bgcolor: '#7C6BBB',
              width: 224, 
              height: 224,
              mb: 3,}}
          />
          <TextField
            id="profile-name"
            label="Profile Name"
            sx={{
              maxWidth: '80%',
              mb: 3,
            }}
            />
            <TextField
            id="blurb"
            label="Small Blurb"
            sx={{
              maxWidth: '80%',
            }}
            />
          </Box> 
      )} 

      {/*Friend Searching*/}
      <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-start', 
          alignItems: 'flex-start', 
          height: 468,
          width: 340, 
          bgcolor: '#eae6ef', 
          borderRadius: 10,
          position: 'relative',
          top: '20px',
          left: '44px',         
        }}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
          <TextField
            id="search-friends"
            label="Friends"
            sx={{
              top: '35px',
              left: '20px',
            }}
            InputProps={{
              endAdornment: (
                <IconButton>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
          <IconButton sx={{ top: '35px', ml: 3 }}>
            <SettingsIcon 
              />
          </IconButton>
          </Box>   
      </Box>

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
    </div>
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
