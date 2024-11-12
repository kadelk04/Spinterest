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
import {
  Dashboard as DashboardIcon,
  AccountCircle as ProfileIcon,
} from '@mui/icons-material';
import PrivateRoute from './components/common/PrivateRoute';
import { grey } from '@mui/material/colors';

export default function App() {
  const [expanded, setExpanded] = React.useState(false);
  const signedIn = localStorage.getItem('spotify_token');

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
              height: '100vh',
              p: 3,
              transition: 'all 0.3s ease',
            }}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
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
