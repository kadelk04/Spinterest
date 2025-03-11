import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';

interface FriendsComponentProps {
  friends: string[];
}

const FriendsComponent: React.FC<FriendsComponentProps> = ({
  friends,
}) => {
  const navigate = useNavigate();
  const [loadingFriends, setLoadingFriends] = React.useState(friends.length === 0);

  React.useEffect(() => {
    if (friends.length === 0) {
      setLoadingFriends(true);
    } else {
      setLoadingFriends(false);
    }
  }, [friends]);

  const handleOnClick = async (friend: string) => {
    let username = friend;
    console.log('Friend clicked:', username);
    navigate(`/profile/${friend}`);
    // try {
    //   // First navigate to clear the current profile
    //   navigate(`/profile/${username}`);

    //   const profileResponse = await fetch(
    //     `http://localhost:8000/api/user/profile/${username}`,
    //     { method: 'GET', credentials: 'omit' }
    //   );

    //   if (!profileResponse.ok) {
    //     throw new Error(`Error fetching profile: ${profileResponse.status}`);
    //   }

    //   const profileData = await profileResponse.json();

    //   // Then replace the current navigation with the new data
    //   navigate(`/profile/${username}`, {
    //     state: { profileData },
    //     replace: true, // This is important - it replaces the current history entry
    //   });

    //   // Clear search after successful navigation
    // } catch (err) {
    //   console.error('Error navigating to profile:', err);
    // }

  };
  
  return (
    <Paper
      sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      bgcolor: '#ECE6F0',
      borderRadius: 2,
      width: { xs: '100%', md: '90%' },
      height: 300,
      p: 2,
      overflowY: 'auto',
      }}
    >
      <Box
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        mb: 2,
      }}
      >
      <TextField
        id="search-friends"
        label="Friends"
        fullWidth
        sx={{ flex: 1, mr: 1 }}
        InputProps={{
        endAdornment: (
          <IconButton>
          <SearchIcon />
          </IconButton>
        ),
        }}
      />
      <IconButton>
        <SettingsIcon />
      </IconButton>
      </Box>

      {loadingFriends ? (
        <Typography>Loading friends...</Typography>
      ) : (
        <List
          sx={{
            width: '100%',
            maxHeight: 200,
            overflowY: 'auto',
          }}
        >
          {friends.map((friend) => (
            <ListItem key={friend} disablePadding>
              <ListItemButton onClick={() => handleOnClick(friend)}>
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText primary={friend} />
              </ListItemButton>
            </ListItem>
          ))}

        </List>
      )}
    </Paper>
  );
};

export default FriendsComponent;
