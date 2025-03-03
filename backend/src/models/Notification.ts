import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { IUser } from './User';
import { send } from 'process';

export interface INotification {
  title: string;
  type: 'new_playlist' | 'saved_playlist' | 'follow_request' | 'like';
  receiver: mongoose.Types.ObjectId[];
  sender: mongoose.Types.ObjectId;
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
      'follow',
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
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
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
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  expiresAt: {
    type: Date,
  },
});

NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 604800 }); // 1 week = 604800 seconds
