import React, { useEffect, useState } from 'react';
import {
  AUTH_URL,
  fetchAuthToken,
  SpotifyLoginButton,
} from '../data/SpotifyAuth';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, TextField, Link } from '@mui/material';
import Grid from '@mui/material/Grid2';
import vinylImage from '../../assets/vinyl_login.webp';
import { SignupModal } from '../common/SignupModal';

export const Login = () => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const { code } = getInfoFromUrl();
      if (!code) return;
      await fetchAuthToken(code);
      navigate('/dashboard');
    };
    fetchData();
  }, []);

  const getInfoFromUrl = () => {
    const code = new URLSearchParams(window.location.search).get('code');
    const state = '0';
    window.history.pushState({}, '', '/login');
    return { code, state };
  };

  const handleLoginClick = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      console.log('this worked');
      console.log('Response:', response.statusText);
      if (response.ok) {
        const data = await response.json();
        // Store the token securely, e.g., in localStorage or a secure cookie
        localStorage.setItem('jwttoken', data.token);
        localStorage.setItem('username', username);
        setPassword(''); // Clear password from state
        window.location.href = AUTH_URL;
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError(`Failed to log in ${error}`);
    }
  };

  // return (
  //   // <div className={styles.LoginContainer}>
  //   //     <Typography>Click to Login</Typography>
  //   //     <SpotifyLoginButton />
  //   // </div>
  //   <Container component="main" maxWidth="xl">

  //   </Container>
  // );
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={6}>
          <SignupModal open={open} setOpen={setOpen} navigate={navigate} />
          <Box
            sx={{
              mt: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 4,
            }}
          >
            <Typography
              component="h1"
              variant="h3"
              sx={{
                mb: 1,
              }}
            >
              Welcome Back!
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              Let's get back to those tunes.
            </Typography>

            <Box component="form" sx={{ width: '100%', mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
                sx={{
                  bgcolor: 'rgba(237, 231, 246, 0.4)',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                  },
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  bgcolor: 'rgba(237, 231, 246, 0.4)',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                  },
                }}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  my: 2,
                }}
              >
                <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </Box>

              {/* <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  mb: 2,
                  py: 1.5,
                  bgcolor: '#5C6BC0',
                  '&:hover': {
                    bgcolor: '#3F51B5',
                  },
                }}
              >
                Login
              </Button> */}
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleLoginClick}
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderColor: 'transparent',
                  textTransform: 'none', // This will prevent automatic capitalization
                }}
              >
                <Typography variant="body2" color="text.light" display="inline">
                  Sign In
                </Typography>
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  display="inline"
                >
                  Or sign up here!
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                sx={{
                  mt: 2,
                  py: 1.5,
                  bgcolor: 'rgba(237, 231, 246, 0.4)',
                  borderColor: 'transparent',
                  color: 'text.primary',
                  textTransform: 'none', // This will prevent automatic capitalization
                  '&:hover': {
                    bgcolor: 'rgba(237, 231, 246, 0.6)',
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                }}
                onClick={() => setOpen(true)}
              >
                Register
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid size={6}>
          <img src={vinylImage} alt="A description of the image" />
        </Grid>
      </Grid>
    </Box>
  );
};
