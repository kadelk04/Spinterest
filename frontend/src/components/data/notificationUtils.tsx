import React from 'react';
import axios from 'axios';
import { NotificationBlurb } from '../pages/DashboardComponents/NotificationBlurb';

export interface Notification {
  _id: string;
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
  const notifications = await fetchNotifications();
  console.log(notifications);

  return notifications.map((notification) => ({
    _id: notification._id.toString(), // Map _id to id and ensure it's a string
    type: notification.type,
    message: notification.message,
    read: false, // Assuming this field is required; adjust as needed
    createdAt: notification.createdAt,
    component: null, // Remove this field or set it to null
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

