import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Input,
  InputAdornment,
  Paper,
  Avatar,
  Skeleton,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import NotificationsDrawer from './DashboardComponents/NotificationsDrawer';
import Grid from '@mui/material/Grid2';

import { returnWidgets, Widget } from '../data/playlistUtils';

interface User {
  _id: string;
  username: string;
  location?: string;
  images?: { url: string }[];
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const [widgets, setWidgets] = React.useState<Widget[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
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
          key={`skeleton-${i}`}
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
  }, []);

  const handleSearch = async (username: string) => {
    if (!username.trim()) {
      setSearchResults([]);
      setNotFound(false);
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setNotFound(false);

    try {
      const response = await fetch(
        `http://localhost:8000/api/user/search/${username}`
      );

      if (response.status === 404) {
        console.log(`User '${username}' not found`);
        setSearchResults([]);
        setNotFound(true);
        return;
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const users = await response.json();
      
      // If no users found or empty array
      if (!users || (Array.isArray(users) && users.length === 0)) {
        console.log(`No users found matching '${username}'`);
        setSearchResults([]);
        setNotFound(true);
        return;
      }
      
      // Check if we got an array or single user
      const userResults = Array.isArray(users) ? users : [users];
      setSearchResults(userResults);
      setShowDropdown(true);
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
      setNotFound(false);
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
      setNotFound(false);
    }
  }, [searchQuery]);


  // Helper function to get the user profile image
  const getUserProfileImage = (user: User): string => {
    if (user.images && user.images.length > 0 && user.images[0].url) {
      return user.images[0].url;
    }
    return '/broken-image.jpg'; // Default placeholder
  };

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
        {searchQuery.trim() !== '' && (
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
            {isSearching ? (
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width={150} />
              </Box>
            ) : notFound ? (
              <Box sx={{ p: 2 }}>
                <Typography variant="body1" color="error">
                  User "{searchQuery}" not found. Please check the username and try again.
                </Typography>
              </Box>
            ) : (
              searchResults.map((user) => (
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
              ))
            )}
          </Paper>
        )}

        {searchError && (
          <Typography color="error" sx={{ mt: 1 }}>
            {searchError}
          </Typography>
        )}
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