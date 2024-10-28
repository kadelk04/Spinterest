import { FunctionComponent } from 'react';
import { Button, Typography } from '@mui/material';

export const SpotifyLoginButton: FunctionComponent = () => {
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000/login&scope=user-read-email%20user-read-private%20user-library-read%20user-library-modify`;

  return (
    <Button sx={{
      color: 'white', 
        '&:hover': {
        bgcolor: '#3F51B5',}
      }}
        href={AUTH_URL}>
      <Typography sx={{ textTransform: 'none' }}>
        Login with Spotify
      </Typography>
    </Button>
  );
};

export const fetchAuthToken = async (code: string) => {
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: 'http://localhost:3000/login',
      grant_type: 'authorization_code',
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization:
        `Basic ` +
        btoa(
          process.env.REACT_APP_CLIENT_ID +
            ':' +
            process.env.REACT_APP_CLIENT_SECRET
        ),
    },
    json: true,
  };

  try {
    const response = await fetch(authOptions.url, {
      method: 'POST',
      headers: authOptions.headers,
      body: new URLSearchParams(authOptions.form).toString(),
    });
    const data = await response.json();
    window.localStorage.setItem('spotify_token', data.access_token);
    window.localStorage.setItem('spotify_refresh_token', data.refresh_token);
  } catch (error) {
    console.error('Error fetching auth token', error);
  }
};

export const getRefreshedToken = async (refreshToken: string) => {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        btoa(
          process.env.REACT_APP_CLIENT_ID +
            ':' +
            process.env.REACT_APP_CLIENT_SECRET
        ),
    },
    json: true,
  };

  try {
    const response = await fetch(authOptions.url, {
      method: 'POST',
      headers: authOptions.headers,
      body: new URLSearchParams(authOptions.form).toString(),
    });
    const data = await response.json();
    window.localStorage.setItem('spotify_token', data.access_token);
  } catch (error) {
    console.error('Error fetching auth token', error);
  }
};