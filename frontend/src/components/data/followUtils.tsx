import axios from 'axios';

// logic for following
// called by handleFollowToggle in Profile.tsx

// helper function
const getUserMongoId = async (username: string) => {
  try {
    const userResponse = await axios.get(
      `${process.env.REACT_APP_API_URL}/${username}`
    );
    return (userResponse.data as { _id: string })._id;
  } catch (error) {
    console.error(`Error fetching user data for ${username}:`, error);
    throw new Error('Failed to fetch user data');
  }
};

export const followUser = async (username: string, myUsername: string) => {

  if (!username || !myUsername) {
    throw new Error('A username is undefined');
  }

  try {


    // first find if user is private or public -- add a new UserController method
    const privacyResponse = await axios.get(
      `${process.env.REACT_APP_API_URL}/${username}/privacy`
    );

    console.log('Privacy response:', privacyResponse.data);

    let userMongoId = await getUserMongoId(username);
    let myMongoId = await getUserMongoId(myUsername);

    if (privacyResponse.data === true) {
      try {
        console.log("myMongoId", myMongoId);  
        const notificationResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/notification/followRequest/${userMongoId}`,
          { follower: myMongoId }
        );
        console.log('Notification created:', notificationResponse.data);
        return 'pending';
      } catch (notificationError) {
        console.error('Error creating follow request notification:', notificationError);
        throw new Error('Failed to create follow request notification');
      }
    } else if (privacyResponse.data === false) {
      console.log("privacy is false");
      try {
        const notificationResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/notification/follow/${userMongoId}`,
          { follower: myMongoId }
        );
        console.log('Notification created:', notificationResponse.data);
      } catch (notificationError) {
        console.error('Error creating follow notification:', notificationError);
        throw new Error('Failed to create follow notification');
      }
    }

    return await followUserDirect(userMongoId, myMongoId);

  } catch (error) {
    console.error('Error following user:', error);
    return false;
  }
};
export const unfollowUser = async (username: string, myUsername: string) => {
  // don't create a notification lol
  let userMongoId = await getUserMongoId(username);
  let myMongoId = await getUserMongoId(myUsername);

  console.log('Unfollowing user:', userMongoId, myMongoId);
  
  try {
    const unfollowResponse = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/user/${userMongoId}/unfollow`,
      {
        headers: { authorization: localStorage.getItem('jwttoken') },
        unfollower: myMongoId,
      }
    );
    console.log('Unfollowed user:', unfollowResponse.data);
    return true;
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return false;
  }
};
export const fetchFollowStatus = async (
  userMongoId: string,
  myUsername: string
) => {
  // if you don't follow them, check to see if there is a pending notification
  try {
    console.log('Fetching follow status', userMongoId, myUsername);
    const followStatusResponse = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/notification/getFollowRequest/${userMongoId}`,
      { params: { follower: myUsername } }
    );
    console.log('Follow status:', followStatusResponse.data);
    return followStatusResponse.data;
  } catch (error) {
    console.error('Error fetching follow status:', error);
    return false;
  }
};

// this function is called by in notificationUtils.tsx for a user to accept a follow request
export const followUserDirect = async (userMongoId: string, myMongoId: string) => {

  console.log('Following user:', userMongoId, myMongoId);
  try {
    // calling addFollower in userController
    const followResponse = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/user/${userMongoId}/follow`,
      {
        headers: { authorization: localStorage.getItem('jwttoken') },
        follower: myMongoId,
      }
    );
    console.log('Followed user:', followResponse.data);
    return true;
  } catch (error) {
    console.error('Error following user:', error);
    return false;
  }
}

// for friendsComponent - finds all users that u follow / follow u (mutual)
export const getFriends = async (userMongoId: string) => {

  console.log('Getting friends for:', userMongoId);

  try {
    const followersResponse = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/user/${userMongoId}/followers`
    );

    const followingResponse = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/user/${userMongoId}/following`
    );
    const following: string[] = followingResponse.data as string[];
    const followers: string[] = followersResponse.data as string[];

    console.log('Followers:', followers);
    console.log('Following:', following);

    const friends = await Promise.all(
      following
      .filter((user: string) => followers.includes(user))
      .map(async (userMongoId: string) => {
        console.log('Friend:', userMongoId);
        const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/${userMongoId}/id`);
        const userData = userResponse.data as { username: string };
        console.log('Friend:', userData.username);
        return userData.username;
      })
    );
    console.log('Friends usernames:', friends);

    return friends;

  } catch (error) {
    console.error('Error fetching friends:', error);
    return [];
  }
}
