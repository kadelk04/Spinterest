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
): Promise<void> => {};

/**
 * Delete Notification
 * @param req
 * @param res
 * @returns
 */
export const deleteNotification = async (
  req: Request,
  res: Response
): Promise<void> => {};

/**
 * Accept or Reject Follow Request
 * @param req
 * @param res
 * @returns
 */
export const respondToFollowRequest = async (
  req: Request,
  res: Response
): Promise<void> => {};
