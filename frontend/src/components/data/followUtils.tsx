import React from 'react';
import axios from 'axios';

// logic for following
// called by handleFollowToggle in Profile.tsx

export const followUser = async (username: string) => {
  try {
    // first find if user is private or public -- add a new UserController method

    // first call notification route to create a notification
    const notificationResponse = await axios.post(
      `http://localhost:8000/api/notification/follow/${username}`
    );

    const followResponse = await axios.put(
      `http://localhost:8000/api/user/${username}/follow`
    );
    console.log('Followed user:', followResponse.data);
    return true;
  } catch (error) {
    console.error('Error following user:', error);
    return false;
  }
};
export const unfollowUser = async (username: string) => {
  // don't create a notification lol
  try {
    const response = await axios.put(
      `http://localhost:8000/api/user/${username}/unfollow`
    );
    console.log('Unfollowed user:', response.data);
  } catch (error) {
    console.error('Error unfollowing user:', error);
  }
};
