import React from 'react';
import logo from './logo.svg';
import './App.css';
import { SpotifyAuthProvider } from './hooks/useSpotifyAuth';
import { Profile } from './components/Profile';

function App() {
  const REDIRECT_URI = 'http://localhost:3000';
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token';
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

  return (
    <SpotifyAuthProvider>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <a
            className="App-link"
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Login with Spotify
          </a>
          <Profile />
        </header>
      </div>
    </SpotifyAuthProvider>
  );
}

export default App;
