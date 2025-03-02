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

interface UserData {
  _id: string;
  username: string;
  isPrivate: boolean;
  // Add other fields as needed
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

export const fetchNotifications = async (): Promise<void> => {
  const localStorageUsername = window.localStorage.getItem('username');

  
  try {

    const userResponse = await axios.get<UserData>(`http://localhost:8000/api/user/${localStorageUsername}`);
    console.log('userResponse');
    console.log(userResponse.data);
    const userMongoId = userResponse.data?._id;
    console.log('mongoId');
    console.log(userMongoId);

    const response = await axios.get(`http://localhost:8000/api/notification/all/${userMongoId}`);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}
