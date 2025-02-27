import jwt from 'jsonwebtoken';

import Logger from '@libs/logger';
import { ERole } from '@models/user';

const SECRET_KEY = process.env.JWT_SECRET || '';

export interface UserPayload {
  userId: string;
  role: ERole;
}

// Generate a JWT for a user
export const generateToken = (userPayload: UserPayload) => {
  if (!SECRET_KEY) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign(userPayload, SECRET_KEY, { expiresIn: '1h' });
};

// Verify a JWT
export const verifyToken = (token: string): UserPayload => {
  try {
    return jwt.verify(token, SECRET_KEY) as UserPayload;
  } catch (error) {
    Logger.error(error);
    throw new Error('Invalid token');
  }
};

export const tokenBlacklist = new Set<string>();

export const blacklistToken = (token: string) => {
  tokenBlacklist.add(token);
};

// export const validateUser = async (
//   req: Request,
//   res: Response,
// ): Promise<IUserDocument | undefined> => {
//   const userPayload = req.user as UserPayload | undefined;

//   if (!userPayload || !userPayload.userId) {
//     Logger.error(noUserMsg);
//     return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: noUserMsg });
//   }

//   const user = await Users.findById(userPayload.userId).select('-password');

//   if (!user) {
//     Logger.error(noUserMsg);
//     return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: noUserMsg });
//   }

//   return user;
// };
