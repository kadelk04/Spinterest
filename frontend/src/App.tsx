import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Profile } from './components/pages/Profile';
import { Login } from './components/pages/Login';
import { Dashboard } from './components/pages/Dashboard';
import { Box, CssBaseline } from '@mui/material';
import { Navbar } from './components/common/Navbar';
import { Theme } from './components/common/Theme';

import '@fontsource/roboto';
import { grey } from '@mui/material/colors';
import { VibesProvider } from './components/pages/VibesComponent/VibesContext';
import { Vibes } from './components/pages/VibesComponent/Vibes';
import { PlaylistProvider } from './components/data/PlaylistContext';

export default function App() {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Theme>
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
          <VibesProvider>
          <Vibes expanded={expanded}/>
          <Navbar expanded={expanded} setExpanded={setExpanded} />
          </VibesProvider>

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              height: '100vh',
              p: 3,
              transition: 'all 0.3s ease',
            }}
          >
            <PlaylistProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/" element={<Login />} />
              </Routes>
            </PlaylistProvider>
          </Box>
        </Box>
      </Router>
    </Theme>
  );
}