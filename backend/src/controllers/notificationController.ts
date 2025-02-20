import { Request, Response } from 'express';
import { getModel } from '../utils/connection';
import { INotification } from '../models/Notification';
import mongoose from 'mongoose';
import axios from 'axios';
/**
 * Create notification
 * @param req
 * @param res
 * @returns
 */
export const createFollowNotification = async (req: Request, res: Response) => {
  console.log('in createNotification in notificationController.ts');
  const toBeFollowed = req.params;
  const { follower, testUsername } = req.body;
  console.log('this is testUsername: ', testUsername);
  console.log(`username: ${toBeFollowed}, follower: ${follower}`);
  if (!testUsername || !follower) {
    throw new Error('testUserName or follower is undefined');
  }
  console.log(`username: ${toBeFollowed}, follower: ${follower}`);

  // need to get the mongoose.Types.ObjectId of toBeFollowed for receiver param
  let toBeFollowedObjectId;
  try {
    // can use getUserByUsername in UserController.ts
    const response = await axios.get(
      `http://localhost:8000/api/user/${toBeFollowed}`
    );
    toBeFollowedObjectId = response.data._id;
    console.log(`toBeFollowedObjectId: ${toBeFollowedObjectId}`);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error finding user');
    return;
  }

  // create new notification
  try {
    const Notification = getModel<INotification>('Notification');
    const newNotification = new Notification({
      title: 'Follow',
      type: 'follow_request',
      message: `${follower} followed you!`,
      receiver: [toBeFollowedObjectId],
      createdAt: new Date(),
    });
    await newNotification.save();
    res.status(200).json(newNotification);
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send('Error creating follow notification');
    return;
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
): Promise<void> => {};

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
