import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import { Profile } from './components/pages/Profile';
import { Login } from './components/pages/Login';
import { Dashboard } from './components/pages/Dashboard';
import { Box, CssBaseline } from '@mui/material';
import { Navbar } from './components/common/Navbar';
import { Theme } from './components/common/Theme';

import { fetchPlaylists, returnWidgets } from './components/data/playlistUtils';
import { Widget } from './components/data/playlistUtils';

import '@fontsource/roboto';
import {
  Dashboard as DashboardIcon,
  AccountCircle as ProfileIcon,
} from '@mui/icons-material';
import PrivateRoute from './components/common/PrivateRoute';

export default function App() {
  const [expanded, setExpanded] = React.useState(false);
  const signedIn = localStorage.getItem('spotify_token');
  
  const [widgets, setWidgets] = React.useState<Widget[]>([]);

  useEffect(() => {
    returnWidgets().then((widgets) => {
      setWidgets(widgets);
    });
  }, []);

  return (
    <Theme>
      <Router>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Navbar
            expanded={expanded}
            setExpanded={setExpanded}
            items={[
              signedIn
                ? {
                    href: '/profile',
                    label: 'Profile',
                    icon: <ProfileIcon />,
                  }
                : {
                    href: '/login',
                    label: 'Login',
                    icon: <ProfileIcon />,
                  },
              {
                href: '/dashboard',
                label: 'Dashboard',
                icon: <DashboardIcon />,
              },
            ]}
          />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              transition: 'all 0.3s ease',
            }}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={<Dashboard widgets={widgets}/>}
              />
              <Route
                path="/profile"
                element={<PrivateRoute path="/profile" element={Profile} />}
              />
            </Routes>
          </Box>
        </Box>
      </Router>
    </Theme>
  );
}
