import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';

export const Settings = () => {
  // Get stored bio and username from localStorage (if available)
  const [username, setUsername] = useState(
    () => localStorage.getItem('username') || 'Default User'
  );
  const [bio, setBio] = useState(
    () => localStorage.getItem('bio') || ''
  );

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  // Save changes locally
  const handleBioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBio = event.target.value;
    setBio(newBio);
    localStorage.setItem('bio', newBio); // Save in localStorage
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = event.target.value;
    setUsername(newUsername);
    localStorage.setItem('username', newUsername); // Save in localStorage
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100vh', bgcolor: '#ECE6F9' }}>
      <Paper sx={{ width: '20%', p: 3, borderRight: '1px solid #ddd', bgcolor: '#ECE6F0' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>SETTINGS</Typography>
        <Button variant="text" sx={{ justifyContent: 'flex-start', color: 'inherit' }}>
          Edit Profile
        </Button>
      </Paper>

      <Paper sx={{ width: '80%', p: 3, bgcolor: '#ECE6F0' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>EDIT PROFILE</Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: '#ECE6F0',
                border: '1px solid #ddd',
                marginRight: 2,
              }}
            />
            <Box>
              {isEditingUsername ? (
                <TextField
                  value={username}
                  onChange={handleUsernameChange}
                  onBlur={() => setIsEditingUsername(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingUsername(false)}
                  autoFocus
                  variant="outlined"
                  size="small"
                  sx={{ bgcolor: '#ECE6F0' }}
                />
              ) : (
                <Typography variant="subtitle1">
                  {username}
                  <IconButton sx={{ ml: 1 }} onClick={() => setIsEditingUsername(true)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Typography>
              )}
              <Button variant="outlined" size="small" sx={{ mt: 1, textTransform: 'none', color: '#1E1E1F' }}>
                EDIT ACCOUNT
              </Button>
            </Box>
          </Box>

          {isEditingBio ? (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <TextField
                multiline
                rows={4}
                value={bio}
                onChange={handleBioChange}
                placeholder="Bio"
                inputProps={{ maxLength: 150 }}
                helperText={`${bio.length}/150`}
                sx={{ bgcolor: '#ECE6F0' }}
              />
              <Button variant="contained" sx={{ mt: 1 }} onClick={() => setIsEditingBio(false)}>
                Save
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body1">{bio || 'Click to add a bio'}</Typography>
              <Button variant="outlined" sx={{ mt: 1 }} onClick={() => setIsEditingBio(true)}>
                Edit Bio
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
