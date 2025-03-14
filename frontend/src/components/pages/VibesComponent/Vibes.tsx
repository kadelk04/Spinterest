import React, { useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useVibes } from './VibesContext';
import { useVibesAPI, getVibeImage, vibeImages } from '../../data/vibesUtil';

interface VibesProps {
  expanded: boolean;
}

export const Vibes = ({ expanded }: VibesProps) => {
  const { isOpen, closeVibes } = useVibes();
  const {
    displayVibe,
    loading,
    calculating,
    error,
    fetchUserVibes,
    analyzeAndStoreUserVibes,
    lastFetched,
    pickRandomVibe,
  } = useVibesAPI();

  const lastCalculatedDate = localStorage.getItem('lastCalculatedVibe');

  //visual purposes
  const formattedDate = lastCalculatedDate
    ? new Date(lastCalculatedDate).toLocaleString()
    : 'N/A';

  const isDisabled = lastCalculatedDate
    ? new Date().getTime() - new Date(lastCalculatedDate).getTime() <
      7 * 24 * 60 * 60 * 1000
    : false;

  // Fetch vibes when drawer opens, but only if we haven't fetched recently
  useEffect(() => {
    if (isOpen) {
      // Check if we need to fetch fresh data
      if (
        !lastFetched ||
        new Date().getTime() - lastFetched.getTime() > 60 * 60 * 1000
      ) {
        fetchUserVibes();
      } else {
        pickRandomVibe();
      }
    }
  }, [isOpen, lastFetched, fetchUserVibes, pickRandomVibe]);

  // Get the image for the current vibe or null if not found
  const vibeImage = displayVibe ? vibeImages[displayVibe] || null : null;

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={closeVibes}
      ModalProps={{ BackdropProps: { invisible: true } }}
      sx={{
        position: 'absolute',
        zIndex: (theme) => theme.zIndex.drawer - 1,
        '& .MuiDrawer-paper': {
          width: 350,
          bgcolor: '#f9f5f9',
          height: '100vh',
          borderTopRightRadius: '16px',
          borderBottomRightRadius: '16px',
          left: expanded ? '180px' : '90px',
          transition: 'left 0.3s ease',
          boxShadow: '4px 0px 8px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={closeVibes}
          sx={{ position: 'absolute', top: 20, right: 20 }}
        >
          <Close />
        </IconButton>

        {/* Page Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            fontSize: '32px',
            mb: 3,
            textAlign: 'left',
            alignSelf: 'flex-start',
          }}
        >
          YOUR
          <br />
          VIBES
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress sx={{ color: '#7764C4' }} />
          </Box>
        ) : error ? (
          <Box>
            <Typography color="error" sx={{ my: 2 }}>
              {error}
            </Typography>
            <Typography variant="body2" sx={{ my: 1 }}>
              {error.includes('token') || error.includes('Token') ? (
                <>
                  Please make sure you&apos;re logged in with Spotify and try
                  again.
                  <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
                    <Button
                      onClick={() => (window.location.href = '/login')}
                      variant="outlined"
                      size="small"
                    >
                      Go to Login
                    </Button>
                    <Button variant="outlined" size="small">
                      Enter Token Manually
                    </Button>
                  </Box>
                </>
              ) : (
                'Try recalculating your vibes.'
              )}
            </Typography>
          </Box>
        ) : displayVibe ? (
          /* Vibe Display - Only show if we have an actual vibe */
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 10,
              width: '100%',
            }}
          >
            {getVibeImage(displayVibe)}
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'uppercase',
              }}
            >
              {displayVibe}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ mb: 3 }}>
            No vibes detected yet. Click &quot;Calculate Vibes&quot; to analyze
            your music.
          </Typography>
        )}

        <Box
          sx={{
            width: '100%',
            height: 180,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 3,
            position: 'relative',
          }}
        >
          {loading ? (
            <Typography variant="body2" sx={{ color: '#333' }}>
              Loading vibes...
            </Typography>
          ) : error ? (
            <Typography variant="body2" sx={{ color: 'red' }}>
              {error}
            </Typography>
          ) : vibeImage ? (
            <img
              src={vibeImage}
              alt={displayVibe}
              style={{ width: 300, height: 300, objectFit: 'contain' }}
            />
          ) : (
            <Typography
              variant="body1"
              sx={{ textAlign: 'center', color: '#555' }}
            >
              {displayVibe || 'No vibes yet'}
            </Typography>
          )}
        </Box>

        {/* Spacer to push recalculate button to bottom */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Last Fetched Info - Moved above the Calculate button */}
        {lastFetched && (
          <Typography
            variant="caption"
            sx={{ color: 'gray', mb: 2, textAlign: 'center' }}
          >
            Last updated: {formattedDate},
          </Typography>
        )}

        {/* Recalculate Button */}
        <Button
          variant="contained"
          onClick={analyzeAndStoreUserVibes}
          disabled={calculating || isDisabled}
          sx={{
            width: '70%',
            mb: 4,
            bgcolor: isDisabled ? 'gray' : '#7764C4',
            color: 'white',
            borderRadius: 50,
            textTransform: 'none',
            py: 1,
            '&:hover': {
              bgcolor: isDisabled ? 'gray' : '#6555b5',
            },
          }}
        >
          {calculating ? (
            <CircularProgress size={24} color="inherit" />
          ) : isDisabled ? (
            'Recalculate in a week'
          ) : (
            'Calculate Vibes'
          )}
        </Button>
      </Box>
    </Drawer>
  );
};
