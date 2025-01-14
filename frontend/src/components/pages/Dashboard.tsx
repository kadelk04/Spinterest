import { useEffect, useState } from 'react';
import React from 'react';
import { Box, Typography, Input, InputAdornment, Paper } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { getLayouts } from '../data/layoutGenerator';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { returnWidgets, Widget } from '../data/playlistUtils';

export const Dashboard = () => {
  const [widgets, setWidgets] = React.useState<Widget[]>([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth - 120);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    returnWidgets().then((widgets) => {
      setWidgets(widgets);
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
    setError('');

    try {
      console.log('Searching for user:', username);
      const response = await fetch(`/api/users/${username}`);
      console.log('Response status:', response.status);

      if (response.status === 404) {
        console.log('User not found');
        setSearchResults([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const user = await response.json();
      console.log('Found user:', user);
      setSearchResults([user]); // Wrap single user in array for consistency
    } catch (err) {
      console.error('Search error:', err);
      setError('Error searching for user');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const layouts = getLayouts(widgets);

  return (
    <Box sx={{ flexGrow: 1, position: 'relative' }}>
      <Box sx={{ position: 'relative', marginBottom: '20px' }}>
        <Input
          placeholder="/genre, /tag, /person"
          id="input-with-icon-adornment"
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
            {isSearching ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="textSecondary">Searching...</Typography>
              </Box>
            ) : (
              searchResults.map((user) => (
                <Box
                  key={user._id}
                  sx={{
                    p: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      cursor: 'pointer',
                    },
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                  }}
                >
                  <Typography variant="body1">{user.username}</Typography>
                  {user.location && (
                    <Typography variant="body2" color="textSecondary">
                      {user.location}
                    </Typography>
                  )}
                </Box>
              ))
            )}
          </Paper>
        )}

        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </Box>

      <Typography>Dashboard</Typography>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 6, md: 4, sm: 3, xs: 2, xxs: 2 }}
        rowHeight={420}
        width={windowWidth}
        draggableHandle=".drag-handle"
        draggableCancel=".no-drag"
        isResizable={false}
      >
        {widgets.map((widget) => (
          <div
            key={widget.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(widget.component, {
              dragHandleClass: 'drag-handle',
              noDragClass: 'no-drag',
            })}
          </div>
        ))}
      </ResponsiveGridLayout>
    </Box>
  );
};
