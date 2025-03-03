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
export const createFollowNotification = async (req: Request, res: Response) => {
  console.log('in createNotification in notificationController.ts');
  const toBeFollowed = req.params.username;
  const { follower, privacy } = req.body;
  console.log(`username: ${toBeFollowed}, follower: ${follower}`);
  if (!toBeFollowed || !follower) {
    throw new Error('toBeFollowed or follower is undefined');
  }
  console.log(`username: ${toBeFollowed}, follower: ${follower}`);

  // ADD SENDER FIELDDDD
  let senderObjectId;
  try {
    const User = getModel<UserResponse>('User');
    // can use getUserByUsername in UserController.ts
    const response = await User.findOne({ username: follower });
    if (!response) {
      res.status(404).send('User not found');
      return;
    }
    senderObjectId = response._id;
    console.log(`toBeFollowedObjectId: ${senderObjectId}`);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error finding user');
    return;
  }



  // need to get the mongoose.Types.ObjectId of toBeFollowed for receiver param
  let toBeFollowedObjectId;
  try {
    const User = getModel<UserResponse>('User');
    // can use getUserByUsername in UserController.ts
    const response = await User.findOne({ username: toBeFollowed });
    if (!response) {
      res.status(404).send('User not found');
      return;
    }
    toBeFollowedObjectId = response._id;
    console.log(`toBeFollowedObjectId: ${toBeFollowedObjectId}`);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error finding user');
    return;
  }

  // create new notification
  try {
    const Notification = getModel<INotification>('Notification');
    const newNotification = await Notification.create({
      title: privacy ? 'Follow Request' : 'New Follower',
      type: privacy ? 'follow_request' : 'follow',
      message: privacy
        ? `${follower} requested to follow you!`
        : `${follower} followed you!`,
      receiver: [toBeFollowedObjectId],
      createdAt: new Date(),
      sender: senderObjectId,
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
