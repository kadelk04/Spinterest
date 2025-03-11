import React, { useState, useEffect } from 'react';
import { 
  Drawer, 
  Box, 
  Typography, 
  IconButton, 
  Button,
  CircularProgress
} from "@mui/material";
import { Close } from "@mui/icons-material";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import MoodIcon from '@mui/icons-material/Mood';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import axios from 'axios';
import { useVibes } from "./VibesContext";

interface VibesProps {
  expanded: boolean;
}

export const Vibes = ({ expanded }: VibesProps) => {
  const { isOpen, closeVibes } = useVibes();
  const [userVibes, setUserVibes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to get icon based on vibe type
  //Replace with image in assets
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

  // Function to fetch user vibes - with correct API endpoint
  const fetchUserVibes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get username from localStorage or context
      const username = localStorage.getItem('username') || 'defaultUser';
      // Get token from localStorage or context
      const token = localStorage.getItem('spotifyToken') || '';
      
      console.log('Fetching vibes for username:', username);
    
      const apiUrl = `http://localhost:8000/api/user/vibes/${username}`;
      console.log('API URL:', apiUrl);
      
      // Using fetch instead of axios to match your example
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: token
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      setUserVibes(data.vibes || []);
    } catch (err: any) {
      console.error('Error fetching user vibes:', err);
      setError(`Error fetching vibes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch vibes when drawer opens
  useEffect(() => {
    if (isOpen) {
      fetchUserVibes();
    }
  }, [isOpen]);
  
  // For development: use fallback data if API fails
  const fallbackVibes = ["Straight Chilling"];
  const displayVibes = userVibes.length > 0 ? userVibes : fallbackVibes;
  
  return (
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
            {/* Show fallback vibe even on error */}
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
                {getVibeIcon(fallbackVibes[0])}
              </Box>
              <Typography sx={{ 
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'uppercase'
              }}>
                {fallbackVibes[0]}
              </Typography>
            </Box>
          </Box>
        ) : (
          /* Vibe Display - Show the vibe */
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
              {getVibeIcon(displayVibes[0])}
            </Box>
            <Typography sx={{ 
              fontSize: '14px',
              fontWeight: 500,
              textTransform: 'uppercase'
            }}>
              {displayVibes[0]}
            </Typography>
          </Box>
        )}
        
        {/* Vibe Character Box */}
        <Box sx={{ 
          width: '100%',
          height: 180,
          bgcolor: '#d9d9d9',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="body2" sx={{ color: '#333' }}>
            VIBE CHARACTER
          </Typography>
        </Box>
        
        {/* Find People Button */}
        <Button 
          variant="contained" 
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
            }
          }}
        >
          Find People with This Vibe
        </Button>
        
        {/* Spacer to push recalculate button to bottom */}
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Recalculate Button */}
        <Button
          variant="contained"
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
          recalculate vibes
        </Button>
      </Box>
    </Drawer>
  );
};