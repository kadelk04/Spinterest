import React from 'react';
import axios from 'axios';
import { NotificationBlurb } from '../pages/DashboardComponents/NotificationBlurb';

export interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  component: React.ReactElement;
}

interface UserData {
  _id: string;
  username: string;
  isPrivate: boolean;
  // Add other fields as needed
}

export const returnNotifications = async (): Promise<Notification[]> => {
  const notifications = await fetchNotifications();

  return notifications.map((notification) => ({
    ...notification,
    component: <NotificationBlurb key={notification.id} notification={notification} />,
  }));
}

export const fetchNotifications = async (): Promise<Notification[]> => {
  const localStorageUsername = window.localStorage.getItem('username');
  try {
    const userResponse = await axios.get<UserData>(`http://localhost:8000/api/user/${localStorageUsername}`);
    const userMongoId = userResponse.data?._id;

    const response = await axios.get<Notification[]>(`http://localhost:8000/api/notification/all/${userMongoId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

