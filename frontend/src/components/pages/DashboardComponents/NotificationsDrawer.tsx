import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Drawer,
  List,
  IconButton,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';

import { Notification, returnNotifications } from '../../data/notificationUtils';
import { NotificationBlurb } from './NotificationBlurb';

export default function NotificationDrawer() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

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

  useEffect(() => {
    const fetchNotifications = async () => {
      // only displaying the 6 most recent notifications
      // prioritizing follow requests
      const fetchedNotifications = await returnNotifications();
      const sortedNotifications = fetchedNotifications.sort((a, b) => {
        if (a.type === 'follow_request' && b.type !== 'follow_request') {
          return -1;
        }
        if (a.type !== 'follow_request' && b.type === 'follow_request') {
          return 1;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setNotifications(sortedNotifications.slice(0, 6));
    };

    fetchNotifications();
  }, []);

  return (
    <Box sx={{ position: 'relative', marginBottom: '20px' }}>
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

      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 300, p: 2 }}
          role="presentation"
          onKeyDown={toggleDrawer(false)}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Notifications</h3>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationBlurb
                  key={notification._id}
                  notification={notification}
                />
              ))
            ) : (
              <p>No notifications</p>
            )}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
