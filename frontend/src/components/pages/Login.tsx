import { useEffect } from 'react';
import { fetchAuthToken, SpotifyLoginButton } from '../data/SpotifyAuth';
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  Container,
  Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import styles from "./Login.module.css";
import vinylImage from '../../assets/vinyl_login.webp'


export const Login = () => {
  useEffect(() => {
    const { code } = getInfoFromUrl();
    if (code) {
      window.localStorage.setItem('spotify_token', code);
    }

    if (!code) return;

    fetchAuthToken(code);
  }, []);

  const getInfoFromUrl = () => {
    const code = new URLSearchParams(window.location.search).get('code');
    const state = '0';
    window.history.pushState({}, '', '/login');
    return { code, state };
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
          <Box
            sx={{
              mt: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 4
            }}
          >
            <Typography
              component="h1"
              variant="h3"
              sx={{
                mb: 1
              }}
            >
              Welcome Back!
            </Typography>
            
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
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

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
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
              <Box
                sx={{
                  bgcolor: '#5C6BC0',
                  textAlign: 'center', // Center align content (optional)
                  cursor: 'pointer', // Make it look clickable
                  '&:hover': {
                    bgcolor: '#3F51B5',
                  },
                  borderRadius: 1, // Add border-radius for a button-like appearance
                }}
              >
                <SpotifyLoginButton />
              </Box>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary" display="inline">
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
