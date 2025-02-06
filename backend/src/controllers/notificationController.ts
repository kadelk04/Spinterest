import { Request, Response } from 'express';
import { getModel } from '../utils/connection';
import { INotification } from '../models/Notification';
/**
 * Create notification
 * @param req
 * @param res
 * @returns
 */
export const createFollowNotification = async (
  req: Request,
  res: Response
): Promise<void> => {};

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
