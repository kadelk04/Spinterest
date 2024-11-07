import React from 'react';
import { Box, Typography, Input, InputAdornment } from '@mui/material';
import { Search, Dehaze } from '@mui/icons-material';

export const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Input
        placeholder="/genre, /tag, /person"
        id="input-with-icon-adornment"
        startAdornment={
          <InputAdornment position="start">
            <Dehaze />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <Search />
          </InputAdornment>
        }
        disableUnderline
        sx={{
          borderRadius: '20px',
          backgroundColor: 'white',
          padding: '5px 15px',
          border: '1px solid #ccc',
        }}
      />
      <Typography>Dashboard</Typography>
    </Box>
  );
};
