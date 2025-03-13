import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    IconButton,
  } from '@mui/material';
  import EditIcon from '@mui/icons-material/Edit';
  import { useState, useEffect } from 'react';
  
  export const Settings = () => {
    const [username, setUsername] = useState(() => {
      return localStorage.getItem('username') || 'Default User'; // Change this based on your auth system
    });
  
    const [bio, setBio] = useState(''); // Initialize with empty string or fetched bio
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [isEditingUsername, setIsEditingUsername] = useState(false);
  
    // Fetch the bio from the backend when the page loads
    useEffect(() => {
      const fetchBio = async () => {
        try {
          const response = await fetch('/api/getUserBio', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          if (data.bio) {
            setBio(data.bio); // Set the bio fetched from the backend
          }
        } catch (error) {
          console.error('Error fetching bio:', error);
        }
      };
  
      fetchBio(); // Fetch bio when component is mounted
    }, []); // Empty dependency array ensures it only runs on mount
  
    // Handle bio change
    const handleBioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setBio(event.target.value);
    };
  
    // Save profile (username and bio) to backend
    const saveProfile = async () => {
      try {
        const response = await fetch('/api/updateSettingsPgInfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            biography: bio, // Send the updated bio
          }),
        });
  
        if (response.ok) {
          console.log('Profile updated successfully');
          setIsEditingBio(false); // Exit editing mode after saving
        } else {
          console.error('Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    };
  
    return (
      <Box sx={{ display: 'flex', width: '100%', height: '100vh', bgcolor: '#ECE6F9' }}>
        {/* Left Side: Settings Menu */}
        <Paper sx={{ width: '20%', p: 3, borderRight: '1px solid #ddd', bgcolor: '#ECE6F0' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>SETTINGS</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button variant="text" sx={{ justifyContent: 'flex-start', color: 'inherit' }}>Edit Profile</Button>
          </Box>
        </Paper>
  
        {/* Right Side: Edit Profile */}
        <Paper sx={{ width: '80%', p: 3, bgcolor: '#ECE6F0' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>EDIT PROFILE</Typography>
  
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Profile Picture */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: '#ECE6F0',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '1px solid #ddd',
                  marginRight: 2,
                }}
              />
              <Box>
                {/* Editable Username */}
                {isEditingUsername ? (
                  <TextField
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={saveProfile} // Save when focus is lost
                    onKeyDown={(e) => e.key === 'Enter' && saveProfile()} // Save on Enter key
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
  
            {/* Bio */}
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
                <Button variant="contained" sx={{ mt: 1 }} onClick={saveProfile}>
                  Save
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body1">{bio}</Typography>
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
  