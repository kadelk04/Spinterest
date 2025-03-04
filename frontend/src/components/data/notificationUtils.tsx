import React from 'react';
import axios from 'axios';

import { followUserDirect } from './followUtils';

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

export const acceptFollowRequest = async (notificationId: string): Promise<void> => {

  // colter follow req
 // {"_id":{"$oid":"67c3d08377794649451db4b5"},"title":"Follow Request","message":"colt requested to follow you!","type":"follow_request","receiver":[{"$oid":"679bea43f63834e135f2773c"}],"createdAt":{"$date":{"$numberLong":"1740884129817"}},"status":"pending","__v":{"$numberInt":"0"},"sender":{"$oid":"67b4d7faa565ae31eba7e443"}}


 // gale follow req
 // {"_id":{"$oid":"67c7529fde72bdd6e970cc13"},"title":"Follow Request","message":"gale1 requested to follow you!","type":"follow_request","receiver":[{"$oid":"679bea43f63834e135f2773c"}],"createdAt":{"$date":{"$numberLong":"1740884129817"}},"status":"pending","__v":{"$numberInt":"0"},"sender":{"$oid":"67849104e9e332e40e82e5da"}}
  try {
    console.log("accepting follow req", notificationId);
    // add them to their following array, add requested user to their followers array

    try {
      // update the notification 
      await axios.put(`http://localhost:8000/api/notification/update/${notificationId}`);

    } catch (updateError) {
      console.error('Error updating notification:', updateError);
      throw new Error('Failed to update notification');
    }

    // get the userMongoId and myMongoId from receiver and sender stored in the notification
    let userMongoId;
    let myMongoId;
    try {
      const notificationResponse = await axios.get(`http://localhost:8000/api/notification/${notificationId}`);
      
      console.log("notification response", notificationResponse.data);

      userMongoId = (notificationResponse.data as { receiver: string[] }).receiver[0];
      myMongoId = (notificationResponse.data as { sender: string }).sender;

      console.log("userMongoId", userMongoId);
      console.log("myMongoId", myMongoId);
      
    } catch (notificationError) {
      console.error('Error fetching notification data:', notificationError);
      throw new Error('Failed to fetch notification data');
    }


    const followResponse = await axios.put(
      `http://localhost:8000/api/user/${userMongoId}/follow`,
      {
        headers: { authorization: localStorage.getItem('jwttoken') },
        follower: myMongoId,
      }
    );
    console.log('Followed user:', followResponse.data);

  } catch (error) {
    console.error(error);
  }
}

export const deleteFollowRequest = async (notificationId: string): Promise<void> => {
  try {
    console.log("deleting follow req", notificationId);
    await axios.delete(`http://localhost:8000/api/notification/delete/${notificationId}`);
  } catch (error) {
    console.error(error);
  }
}


