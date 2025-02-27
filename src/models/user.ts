/* eslint-disable no-shadow */
import mongoose from 'mongoose';

export enum ERole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: ERole;
  isActive: boolean;
  createdAt: Date;
}

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      // sparse: true,
    },
    name: {
      type: String,
      minlength: 2,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now(),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'USER'],
      default: 'USER',
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    verificationTokenExpiresAt: Date,
    verificationToken: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notes',
      },
    ],
  },
  {
    // timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        const transformedRet = { ...ret };
        delete transformedRet.password;
        delete transformedRet.__v;
        transformedRet.id = transformedRet._id;
        delete transformedRet._id;
        return transformedRet;
      },
    },
  },
);

export default mongoose.model('User', UserSchema);
