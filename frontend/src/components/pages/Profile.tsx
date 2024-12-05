import { FunctionComponent, useState, useEffect } from 'react';
import {
  getRefreshedToken,
  logout,
  SpotifyLoginButton,
} from '../data/SpotifyAuth';
import { useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
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
import axios from 'axios';

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
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      {/* Profile and Friends Column */}
      <Box sx={{ flex: { xs: '100%', md: 1 } }}>
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: '#ECE6F0',
            borderRadius: 2,
            p: 3,
            mb: { xs: 2, md: 4 },
            width: { xs: '100%', md: '90%' },
          }}
        >
          {profile ? (
            <>
              <Avatar
                src={profile.images[0]?.url}
                sx={{ width: 224, height: 224, mb: 3 }}
              />
              <Typography variant="h5">{profile.display_name}</Typography>

              {/* Editable status blurb */}
              <EditableBlurb />

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
            </>
          ) : (
            <>
              <Avatar
                src="/broken-image.jpg"
                sx={{ bgcolor: '#7C6BBB', width: 224, height: 224 }}
              />
              <TextField
                id="profile-name"
                label="Profile Name"
                sx={{ maxWidth: '80%', mb: 2 }}
              />
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
            width: { xs: '100%', md: '90%' },
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
      <Box sx={{ flex: { xs: '100%', md: 2 }, mt: { xs: 4, md: 0 } }}>
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
          <EditableAbout />
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
  const [text, setText] = useState('status');
  const [clicked, setClicked] = useState(false);

  interface ProfileStatusResponse {
    status: string;
  }

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get<ProfileStatusResponse>(
          '/api/getProfileStatus'
        );
        const data = response.data;
        setText(data.status);
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    fetchStatus();
  }, []);

  const handleIconClick = async () => {
    if (isEditable) {
      // Log the value when savinag
      console.log('Status:', text);
    }

    const updatedStatus = text;

    //updating the Status field
    try {
      await axios.post('/api/logProfileInput', updatedStatus);
      alert('Status saved!');
    } catch (error) {
      console.error('Error: Status not saved', error);
    }

    setIsEditable((prev) => !prev);
    setClicked((prev) => !prev);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  return (
    //'/api/logProfileInput'
    <TextField
      id="blurb"
      label="status"
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
  const [location, setLocation] = useState('');
  const [links, setLinks] = useState('');
  const [biography, setBiography] = useState('');
  const [favgen1, setText1] = useState('');
  const [favgen2, setText2] = useState('');
  const [fava1, setText3] = useState('');
  const [fava2, setText4] = useState('');
  const [favalb1, setText5] = useState('');
  const [favalb2, setText6] = useState('');

  const handleIconClick = async () => {
    if (isEditable) {
      // Log the values when saving
      console.log('Location:', location);
      console.log('Links:', links);
      console.log('Biography:', biography);
      console.log('Favourite Genre:', favgen1);
      console.log('Favourite Genre 2:', favgen2);
      console.log('Favourite Arist:', fava1);
      console.log('Favourite Artist 2:', fava2);
      console.log('Favourite Album:', favalb1);
      console.log('Favourite Album 2:', favalb2);
    }

    const updatedData = {
      location,
      links,
      biography,
      favgen1,
      favgen2,
      fava1,
      fava2,
      favalb1,
      favalb2,
    };

    try {
      await axios.post('/api/logProfileInput', updatedData);
      alert('About and Favorite saved!');
    } catch (error) {
      console.error('Error: About and Favorite not saved', error);
    }

    setIsEditable((prev) => !prev);
  };

  interface AbtFavResponse {
    location: string;
    links: string;
    biography: string;
    favgen1: string;
    favgen2: string;
    fava1: string;
    fava2: string;
    favalb1: string;
    favalb2: string;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your backend API endpoint to get the saved data
        const responseAbtFav = await axios.get<AbtFavResponse>(
          '/api/logProfileInput'
        );
        const dataFields = responseAbtFav.data;

        // Set the state with the fetched data
        setLocation(dataFields.location);
        setLinks(dataFields.links);
        setBiography(dataFields.biography);
        setText1(dataFields.favgen1);
        setText2(dataFields.favgen2);
        setText3(dataFields.fava1);
        setText4(dataFields.fava2);
        setText5(dataFields.favalb1);
        setText6(dataFields.favalb2);
      } catch (error) {
        console.error('Error fetching dataFields:', error);
      }
    };

    fetchData();
  }, []);

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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={!isEditable}
              InputProps={{
                startAdornment: (
                  <Icon>
                    <LocationOnIcon />
                  </Icon>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              id="links"
              label="Links"
              value={links}
              onChange={(e) => setLinks(e.target.value)}
              disabled={!isEditable}
              InputProps={{
                startAdornment: (
                  <Icon>
                    <MusicNoteIcon />
                  </Icon>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="biography"
              label="User Bio"
              multiline
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              fullWidth
              maxRows={3}
              disabled={!isEditable}
              InputProps={{
                startAdornment: (
                  <Icon>
                    <AccountCircleIcon />
                  </Icon>
                ),
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
              id="favgen1"
              fullWidth
              placeholder="Favorite Genre"
              variant="outlined"
              sx={{ mb: 2 }}
              onChange={(e) => setText1(e.target.value)}
              disabled={!isEditable}
            />
            <TextField
              id="fava1"
              fullWidth
              placeholder="Favorite Artist"
              variant="outlined"
              sx={{ mb: 2 }}
              onChange={(e) => setText3(e.target.value)}
              disabled={!isEditable}
            />
            <TextField
              id="favalb1"
              fullWidth
              placeholder="Album #1"
              variant="outlined"
              onChange={(e) => setText5(e.target.value)}
              disabled={!isEditable}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="favgen2"
              fullWidth
              placeholder="Favorite Genre"
              variant="outlined"
              sx={{ mb: 2 }}
              onChange={(e) => setText2(e.target.value)}
              disabled={!isEditable}
            />
            <TextField
              id="fava2"
              fullWidth
              placeholder="Favorite Artist"
              variant="outlined"
              sx={{ mb: 2 }}
              onChange={(e) => setText4(e.target.value)}
              disabled={!isEditable}
            />
            <TextField
              id="favalb2"
              fullWidth
              placeholder="Album #2"
              variant="outlined"
              onChange={(e) => setText6(e.target.value)}
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
