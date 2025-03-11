import React, { useState, useEffect } from 'react';
import { 
  Drawer, 
  Box, 
  Typography, 
  IconButton, 
  Button,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import MoodIcon from '@mui/icons-material/Mood';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { useVibes } from "./VibesContext";

interface VibesProps {
  expanded: boolean;
}

export const Vibes = ({ expanded }: VibesProps) => {
  const { isOpen, closeVibes } = useVibes();
  const [userVibes, setUserVibes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [calculating, setCalculating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  

  // Function to get icon based on vibe type
  const getVibeIcon = (vibeName: string) => {
    switch(vibeName) {
      case "Energetic Energy":
        return <MusicNoteIcon sx={{ color: 'white', fontSize: 18 }} />;
      case "Straight Chilling":
        return <HeadphonesIcon sx={{ color: 'white', fontSize: 18 }} />;
      case "Woe is Me":
        return <SentimentVeryDissatisfiedIcon sx={{ color: 'white', fontSize: 18 }} />;
      case "Noise Enjoyer":
        return <VolumeUpIcon sx={{ color: 'white', fontSize: 18 }} />;
      case "Feel-Good":
        return <WbSunnyIcon sx={{ color: 'white', fontSize: 18 }} />;
      default:
        return <MoodIcon sx={{ color: 'white', fontSize: 18 }} />;
    }
  };

  const vibeImages: Record<string, string> = {
    "Straight Chilling": '../../../assets/straight_chilling.png',
    "Energetic Energy": '../../../assets/energetic_energy.png',
    "Woe is Me": '../../../assets/woe_cloud.png',
    "Feel-Good": '../../../assets/feel_good.png',
    "Noise Enjoyer": '../../../assets/noise_enjoyer.png',
  };
  

  const fetchUserVibes = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const username = localStorage.getItem('username');
            const response = await fetch(`http://localhost:8000/api/user/vibes/${username}`);
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with status: ${response.status}. ${errorText}`);
      }
  
      const data = await response.json();

      setUserVibes(data.vibes || []);
      setLastFetched(new Date());
    } catch (err: any) {
      console.error('Error fetching user vibes:', err);
      setError(`Error fetching vibes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to analyze and store user vibes using backend
  const analyzeAndStoreUserVibes = async () => {
    try {
      setCalculating(true);
      setError(null);

      const username = localStorage.getItem('username') || 'defaultUser';
      const spotifyToken = localStorage.getItem('spotify_token'); 

      if (!spotifyToken) {
        throw new Error('Spotify token is missing from local storage.');
      }

      const response = await fetch(`http://localhost:8000/api/user/vibes/analyze/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${spotifyToken}` // Include the token
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with status: ${response.status}. ${errorText}`);
      }

      const data = await response.json();
      console.log('Calculate API Response:', data);

      if (data.userVibe) {
        setUserVibes(data.userVibe);
        setLastFetched(new Date());
      } else {
        await fetchUserVibes();
      }
    } catch (err: any) {
      console.error('Error calculating user vibes:', err);
      setError(`Error calculating vibes: ${err.message}`);
    } finally {
      setCalculating(false);
    }
  };
  
  // Fetch vibes when drawer opens, but only if we haven't fetched recently
  useEffect(() => {
    if (isOpen) {
      const shouldFetch =
        !lastFetched || new Date().getTime() - lastFetched.getTime() > 60 * 60 * 1000; // 1 hour
  
      if (shouldFetch) {
        fetchUserVibes();
      }
    }
  }, [isOpen, lastFetched]);

  const userVibe = userVibes.length > 0 ? userVibes[0] : "Vibes are a melting pot of genres";
  const vibeImage = vibeImages[userVibe] || vibeImages["Vibes are a melting pot of genres"];

  
  return (
    <>
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={closeVibes}
        ModalProps={{ BackdropProps: { invisible: true } }}
        sx={{
          position: "absolute",
          zIndex: (theme) => theme.zIndex.drawer - 1,
          "& .MuiDrawer-paper": {
            width: 350,
            bgcolor: "#f9f5f9",
            height: "100vh",
            borderTopRightRadius: "16px",
            borderBottomRightRadius: "16px",
            left: expanded ? "180px" : "90px",
            transition: "left 0.3s ease",
            boxShadow: "4px 0px 8px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            padding: 0,
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={closeVibes}
            sx={{ position: "absolute", top: 20, right: 20 }}
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
              alignSelf: 'flex-start'
            }}
          >
            YOUR<br />VIBES
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
                    Please make sure you're logged in with Spotify and try again.
                    <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
                      <Button 
                        onClick={() => window.location.href = '/login'}
                        variant="outlined"
                        size="small"
                      >
                        Go to Login
                      </Button>
                      <Button 
                        variant="outlined"
                        size="small"
                      >
                        Enter Token Manually
                      </Button>
                    </Box>
                  </>
                ) : (
                  'Try recalculating your vibes.'
                )}
              </Typography>
            </Box>
          ) : userVibes.length > 0 ? (
            /* Vibe Display - Only show if we have actual vibes */
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              mb: 3,
              width: '100%'
            }}>
              <Box sx={{ 
                bgcolor: '#7764C4', 
                borderRadius: '50%', 
                width: 32, 
                height: 32,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mr: 2
              }}>
                {getVibeIcon(userVibes[0])}
              </Box>
              <Typography sx={{ 
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'uppercase'
              }}>
                {userVibes[0]}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ mb: 3 }}>
              No vibes detected yet. Click "recalculate vibes" to analyze your music.
            </Typography>
          )}
          
          <Box sx={{ 
          width: '100%',
          height: 180,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 3
        }}>
          {loading ? (
            <Typography variant="body2" sx={{ color: '#333' }}>Loading vibes...</Typography>
          ) : error ? (
            <Typography variant="body2" sx={{ color: 'red' }}>{error}</Typography>
          ) : (
            <>
              <img src={vibeImage} alt={userVibe} style={{ width: 300, height: 300 }} />
            </>
          )}
        </Box>

                    
          {/* Find People Button - Disabled if no vibes */}
          <Button 
            variant="contained" 
            disabled={userVibes.length === 0}
            sx={{ 
              width: '100%',
              bgcolor: '#7764C4',
              color: 'white',
              borderRadius: 50,
              textTransform: 'none',
              py: 1.5,
              mb: 2,
              '&:hover': {
                bgcolor: '#6555b5'
              },
              '&.Mui-disabled': {
                bgcolor: '#b3aad9',
                color: 'rgba(255, 255, 255, 0.8)'
              }
            }}
          >
            Find People with This Vibe
          </Button>
          
          {/* Last Fetched Info */}
          {lastFetched && (
            <Typography variant="caption" sx={{ color: 'gray', mb: 1 }}>
              Last updated: {lastFetched.toLocaleTimeString()}
            </Typography>
          )}
          
          {/* Spacer to push recalculate button to bottom */}
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Recalculate Button */}
          <Button
            variant="contained"
            onClick={analyzeAndStoreUserVibes}
            disabled={calculating}
            sx={{
              width: '70%',
              mb: 4,
              bgcolor: '#7764C4',
              color: 'white',
              borderRadius: 50,
              textTransform: 'none',
              py: 1,
              '&:hover': {
                bgcolor: '#6555b5'
              }
            }}
          >
            {calculating ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'calculate vibes'
            )}
          </Button>
        </Box>
      </Drawer>
    </>
  );
};