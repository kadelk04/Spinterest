import React, { useState } from 'react';
import {
  Button,
  Modal,
  TextField,
  Box,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import { AUTH_URL, SpotifyLoginButton } from '../data/SpotifyAuth';
import { useNavigate } from 'react-router-dom';

interface SignupModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  navigate: ReturnType<typeof useNavigate>;
}

export const SignupModal = ({ open, setOpen, navigate }: SignupModalProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [connectedToSpotify, setConnectedToSpotify] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignupClick = async () => {
    try {
      setLoading(true);
      if (password !== verifyPassword) {
        setError('Passwords do not match');
        return;
      }
      const response = await fetch('http://localhost:8000/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        localStorage.setItem('username', username);
        localStorage.setItem(
          'jwttoken',
          await response.json().then((data) => data.token)
        );
        setOpen(false);
        console.log('yay going to profile');
        window.location.href = AUTH_URL;
      } else {
        const errorMessage = await response.json().then((data) => data.message);
        setError(`Failed to sign up: ${errorMessage}`);
      }
    } catch (error) {
      setError(`Failed to sign up: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      username !== '' &&
      password !== '' &&
      verifyPassword !== '' &&
      password === verifyPassword &&
      connectedToSpotify
    );
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Paper
          sx={{
            padding: 4,
            width: 400,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'background.paper',
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: '800', mb: 5 }}
          >
            Sign Up to Spinterest
          </Typography>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            required={true}
            slotProps={{
              inputLabel: {
                required: false,
              },
            }}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            required={true}
            slotProps={{
              inputLabel: {
                required: false,
              },
            }}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            required={true}
            slotProps={{
              inputLabel: {
                required: false,
              },
            }}
            onChange={(e) => setVerifyPassword(e.target.value)}
          />
          {/* <SpotifyLoginButton /> */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'end',
              width: '100%',
              marginTop: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSignupClick}
              disabled={loading}
              sx={{ marginRight: 2, textTransform: 'none' }}
            >
              Sign Up
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setOpen(false)}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
          </Box>
          {error && (
            <Typography color="error" sx={{ marginTop: 2 }}>
              {error}
            </Typography>
          )}
        </Paper>
      </Box>
    </Modal>
  );
};
