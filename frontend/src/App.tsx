import './App.css';
import React from 'react';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import { Profile } from './components/pages/Profile';
import { Login } from './components/pages/Login';
import { Dashboard } from './components/pages/Dashboard';
import { Box, CssBaseline } from '@mui/material';
import { Navbar } from './components/common/Navbar';
import { Theme } from './components/common/Theme';
import { PlaylistWidgets } from './components/data/getPlaylistWidgets';
import '@fontsource/roboto';
import {
  Dashboard as DashboardIcon,
  AccountCircle as ProfileIcon,
} from '@mui/icons-material';
import PrivateRoute from './components/common/PrivateRoute';

export default function App() {
  const [expanded, setExpanded] = React.useState(false);
  const signedIn = localStorage.getItem('spotify_token');
  async function fetchAll() {
    try {
      // example: const response = await axios.get('http://localhost:5000/users');
      // return response.data.users_list;
    } catch (error) {
      //We're not handling errors. Just logging into the console.
      console.log(error);
      return false;
    }
  }

  const playlistWidgets = PlaylistWidgets();

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
                element={<Dashboard widgets={playlistWidgets}/>}
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
