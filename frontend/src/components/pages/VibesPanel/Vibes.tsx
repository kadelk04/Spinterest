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
import MoodIcon from '@mui/icons-material/Mood'; // Keep this icon for fallback
import { useVibes } from "./VibesContext";

// Import images directly
import straightChillingImg from '../../../assets/straight_chilling.png';
import energeticEnergyImg from '../../../assets/energetic_energy.png';
import woeIsMeImg from '../../../assets/woe_cloud.png';
import feelGoodImg from '../../../assets/feel_good.png';
import noiseEnjoyerImg from '../../../assets/noise_enjoyer.png';

interface VibesProps {
  expanded: boolean;
}

export const Vibes = ({ expanded }: VibesProps) => {
  const { isOpen, closeVibes } = useVibes();
  const [userVibes, setUserVibes] = useState<string[]>([]);
  const [displayVibe, setDisplayVibe] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [calculating, setCalculating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  
  // Map vibe names to their image sources
  const vibeImages: Record<string, string> = {
    "Straight Chilling": straightChillingImg,
    "Energetic Energy": energeticEnergyImg,
    "Woe is Me": woeIsMeImg,
    "Feel-Good": feelGoodImg,
    "Noise Enjoyer": noiseEnjoyerImg
  };

  // Function to get small image thumbnail for the vibe
  const getVibeImage = (vibeName: string) => {
    // Check if we have an image for this vibe
    if (vibeImages[vibeName]) {
      return (
        <Box
          component="img"
          src={vibeImages[vibeName]}
          alt={vibeName}
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            objectFit: 'cover',
            mr: 2
          }}
        />
      );
    } else {
      // Fallback to icon if no image exists
      return (
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
          <MoodIcon sx={{ color: 'white', fontSize: 18 }} />
        </Box>
      );
    }
  };

  // Function to randomly select a vibe from the userVibes array
  const pickRandomVibe = () => {
    if (userVibes.length === 0) {
      setDisplayVibe("Vibes are a melting pot of genres");
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * userVibes.length);
    setDisplayVibe(userVibes[randomIndex]);
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
      
      // After fetching, randomly pick a vibe to display
      if (data.vibes && data.vibes.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.vibes.length);
        setDisplayVibe(data.vibes[randomIndex]);
      } else {
        setDisplayVibe("Vibes are a melting pot of genres");
      }
    } catch (err: any) {
      console.error('Error fetching user vibes:', err);
      setError(`Error fetching vibes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to analyze and store user vibes using backend - updated to match new API endpoint
  const analyzeAndStoreUserVibes = async () => {
    try {
      setCalculating(true);
      setError(null);

      const username = localStorage.getItem('username') || 'defaultUser';
      const spotifyToken = localStorage.getItem('spotify_token'); 

      if (!spotifyToken) {
        throw new Error('Spotify token is missing from local storage.');
      }

      // Updated endpoint to match your new router configuration
      const response = await fetch(`http://localhost:8000/api/user/vibes/analyze/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${spotifyToken}`
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
        
        // Randomly select one of the vibes to display
        const randomIndex = Math.floor(Math.random() * data.userVibe.length);
        setDisplayVibe(data.userVibe[randomIndex]);
        
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
      } else if (userVibes.length > 0 && !displayVibe) {
        // If we already have vibes but haven't set a display vibe, pick one randomly
        pickRandomVibe();
      }
    }
  }, [isOpen, lastFetched, userVibes]);
  
  // Get the image for the current vibe or null if not found
  const vibeImage = displayVibe ? vibeImages[displayVibe] || null : null;
  
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
          ) : displayVibe ? (
            /* Vibe Display - Only show if we have an actual vibe */
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              mb: 3,
              width: '100%'
            }}>
              {getVibeImage(displayVibe)}
              <Typography sx={{ 
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'uppercase'
              }}>
                {displayVibe}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ mb: 3 }}>
              No vibes detected yet. Click "Calculate Vibes" to analyze your music.
            </Typography>
          )}
          
          <Box sx={{ 
            width: '100%',
            height: 180,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 3,
            position: 'relative'
          }}>
            {loading ? (
              <Typography variant="body2" sx={{ color: '#333' }}>Loading vibes...</Typography>
            ) : error ? (
              <Typography variant="body2" sx={{ color: 'red' }}>{error}</Typography>
            ) : vibeImage ? (
              <img 
                src={vibeImage} 
                alt={displayVibe} 
                style={{ width: 300, height: 300, objectFit: 'contain' }} 
              />
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                {displayVibe || "No vibes yet"}
              </Typography>
            )}
          </Box>
  
          {/* Spacer to push recalculate button to bottom */}
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Last Fetched Info - Moved above the Calculate button */}
          {lastFetched && (
            <Typography variant="caption" sx={{ color: 'gray', mb: 2, textAlign: 'center' }}>
              Last updated: {lastFetched.toLocaleTimeString()}
            </Typography>
          )}
          
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
              'Calculate Vibes'
            )}
          </Button>
        </Box>
      </Drawer>
    </>
  );
};