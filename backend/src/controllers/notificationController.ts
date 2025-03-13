import { Request, Response } from 'express';
import { getModel } from '../utils/connection';
import { INotification } from '../models/Notification';
import mongoose from 'mongoose';

export interface UserResponse {
  _id: mongoose.Types.ObjectId;
  username: string;
}

/**
 * Create notification
 * @param req
 * @param res
 * @returns
 */
export const createFollowRequestNotification = async (
  req: Request,
  res: Response
) => {
  const userMongoId = req.params.userMongoId;
  const myMongoId = req.body.follower;

  // get the username correlated to myMongoId
  let follower;
  try {
    const User = getModel<UserResponse>('User');
    const response = await User.findOne({ _id: myMongoId });
    if (!response) {
      res.status(404).send('User not found');
      return;
    }
    follower = response.username;
    console.log(`follower: ${follower}`);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error finding user');
    return;
  }

  // create new notification
  try {
    const Notification = getModel<INotification>('Notification');
    const newNotification = await Notification.create({
      title: 'Follow Request',
      type: 'follow_request',
      message: `${follower} requested to follow you!`,
      receiver: userMongoId,
      createdAt: new Date(),
      sender: myMongoId,
      status: 'pending',
    });
    res.status(200).json(newNotification);
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send('Error creating follow notification');
    return;
  }
};

export const createFollowNotification = async (req: Request, res: Response) => {
  const userMongoId = req.params.userMongoId;
  const myMongoId = req.body.follower;

  let follower;
  try {
    const User = getModel<UserResponse>('User');
    const response = await User.findOne({ _id: myMongoId });
    if (!response) {
      res.status(404).send('User not found');
      return;
    }
    follower = response.username;
    console.log(`follower: ${follower}`);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error finding user');
    return;
  }

  try {
    const Notification = getModel<INotification>('Notification');
    const newNotification = await Notification.create({
      title: 'New Follower',
      type: 'follow',
      message: `${follower} followed you!`,
      receiver: userMongoId,
      createdAt: new Date(),
      sender: myMongoId,
    });
    res.status(200).json(newNotification);
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send('Error creating follow notification');
    return;
  }
};
/**
 * Find Follow Request Notification
 * @param req
 * @param res
 * @returns
 */
export const findFollowRequestNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userMongoId } = req.params;
  const { follower } = req.query;

  if (!userMongoId || !follower) {
    res.status(400).send('Username and follower are required');
    return;
  }

  try {
    const Notification = getModel<INotification>('Notification');
    const notifications = await Notification.find({
      type: 'follow_request',
      receiver: userMongoId,
      message: { $regex: follower, $options: 'i' },
    });

    if (notifications.length === 0) {
      res.status(404).send('No follow request notifications found');
      return;
    }

    res.status(200).json(true);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error finding follow request notifications');
  }
};

/**
 * Get All Notifications for a User
 * @param req
 * @param res
 * @returns
 */
export const getAllNotifications = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userMongoId = req.params.userMongoId;
  if (!userMongoId) {
    res.status(400).send('User ID is required');
    return;
  }
  try {
    const Notification = getModel<INotification>('Notification');
    const notifications = await Notification.find({ receiver: userMongoId });

    if (notifications.length === 0) {
      res.status(404).send('No notifications found');
      return;
    }
    res.status(200).json(notifications);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error retrieving notifications');
  }
};

/**
 * Update Notification
 * @param req
 * @param res
 * @returns
 */
export const updateNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { notificationId } = req.params;
  if (!notificationId) {
    res.status(400).send('Notification ID is required');
    return;
  }
  try {
    const Notification = getModel<INotification>('Notification');
    const User = getModel<UserResponse>('User');

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      res.status(404).send('Notification not found');
      return;
    }

    // Get the sender's username
    const sender = notification.sender;
    const senderUser = await User.findOne({ _id: sender });
    if (!senderUser) {
      res.status(404).send('User not found');
      return;
    }

    const senderUsername = senderUser.username;

    // Update the notification
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      {
        title: 'New Follower',
        type: 'follow',
        message: `${senderUsername} followed you!`,
        status: 'accepted',
      },
      { new: true }
    );

    res.status(200).json(updatedNotification);
  } catch (err) {
    console.error('Error in updateNotification:', err);
    res.status(500).send('Internal server error');
  }
};

/**
 * Delete Notification
 * @param req
 * @param res
 * @returns
 */
export const deleteNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { notificationId } = req.params;
  if (!notificationId) {
    res.status(400).send('Notification ID is required');
    return;
  }

  try {
    const Notification = getModel<INotification>('Notification');
    const notification = await Notification.findByIdAndDelete(notificationId);
    if (!notification) {
      res.status(404).send('Notification not found');
      return;
    }
    res.status(200).send('Notification deleted');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error deleting notification');
  }
};

/**
 * Get notification request by id
 * @param req
 * @param res
 * @returns
 */
export const getNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const Notification = getModel<INotification>('Notification');
    const notification = await Notification.findById(req.params.notificationId);
    if (!notification) {
      res.status(404).send('Notification not found');
      return;
    }
    res.status(200).json(notification);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error retrieving notification');
  }
};
