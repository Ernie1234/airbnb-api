import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';

import HTTP_STATUS from '@constants/http-status';
import { createdMsg, invalidCredentialsMsg, serverErrorMsg, userAlreadyExist } from '@constants/messages';
import Logger from '@libs/logger';
import User from '@models/user';
import { generateVerificationToken } from '@utils/generate-functions';
import { generateAccessToken } from '@utils/jwt';

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password, firstName, lastName, confirmPassword } = req.body;
    const name = `${firstName} ${lastName}`;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      Logger.error(userAlreadyExist);
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: userAlreadyExist,
      });
    }

    if (password !== confirmPassword) {
      Logger.error('Passwords do not match');
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Passwords do not match',
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

    // generateAccessToken({ role: userObject.role, userId: userObject.id });
    // await sendVerificationEmail(user?.email as string, verificationToken);

    Logger.info(`User created: ${userObject.id}`);

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: createdMsg,
      user: {
        ...userObject,
        password: undefined,
        verificationToken,
      },
    });
  } catch (error) {
    Logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: serverErrorMsg,
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email,
    });
    if (!user) {
      Logger.error(invalidCredentialsMsg);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: invalidCredentialsMsg,
      });
    }

    if (typeof user.password !== 'string') {
      Logger.error('User password is not a string');
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: invalidCredentialsMsg,
      });
    }
    // Compare provided password with stored hashed password
    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      Logger.error(invalidCredentialsMsg);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: invalidCredentialsMsg,
      });
    }

    const token = generateAccessToken({ role: user.role, userId: user.id });
    Logger.info(`User logged in: ${user.id} with token: ${token}`);

    user.lastLogin = new Date();
    await user.save();

    const userObject = user.toObject();

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Sign-in successful',
      user: {
        ...userObject,
        password: undefined,
      },
    });
  } catch (error) {
    Logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: serverErrorMsg,
    });
  }
};
