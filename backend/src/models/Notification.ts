import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { IUser } from './User';

export interface INotifcation {
  title: string;
  type: 'new_playlist' | 'saved_playlist' | 'follow_request' | 'like';
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId[];
  metadata?: Record<string, any>;
  status?: 'pending' | 'accepted';
  createdAt: Date;
  expiresAt?: Date;
}

export const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: [
      'like',
      'new_playlist',
      'saved_playlist',
      'follow_request',
      'follow_accept',
    ],
    required: true,
  },
  receiver: [
    // this is a list of receivers
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  metadata: {
    type: Object,
    default: {},
  },
  status: {
    type: String,
    enum: ['pending', 'accepted'], // Used only for follow requests
    default: function () {
      return (this as any).type === 'follow_request' ? 'pending' : undefined;
    },
  },
  createdAt: { type: Date, default: Date.now, required: true },
  expiresAt: {
    type: Date,
    // If the notification is a follow request, set expiration to one week
    default: function () {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1-week expiration for all notifications
    },
  },
});

NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
