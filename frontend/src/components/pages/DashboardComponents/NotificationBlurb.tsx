// this will function similarly to how the PlaylistWidgets are loaded onto the Dashboard
import { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
} from '@mui/material';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { Notification } from '../../data/notificationUtils';

interface NotificationBlurbProps {
  notification: Notification;
}

export const NotificationBlurb = ({ notification }: NotificationBlurbProps) => {
  return (
    <Card
      sx={{
        marginBottom: 2,
        padding: 1,
        backgroundColor: '#e3f2fd',
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1">{notification.message}</Typography>
          <Chip label={notification.type} size="small" color="primary" />
        </Stack>
        <Typography variant="caption" color="textSecondary">
          {new Date(notification.createdAt).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};
