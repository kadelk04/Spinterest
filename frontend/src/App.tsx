import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Profile } from './components/pages/Profile';
import { Login } from './components/pages/Login';
import { Dashboard } from './components/pages/Dashboard';
import { Box, CssBaseline } from '@mui/material';
import { Navbar } from './components/common/Navbar';
import { Theme } from './components/common/Theme';
import { VibesProvider } from './components/pages/VibesPanel/VibesContext';
import { Vibes } from './components/pages/VibesPanel/Vibes';
 
import '@fontsource/roboto';
import PrivateRoute from './components/common/PrivateRoute';
import { grey } from '@mui/material/colors';
import '@fontsource/open-sans';

export default function App() {
  const [expanded, setExpanded] = React.useState(false);
  const signedIn = localStorage.getItem('spotify_token');

  return (
    <Theme>
      <VibesProvider>
        <Router>
          <Box
            sx={{
              display: 'flex',
              background: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.background.default
                  : grey[900],
            }}
          >
            <CssBaseline />
            <Navbar expanded={expanded} setExpanded={setExpanded} /> 
            <Vibes />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                height: '100vh',
                p: 3,
                transition: 'all 0.3s ease',
              }}
            >
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile/:username" element={<Profile />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </VibesProvider>
    </Theme>
  );
}
