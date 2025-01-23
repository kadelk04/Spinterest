import { FunctionComponent, useState, useEffect } from 'react';
import axios from 'axios';
import { getRefreshedToken, logout } from '../data/SpotifyAuth';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import FriendsComponent from './ProfileComponents/FriendsComponent';
import AboutComponent from './ProfileComponents/AboutComponent';
import PinnedMusicComponent from './ProfileComponents/PinnedMusicComponent';

interface SpotifyProfile {
  display_name: string;
  images: { url: string }[];
}

interface User {
  _id: string;
  username: string;
  isPrivate: boolean;
  status: string;
  bio: string;
  location: string;
  links: string;
  favorites: {
    genre: string[];
    artist: string[];
    album: string[];
  };
  following: string[];
  followers: string[];
}

export interface Friend {
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
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [following, setFollowing] = useState<boolean>(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [currentUser] = useState<string>(
    localStorage.getItem('username') || ''
  );
  const [profileUsername, setProfileUsername] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const username = window.location.pathname.split('/').pop() || '';
    setProfileUsername(username);
    fetchProfile(); // Fetch profile when username changes
  }, [window.location.pathname]); // Remove separate useEffect for fetchProfile

  const fetchProfile = async () => {
    if (!accessToken && !refreshToken) return;

    try {
      const username = window.location.pathname.split('/').pop();
      let response = await fetch(`http://localhost:8000/api/user/${username}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to get user data');
      }

      const fullprofileResponse = await fetch(
        `http://localhost:8000/api/user/profile/${username}`
      );
      if (!fullprofileResponse.ok) {
        throw new Error('Failed to get full profile data');
      }
      const fullProfileData = await fullprofileResponse.json();

      const userData = await response.json();
      console.log('User Data:', userData);
      console.log('Profile Response:', fullProfileData);
      setUserData(fullProfileData);
      const userSpotifyId = userData.spotifyId;

      let profileResponse = await fetch(`https://api.spotify.com/v1/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (profileResponse.status === 401 && refreshToken) {
        await getRefreshedToken(refreshToken);
        profileResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem('spotify_token')}`,
          },
        });
      }
      const profileData = await profileResponse.json();
      const profileSpotifyId = profileData.id;

      if (profileSpotifyId === userSpotifyId) {
        setIsOwnProfile(true);
        setProfile({
          display_name: profileData.display_name,
          images: profileData.images || [],
        });
      } else {
        setIsOwnProfile(false);
        const otherProfileResponse = await fetch(
          `https://api.spotify.com/v1/users/${userSpotifyId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const myProfileResponse = await fetch(
          `http://localhost:8000/api/user/spotify/${profileSpotifyId}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const otherProfileData = await otherProfileResponse.json();
        const myProfileData = await myProfileResponse.json();
        const myMongoId = myProfileData._id;
        setFollowing(myProfileData.following.includes(myMongoId));

        setProfile({
          display_name: otherProfileData.display_name,
          images: otherProfileData.images || [],
        });
      }
    } catch (error) {
      console.error('Error fetching profile', error);
      setLoadingFriends(false);
    }
  };

  const toggleProfileVisibility = async () => {
    if (!accessToken && !refreshToken) return;
    try {
      const username = window.location.pathname.split('/').pop();
      const updatedUserData = {
        isPrivate: !userData?.isPrivate,
      };

      const response = await axios.put(
        `http://localhost:8000/api/user/${username}`,
        updatedUserData
      );

      if (response.status === 200) {
        setUserData((prev) =>
          prev ? { ...prev, isPrivate: !prev.isPrivate } : null
        );
      }
    } catch (error) {
      console.error('Error toggling profile visibility:', error);
    }
  };

  const handleFollowToggle = async () => {
    if (!accessToken && !refreshToken) return;
    const username = window.location.pathname.split('/').pop();

    if (following) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/api/user/${username}/unfollow`,
          {
            headers: {
              authorization: localStorage.getItem('jwttoken'),
            },
          }
        );

        if (response.status === 200) {
          setFollowing(false);
        }
      } catch (error) {
        console.error('Error unfollowing user:', error);
      }
    } else {
      try {
        const response = await axios.put(
          `http://localhost:8000/api/user/${username}/follow`,
          {
            headers: {
              authorization: localStorage.getItem('jwttoken'),
            },
          }
        );

        if (response.status === 200) {
          setFollowing(true);
        }
      } catch (error) {
        console.error('Error following user:', error);
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [accessToken, refreshToken]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
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
              {isOwnProfile ? (
                <Button
                  variant="contained"
                  onClick={toggleProfileVisibility}
                  startIcon={
                    userData?.isPrivate ? <VisibilityOff /> : <Visibility />
                  }
                >
                  {userData?.isPrivate ? 'Private' : 'Public'}
                </Button>
              ) : null}
              {isOwnProfile ? (
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
              ) : null}
              {!isOwnProfile ? (
                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  onClick={handleFollowToggle}
                >
                  {following ? 'Unfollow' : 'Follow'}
                </Button>
              ) : null}
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
        <FriendsComponent friends={friends} loadingFriends={loadingFriends} />
      </Box>

      <Box sx={{ flex: { xs: '100%', md: 2 }, mt: { xs: 4, md: 0 } }}>
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
          <AboutComponent
            isOwnProfile={profileUsername === currentUser}
            profileUsername={profileUsername}
          />
        </Paper>

        <PinnedMusicComponent />
      </Box>
    </Box>
  );
};
