import React from 'react';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import { Friend } from '../Profile';

interface FriendsComponentProps {
  friends: Friend[];
  loadingFriends: boolean;
}

const FriendsComponent: React.FC<FriendsComponentProps> = ({
  friends,
  loadingFriends,
}) => {
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
            <ListItem key={friend.id} disablePadding>
              <ListItemAvatar>
                <Avatar
                  src={
                    friend.images && friend.images.length > 0
                      ? friend.images[0].url
                      : undefined
                  }
                  sx={{ width: 40, height: 40 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={friend.name}
                primaryTypographyProps={{
                  variant: 'body2',
                  sx: { ml: 1 },
                }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default FriendsComponent;
