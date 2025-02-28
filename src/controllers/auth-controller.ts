import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';

import HTTP_STATUS from '@constants/http-status';
import { serverErrorMsg, userAlreadyExist } from '@constants/messages';
import Logger from '@libs/logger';
import User from '@models/user';
import { generateVerificationToken } from '@utils/generate-functions';

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const name = `${firstName} ${lastName}`;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      Logger.error(userAlreadyExist);
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: userAlreadyExist,
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = generateVerificationToken();

    const newUser = new User({
      email,
      name,
      verificationToken,
      password: hashedPassword,
      verificationTokenExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await newUser.save();
    const userObject = newUser.toObject();

    return res.status(HTTP_STATUS.CREATED).json({ message: 'User registered successfully' });
  } catch (error) {
    Logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: serverErrorMsg });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    Logger.info('Login user');
    // Here you would normally handle login logic (e.g., checking credentials)
    return res.status(HTTP_STATUS.OK).json({ message: 'User logged in successfully' });
  } catch (error) {
    Logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: serverErrorMsg });
  }
};
