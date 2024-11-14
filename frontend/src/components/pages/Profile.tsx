import { FunctionComponent, useState, useEffect } from 'react';
import { getRefreshedToken, logout } from '../data/SpotifyAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Search as SearchIcon, 
  Settings as SettingsIcon, 
  Edit as EditIcon,
  Close as CloseIcon,
  LocationOn as LocationOnIcon,
  AccountCircle as AccountCircleIcon,
  MusicNote as MusicNoteIcon,
  SaveAlt as SaveAltIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
  Grid,
  IconButton,
  Icon,
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

              {/* Editable status blurb */}
              <EditableBlurb/>
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
          <EditableAbout/>
        </Paper>

        {/* Pinned Music Section */}
        <PinnedMusicSection />
      </Box>
    </Box>
  );
};

//Editable Status Field
//making this more universal function to edit other textfields 
//set a character to limit
// TODO: connect back to the backend for user profile 
const EditableBlurb: FunctionComponent = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [text, setText] = useState("status");
  const [clicked, setClicked] = useState(false);

  const handleIconClick = () => {
    setIsEditable((prev) => !prev); // Toggle the editable state
    setClicked((prev) => !prev); //Swiches the Icons
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  return (
  <TextField id="blurb" label="status" 
      sx={{ maxWidth: '80%', mt: 2 }}
      value={text}
      onChange={handleTextChange} 
      InputProps={{
        readOnly: !isEditable,
        endAdornment: (
          <IconButton onClick={handleIconClick}>
            {clicked ? <SaveAltIcon /> : <EditIcon />}
          </IconButton>
        ),
      }}
    />
  );
};

const EditableAbout: FunctionComponent = () => {
  const [isEditable, setIsEditable] = useState(false);

  const handleIconClick = () => {
    setIsEditable((prev) => !prev); // Toggle the editable state
  };


  return (
    <Box sx={{ p: 4 }}>
      {/* About Section */}
      <Box sx={{ flex: 1, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">ABOUT</Typography>
          <IconButton onClick={handleIconClick}>
            {isEditable ? <SaveAltIcon /> : <EditIcon />}
          </IconButton>
        </Box>

        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              id="location"
              label="Location"
              disabled={!isEditable}
              InputProps={{
                startAdornment: (
                  <Icon>
                    <LocationOnIcon />
                  </Icon>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              id="links"
              label="Links"
              disabled={!isEditable}
              InputProps={{
                startAdornment: (
                  <Icon>
                    <MusicNoteIcon />
                  </Icon>
                )
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="biography"
              label="User Bio"
              multiline
              fullWidth
              maxRows={3}
              disabled={!isEditable}
              InputProps={{
                startAdornment: (
                  <Icon>
                    <AccountCircleIcon />
                  </Icon>
                )
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Favorites Section */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          FAVORITES
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              placeholder="Favorite Genre"
              variant="outlined"
              sx={{ mb: 2 }}
              disabled={!isEditable}
            />
            <TextField
              fullWidth
              placeholder="Favorite Artist"
              variant="outlined"
              sx={{ mb: 2 }}
              disabled={!isEditable}
            />
            <TextField
              fullWidth
              placeholder="Album #1"
              variant="outlined"
              disabled={!isEditable}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              placeholder="Favorite Genre"
              variant="outlined"
              sx={{ mb: 2 }}
              disabled={!isEditable}
            />
            <TextField
              fullWidth
              placeholder="Favorite Artist"
              variant="outlined"
              sx={{ mb: 2 }}
              disabled={!isEditable}
            />
            <TextField
              fullWidth
              placeholder="Album #2"
              variant="outlined"
              disabled={!isEditable}
            />
          </Grid>
        </Grid>
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
