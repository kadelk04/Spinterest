import React from 'react';
import axios from 'axios';
import { NotificationBlurb } from '../pages/DashboardComponents/NotificationBlurb';

export interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const returnNotifications = async (): Promise<Notification[]> => {
  return [
    {
      id: '1',
      type: 'follow',
      message: 'Colt followed you!',
      read: false,
      createdAt: '2021-10-01T00:00:00Z',
    },
    {
      id: '2',
      type: 'new playlist',
      message: 'Gale1 added a new playlist!',
      read: false,
      createdAt: '2021-10-01T00:00:00Z',
    },
    {
      id: '3',
      type: 'like',
      message: 'Colt liked your playlist: shift to fall!',
      read: false,
      createdAt: '2021-10-01T00:00:00Z',
    },
  ];
};
