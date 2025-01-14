import React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import {
  Search as SearchIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  LocationOn as LocationOnIcon,
  AccountCircle as AccountCircleIcon,
  MusicNote as MusicNoteIcon,
  SaveAlt as SaveAltIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
  Grid,
  IconButton,
  Icon,
  ListItem,
  List,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
const PinnedMusicComponent: React.FC = () => {
  return (
    <Paper sx={{ p: 3, bgcolor: '#ECE6F0' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        PINNED MUSIC
      </Typography>
      <TextField
        fullWidth
        placeholder="Pinned Music"
        variant="outlined"
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            bgcolor: '#F5EFF7',
            '&:hover fieldset': {
              borderColor: '#000000',
            },
          },
        }}
      />
      <Grid container spacing={2}>
        {[...Array(6)].map((_, i) => (
          <Grid item xs={4} key={i}>
            <Paper
              sx={{
                paddingTop: '100%',
                position: 'relative',
                bgcolor: '#FEF7FF',
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};
export default PinnedMusicComponent;
