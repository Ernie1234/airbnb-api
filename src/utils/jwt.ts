import jwt from 'jsonwebtoken';

import Logger from '@libs/logger';
import { ERole } from '@models/user';
import envConfig from '../config/env-config';

const { JWT_SECRET } = envConfig;

export interface UserPayload {
  userId: string;
  role: ERole;
}

// Generate a JWT for a user
export const generateAccessToken = (userPayload: UserPayload) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1h' });
};

// Verify a JWT
export const verifyToken = (token: string): UserPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    Logger.error(error);
    throw new Error('Invalid token');
  }
};
