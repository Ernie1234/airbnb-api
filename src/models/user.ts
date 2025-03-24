import mongoose, { Document, Schema } from 'mongoose';

// eslint-disable-next-line no-shadow
export enum ERole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: ERole;
  imageSrc: string;
  isActive: boolean;
  isVerified: boolean;
  lastLogin?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  verificationToken?: string;
  verificationTokenExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  favouriteIds: string[];
  Listings: mongoose.Types.ObjectId[];
  Reservations: mongoose.Types.ObjectId[];
}

// Define the User schema
const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      minlength: 2,
      required: true,
    },
    imageSrc: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(ERole),
      default: ERole.USER,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    verificationToken: { type: String },
    verificationTokenExpiresAt: { type: Date },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    favouriteIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
      },
    ],
    Listings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing', // Ensure this matches the Listing model name
      },
    ],
    Reservations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation', // Ensure this matches the Reservation model name
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        const transformedRet = { ...ret };
        delete transformedRet.password; // Exclude password from JSON output
        delete transformedRet.__v; // Exclude version key
        transformedRet.id = transformedRet._id; // Include id field
        delete transformedRet._id; // Remove _id field
        return transformedRet;
      },
    },
  },
);

export default mongoose.model<IUser>('User', UserSchema);
