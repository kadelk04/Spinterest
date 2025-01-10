import { FunctionComponent, useState, useEffect } from 'react';
import {
  getAccessToken,
  getRefreshedToken,
  logout,
  SpotifyLoginButton,
} from '../data/SpotifyAuth';
import { useNavigate } from 'react-router-dom';
import { PushPin, PushPinOutlined } from '@mui/icons-material';
import { fetchPlaylists, WidgetData } from '../data/playlistUtils';
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
  ListItem,
  List,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import axios from 'axios';

interface SpotifyProfile {
  display_name: string;
  images: { url: string }[];
}

// Extend the existing interface
interface Friend {
  id: string;
  name: string;
  images?: { url: string }[];
}

export const Profile: FunctionComponent = () => {
  const accessToken = window.localStorage.getItem('spotify_token');
  const refreshToken = window.localStorage.getItem('spotify_refresh_token');
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(true);

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
        console.log('Profile Data Fetched:', profileData);
        setProfile(profileData);

        //   // Fetch friends
        //   const friendsResponse = await fetch(
        //     'https://api.spotify.com/v1/me/following?type=user',
        //     {
        //       headers: {
        //         Authorization: `Bearer ${window.localStorage.getItem('spotify_token')}`,
        //       },
        //     }
        //   );

        //   console.log('awaiting dfkj');
        //   const friendsData = await friendsResponse.json();
        //   console.log('sgdfhg');
        //   console.log(friendsData);
        //   if (friendsData.artists) {
        //     const formattedFriends = friendsData.artists.items.map(
        //       (artist: any) => ({
        //         id: artist.id,
        //         name: artist.name,
        //         images: artist.images,
        //       })
        //     );
        //     console.log('Friends Fetched:', fx===ormattedFriends);
        //     setFriends(formattedFriends);
        //   }

        //   setLoadingFriends(false);
      } catch (error) {
        console.error('Error fetching profile or friends', error);
        //setLoadingFriends(false);
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
            flexDirection: 'column',
            alignItems: 'flex-start',
            bgcolor: '#ECE6F0',
            borderRadius: 2,
            width: { xs: '100%', md: '90%' },
            height: 300,
            p: 2,
            overflowY: 'auto',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <TextField
              id="search-friends"
              label="Friends"
              fullWidth
              sx={{ flex: 1, mr: 1 }}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
            <IconButton>
              <SettingsIcon />
            </IconButton>
          </Box>

          {loadingFriends ? (
            <Typography>Loading friends...</Typography>
          ) : (
            <List
              sx={{
                width: '100%',
                maxHeight: 200,
                overflowY: 'auto',
              }}
            >
              {friends.map((friend) => (
                <ListItem key={friend.id} disablePadding>
                  <ListItemAvatar>
                    <Avatar
                      src={
                        friend.images && friend.images.length > 0
                          ? friend.images[0].url
                          : undefined
                      }
                      sx={{ width: 40, height: 40 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={friend.name}
                    primaryTypographyProps={{
                      variant: 'body2',
                      sx: { ml: 1 },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          )}
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

//Updates the Editable Blurb
const EditableBlurb: FunctionComponent = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [text, setText] = useState('status');
  const [clicked, setClicked] = useState(false);

  interface ProfileStatusResponse {
    status: string;
  }

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const username = localStorage.getItem('username');

      if (!username) {
        console.error('No username found');
        return;
      }

      const response = await axios.get<ProfileStatusResponse>(
        'http://localhost:8000/profile/logProfileInput',
        { params: { username } }
      );
      if (response.data?.status) {
        setText(response.data.status);
      } else {
        console.warn('Received unexpected data:', response.data);
        setText('');
      }
    } catch (error) {
      console.error('Error fetching status:', error);
      setText('');
    }
  };

  const handleIconClick = async () => {
    if (clicked) {
      // Save only when SaveAltIcon is active
      const updatedStatus = text;
      const username = localStorage.getItem('username');

      if (!username) {
        console.error('No username found');
        return;
      }

      try {
        const response = await axios.post(
          'http://localhost:8000/profile/logProfileInput',
          { status: updatedStatus, username }
        );

        if (response.status === 200) {
          console.log('Status saved!');
        } else {
          console.error('Error: Unexpected response from server', response);
        }
      } catch (error) {
        console.error('Error: Status not saved', error);
      }
    }

    setClicked(!clicked);
    setIsEditable(!clicked);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  return (
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

// Updates the fields in the About and Favorite section
const EditableAbout: FunctionComponent = () => {
  interface AbtFavResponse {
    location: string;
    links: string;
    biography: string;
    favorites: {
      genre: string[];
      artist: string[];
      album: string[];
    };
  }

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const username = localStorage.getItem('username');

      if (!username) {
        console.error('No username found');
        return;
      }

      const responseAbtFav = await axios.get<AbtFavResponse>(
        'http://localhost:8000/profile/logProfileInput',
        { params: { username } }
      );

      const dataFields = responseAbtFav.data;

      // Log the fetched data to verify
      console.log('Fetched Data:', dataFields);

      // Set the state with the fetched data
      setLocation(dataFields.location);
      setLinks(dataFields.links);
      setBiography(dataFields.biography);
      setText1(dataFields.favorites.genre[0] || '');
      setText2(dataFields.favorites.genre[1] || '');
      setText3(dataFields.favorites.artist[0] || '');
      setText4(dataFields.favorites.artist[1] || '');
      setText5(dataFields.favorites.album[0] || '');
      setText6(dataFields.favorites.album[1] || '');
    } catch (error) {
      console.error('Error fetching dataFields:', error);
    }
  };

  const handleIconClick = async () => {
    const updatedData = {
      location,
      links,
      biography,
      favgen1: favgen1 || '', // Fallback to empty string if undefined
      favgen2: favgen2 || '',
      fava1: fava1 || '',
      fava2: fava2 || '',
      favalb1: favalb1 || '',
      favalb2: favalb2 || '',
    };

    const username = localStorage.getItem('username');
    if (!username) {
      console.error('No username found');
      return;
    }

    if (isEditable) {
      console.log('Location:', location);
      console.log('Links:', links);
      console.log('Biography:', biography);
      console.log('Favorite Genre 1:', favgen1);
      console.log('Favorite Genre 2:', favgen2);
      console.log('Favorite Artist 1:', fava1);
      console.log('Favorite Artist 2:', fava2);
      console.log('Favorite Album 1:', favalb1);
      console.log('Favorite Album 2:', favalb2);
    }

    try {
      await axios.post('http://localhost:8000/profile/logProfileInput', {
        ...updatedData,
        username,
      });
    } catch (error) {
      console.error('Error: About and Favorite not saved', error);
    }

    setIsEditable((prev) => !prev);
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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              InputProps={{
                readOnly: !isEditable,
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
              id="spotify"
              label="Spotify"
              value={links}
              onChange={(e) => setLinks(e.target.value)}
              InputProps={{
                readOnly: !isEditable,
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
              InputProps={{
                readOnly: !isEditable,
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
              value={favgen1}
              onChange={(e) => setText1(e.target.value)}
              InputProps={{
                readOnly: !isEditable,
              }}
            />
            <TextField
              id="fava1"
              fullWidth
              placeholder="Favorite Artist"
              variant="outlined"
              sx={{ mb: 2 }}
              value={fava1}
              onChange={(e) => setText3(e.target.value)}
              InputProps={{
                readOnly: !isEditable,
              }}
            />
            <TextField
              id="favalb1"
              fullWidth
              placeholder="Album #1"
              variant="outlined"
              value={favalb1}
              onChange={(e) => setText5(e.target.value)}
              InputProps={{
                readOnly: !isEditable,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="favgen2"
              fullWidth
              placeholder="Favorite Genre"
              variant="outlined"
              sx={{ mb: 2 }}
              value={favgen2}
              onChange={(e) => setText2(e.target.value)}
              InputProps={{
                readOnly: !isEditable,
              }}
            />
            <TextField
              id="fava2"
              fullWidth
              placeholder="Favorite Artist"
              variant="outlined"
              sx={{ mb: 2 }}
              value={fava2}
              onChange={(e) => setText4(e.target.value)}
              InputProps={{
                readOnly: !isEditable,
              }}
            />
            <TextField
              id="favalb2"
              fullWidth
              placeholder="Album #2"
              variant="outlined"
              value={favalb2}
              onChange={(e) => setText6(e.target.value)}
              InputProps={{
                readOnly: !isEditable,
              }}
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
