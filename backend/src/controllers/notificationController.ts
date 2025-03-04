import { Request, Response } from 'express';
import { getModel } from '../utils/connection';
import { INotification } from '../models/Notification';
import mongoose from 'mongoose';
import axios from 'axios';

interface UserResponse {
  _id: mongoose.Types.ObjectId;
  username: string;
}

/**
 * Create notification
 * @param req
 * @param res
 * @returns
 */
export const createFollowRequestNotification = async (req: Request, res: Response) => {
  console.log('in createNotification in notificationController.ts');
  const userMongoId = req.params.userMongoId;
  const myMongoId  = req.body.follower;
  console.log(`my mongoId: ${myMongoId}`);

  // get the username correlated to myMongoId
  let follower;
  try {
    const User = getModel<UserResponse>('User');
    const response
      = await User.findOne({ _id: myMongoId });
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
      receiver: [userMongoId],
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
  console.log('in createNotification in notificationController.ts');
  const userMongoId = req.params.userMongoId;
  const myMongoId  = req.body.follower;
  console.log(`my mongoId: ${myMongoId}`);

  // get the username correlated to myMongoId
  let follower;
  try {
    const User = getModel<UserResponse>('User');
    const response
      = await User.findOne({ _id: myMongoId });
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

  console.log('in createNotification in notificationController.ts');
  try {
    const Notification = getModel<INotification>('Notification');
    const newNotification = await Notification.create({
      title: 'New Follower',
      type: 'follow',
      message: `${follower} followed you!`,
      receiver: [userMongoId],
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
  console.log('in findFollowRequestNotification in notificationController.ts');
  const { userMongoId } = req.params;
  const { follower } = req.query;
  console.log(`username: ${userMongoId}, follower: ${follower}`);
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
  console.log('in getAllNotifications in notificationController.ts');
  console.log("before", req.params.userMongoId);
  const userMongoId = req.params.userMongoId;
  //const userMongoId = new mongoose.Types.ObjectId(req.params.mongoId);

  console.log(`my mongoId: ${userMongoId}`);

  if (!userMongoId) {
    res.status(400).send('User ID is required');
    return;
  }

  try {
    console.log('in try block');
    const Notification = getModel<INotification>('Notification');
    const notifications = await Notification.find({ receiver: userMongoId });

    console.log(notifications);
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
  console.log('in updateNotification in notificationController.ts');

  const { notificationId } = req.params;
  console.log(`notificationId: ${notificationId}`);

  if (!notificationId) {
    res.status(400).send('Notification ID is required');
    return;
  }

  try {
    const Notification = getModel<INotification>('Notification');
    const User = getModel<UserResponse>('User');

    // Find the notification
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
    console.log(`senderUsername: ${senderUsername}`);

    // Update the notification
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      {
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
  console.log('in deleteNotification in notificationController.ts');
  const { notificationId } = req.params;
  console.log(`notificationId: ${notificationId}`);

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

