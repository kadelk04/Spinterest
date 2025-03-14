import { useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button
} from '@mui/material';

import { Notification, acceptFollowRequest, deleteFollowRequest } from '../../data/notificationUtils';

interface NotificationBlurbProps {
  notification: Notification;
}


export const NotificationBlurb = ({ notification }: NotificationBlurbProps) => {
  const [followState, setFollowState] = useState(false);
  
  const handleAccept = async() => {
    const acceptResepnse =  await acceptFollowRequest(notification._id); 

    if (acceptResepnse) {
      setFollowState(true);
    }
  };

  const handleDelete = () => {
    deleteFollowRequest(notification._id);
  };

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
          {followState ? <Chip label="follow" size="small" color="primary" /> : 
          <Chip label={notification.type} size="small" color="primary" />
          }
        </Stack>
        <Typography variant="caption" color="textSecondary">
          {new Date(notification.createdAt).toLocaleString()}
        </Typography>
        {notification.type === 'follow_request' &&  !followState && (
          <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAccept}
            >
              Accept
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDelete}
            >
              Deny
            </Button>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};
