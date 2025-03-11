import { useEffect, useState } from 'react';
import React from 'react';
import {
  Box,
  Typography,
  Input,
  InputAdornment,
  Paper,
  Skeleton,
  Avatar,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import NotificationsDrawer from './DashboardComponents/NotificationsDrawer';
import { usePlaylists } from '../data/PlaylistContext';
import Grid from '@mui/material/Grid2';

import { returnWidgets, Widget } from '../data/playlistUtils';
import { returnNotifications, Notification } from '../data/notificationUtils';

interface User {
  _id: string;
  username: string;
  location?: string;
  images?: { url: string }[];
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth - 120);
  const [widgets, setWidgets] = React.useState<Widget[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  useEffect(() => {
    // 16 skeleton widgets
    const skeletonArray = Array.from({ length: 16 }, (_, i) => ({
      id: `skeleton-${i}`,
      cover: '',
      owner: '',
      title: '',
      description: '',
      genres: [],
      component: (
        <Skeleton
          key={i}
          variant="rounded"
          width={250}
          height={420}
          sx={{ borderRadius: '20px' }}
        />
      ),
    }));
    setWidgets(skeletonArray);
    returnWidgets().then((widgets) => {
      setWidgets(widgets);
    });
    returnNotifications().then((notifications) => {
      setNotifications(notifications);
    });
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth - 120);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = async (username: string) => {
    if (!username.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError('');

    try {
      const response = await fetch(
        `http://localhost:8000/api/user/search/${username}`
      );

      if (response.status === 404) {
        setSearchResults([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const user = await response.json();
      setSearchResults(user);
      setShowDropdown(true); // Show dropdown when we have results
    } catch (err) {
      console.error('Search error:', err);
      setSearchError('Error searching for user');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUserClick = async (username: string) => {
    try {
      // First navigate to clear the current profile
      navigate(`/profile/${username}`);

      const profileResponse = await fetch(
        `http://localhost:8000/api/user/profile/${username}`,
        { method: 'GET', credentials: 'omit' }
      );

      if (!profileResponse.ok) {
        throw new Error(`Error fetching profile: ${profileResponse.status}`);
      }

      const profileData = await profileResponse.json();

      // Then replace the current navigation with the new data
      navigate(`/profile/${username}`, {
        state: { profileData },
        replace: true, // This is important - it replaces the current history entry
      });

      // Clear search after successful navigation
      setSearchResults([]);
      setSearchQuery('');
    } catch (err) {
      console.error('Error navigating to profile:', err);
      setSearchError(
        err instanceof Error ? err.message : 'Error accessing profile'
      );
    }
  };

  // Update search on every keystroke
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <Box sx={{ flexGrow: 1, position: 'relative' }}>
      <Box sx={{ position: 'relative', marginBottom: '20px' }}>
        {<NotificationsDrawer />}
        <Input
          placeholder="/genre, /tag, /person"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <Search />
            </InputAdornment>
          }
          disableUnderline
          fullWidth
          sx={{
            width: '30ch',
            borderRadius: '20px',
            backgroundColor: 'white',
            padding: '5px 15px',
            border: '1px solid #ccc',
          }}
        />

        {/* Search Results Dropdown */}
        {(searchResults.length > 0 || isSearching) && (
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              maxHeight: '300px',
              overflowY: 'auto',
              mt: 1,
              zIndex: 1000,
            }}
          >
            {searchResults.map((user) => (
              <Box
                key={user._id}
                onClick={() => handleUserClick(user.username)}
                sx={{
                  p: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    cursor: 'pointer',
                  },
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Avatar
                  src={user.images?.[0]?.url || '/broken-image.jpg'}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: '#7C6BBB', // Same purple as your profile avatar
                  }}
                />
                <Box>
                  <Typography variant="body1">{user.username}</Typography>
                  {user.location && (
                    <Typography variant="body2" color="text.secondary">
                      {user.location}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Paper>
        )}

        <Typography color="error" sx={{ mt: 1 }}>
          {searchError}
        </Typography>
      </Box>
      <Grid container spacing={2} sx={{ padding: 2 }}>
        {widgets.map((widget) => (
          <Grid key={widget.id} component="div">
            {widget.component} {/* Render the widget's component */}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
