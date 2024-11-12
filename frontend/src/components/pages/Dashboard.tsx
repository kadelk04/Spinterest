import { useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  Container,
  Paper,
  InputLabel,
  Input,
  InputAdornment
} from '@mui/material';
import { 
  Search, 
  Dehaze 
} from '@mui/icons-material';

import Grid from '@mui/material/Grid2';
import styles from "./Login.module.css";
export const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Input
        placeholder='/genre, /tag, /person'
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
      <Typography>
        Dashboard
      </Typography>
    </Box>
  );
};

