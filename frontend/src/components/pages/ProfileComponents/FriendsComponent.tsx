import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemButton,
  Input,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface FriendsComponentProps {
  friends: string[];
}

interface User {
  _id: string;
  username: string;
  location?: string;
  images?: { url: string }[];
}

const FriendsComponent: React.FC<FriendsComponentProps> = ({
  friends,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const handleOnClick = async (friend: string) => {
    let username = friend;
    console.log('Friend clicked:', username);
    navigate(`/profile/${friend}`);
  };


  const handleSearch = async (username: string) => {
    if (!username.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8000/api/user/search/${username}`
      );

      if (response.status === 404) {
        setSearchResults([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const user = await response.json();
      setSearchResults(user);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    }
  };

  // Update search on every keystroke
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const orderedFriends = useMemo(() => {
    if (searchQuery.trim() && searchResults.length > 0) {
      const topFriendUsername = searchResults[0].username;
      if (friends.includes(topFriendUsername)) {
        return [topFriendUsername, ...friends.filter(friend => friend !== topFriendUsername)];
      }
    }
    return friends;
  }, [friends, searchQuery, searchResults]);
  
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
      <Input
        placeholder='Friends'
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        endAdornment={
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        }
        sx={{ flex: 1, mr: 1 }}
      />
      </Box>
      <List
          sx={{
            width: '100%',
            maxHeight: 200,
            overflowY: 'auto',
          }}
      >
        {orderedFriends.map((friend) => (
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
    </Paper>
  );
};

export default FriendsComponent;
