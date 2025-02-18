import React from 'react';
import axios from 'axios';

// logic for following
// called by handleFollowToggle in Profile.tsx

export const followUser = async (username: string, myUsername: string) => {
  try {
    if (!username) {
      throw new Error('Username is undefined');
    }
    // first find if user is private or public -- add a new UserController method
    const privacyResponse = await axios.get(
      `http://localhost:8000/api/user/${username}/privacy`
    );

    console.log('Privacy response:', privacyResponse.data);

    if (privacyResponse.data === true) {
      try {
        const notificationResponse = await axios.post(
          `http://localhost:8000/api/notification/follow/${username}`
        );
        console.log('Notification created:', notificationResponse.data);
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
        throw new Error('Failed to create notification');
      }
    }

    const followResponse = await axios.put(
      `http://localhost:8000/api/user/${username}/follow`,
      {
        headers: {
          authorization: localStorage.getItem('jwttoken'),
        },
        follower: myUsername,
      }
    );
    console.log('Followed user:', followResponse.data);
    return true;
  } catch (error) {
    console.error('Error following user:', error);
    return false;
  }
};
export const unfollowUser = async (username: string, myUsername: string) => {
  // don't create a notification lol
  try {
    const unfollowResponse = await axios.put(
      `http://localhost:8000/api/user/${username}/unfollow`,
      {
        headers: {
          authorization: localStorage.getItem('jwttoken'),
        },
        unfollower: myUsername,
      }
    );
    console.log('Unfollowed user:', unfollowResponse.data);
    return true;
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return false;
  }
};
