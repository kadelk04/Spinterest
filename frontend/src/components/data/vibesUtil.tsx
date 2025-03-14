import React, { useCallback, useState } from 'react';
import { Box } from '@mui/material';
import MoodIcon from '@mui/icons-material/Mood';
import straightChillingImg from '../../assets/straight_chilling.png';
import energeticEnergyImg from '../../assets/energetic_energy.png';
import woeIsMeImg from '../../assets/woe_cloud.png';
import feelGoodImg from '../../assets/feel_good.png';
import noiseEnjoyerImg from '../../assets/noise_enjoyer.png';
import meltingpotImg from '../../assets/melting_pot.png';

export const vibeImages: Record<string, string> = {
  'Straight Chilling': straightChillingImg,
  'Energetic Energy': energeticEnergyImg,
  'Woe is Me': woeIsMeImg,
  'Feel-Good': feelGoodImg,
  'Noise Enjoyer': noiseEnjoyerImg,
  'Vibes are a melting pot of genres': meltingpotImg,
};

export const getVibeImage = (vibeName: string) => {
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
          mr: 2,
        }}
      />
    );
  } else {
    return (
      <Box
        sx={{
          bgcolor: '#7764C4',
          borderRadius: '50%',
          width: 32,
          height: 32,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mr: 2,
        }}
      >
        <MoodIcon sx={{ color: 'white', fontSize: 18 }} />
      </Box>
    );
  }
};

export const useVibesAPI = () => {
  const [userVibes, setUserVibes] = useState<string[]>([]);
  const [displayVibe, setDisplayVibe] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [calculating, setCalculating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchUserVibes = async () => {
    try {
      setLoading(true);
      setError(null);

      const username = localStorage.getItem('username');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/vibes/${username}`
      );

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      setUserVibes(data.vibes || []);
      setLastFetched(new Date());

      if (data.vibes && data.vibes.length > 0) {
        setDisplayVibe(
          data.vibes[Math.floor(Math.random() * data.vibes.length)]
        );
      } else {
        setDisplayVibe('Vibes are a melting pot of genres');
      }
    } catch (err) {
      console.error(`Error fetching vibes`, err);
    } finally {
      setLoading(false);
    }
  };

  const pickRandomVibe = useCallback(() => {
    if (userVibes.length === 0) {
      setDisplayVibe('Vibes are a melting pot of genres');
      return;
    }

    const randomIndex = Math.floor(Math.random() * userVibes.length);
    setDisplayVibe(userVibes[randomIndex]);
  }, [userVibes]);

  const analyzeAndStoreUserVibes = async () => {
    try {
      setCalculating(true);
      setError(null);

      const username = localStorage.getItem('username') || 'defaultUser';
      const spotifyToken = localStorage.getItem('spotify_token');

      if (!spotifyToken) {
        throw new Error('Spotify token is missing from local storage.');
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/vibes/analyze/${username}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${spotifyToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      if (data.userVibe) {
        setUserVibes(data.userVibe);
        setLastFetched(new Date());

        const currentTime = new Date().toISOString();
        localStorage.setItem('lastCalculatedVibe', currentTime);
      } else {
        fetchUserVibes();
      }
    } catch (err) {
      console.error(`Error calculating vibes`, err);
    } finally {
      setCalculating(false);
    }
  };

  return {
    userVibes,
    displayVibe,
    loading,
    calculating,
    error,
    lastFetched,
    pickRandomVibe,
    fetchUserVibes,
    analyzeAndStoreUserVibes,
    setDisplayVibe,
  };
};
