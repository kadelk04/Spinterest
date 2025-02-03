import React, { useState } from 'react';
import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function NotificationDrawer() {
  const [open, setOpen] = useState(false);

  // Toggle Drawer Function
  const toggleDrawer =
    (open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent): void => {
      if (
        event.type === 'keydown' &&
        'key' in event &&
        (event.key === 'Tab' || event.key === 'Shift')
      ) {
        return;
      }
      setOpen(open);
    };

  return (
    <Box sx={{ position: 'relative', marginBottom: '20px' }}>
      {/* Notifications Button */}
      <Button
        variant="contained"
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: 'primary.main',
          color: 'white',
          borderRadius: '20px',
          padding: '5px 15px',
          textTransform: 'none',
        }}
        startIcon={<NotificationsIcon />}
        onClick={toggleDrawer(true)}
      >
        Notifications
      </Button>

      {/* Right-Side Drawer */}
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 300, p: 2 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <h3>Notifications</h3>
        </Box>
      </Drawer>
    </Box>
  );
}
