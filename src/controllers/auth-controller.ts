import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';

import HTTP_STATUS from '../constants/http-status';
import { createdMsg, invalidCredentialsMsg, serverErrorMsg, userAlreadyExist } from '../constants/messages';
import Logger from '../libs/logger';
import User from '../models/user';
import { generateVerificationToken } from '../utils/generate-functions';
import { generateAccessToken } from '../utils/jwt';

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

    generateAccessToken({ role: userObject.role, userId: userObject.id });
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

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      Logger.error(invalidCredentialsMsg);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: invalidCredentialsMsg,
      });
    }
    // if (!existingUser) {
    //   Logger.error(invalidCredentialsMsg);
    //   return res.status(HTTP_STATUS.BAD_REQUEST).json({
    //     success: false,
    //     message: invalidCredentialsMsg,
    //   });
    // }

    if (typeof existingUser.password !== 'string') {
      Logger.error('User password is not a string');
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: invalidCredentialsMsg,
      });
    }
    // Compare provided password with stored hashed password
    const isMatch = await bcryptjs.compare(password, existingUser.password);

    if (!isMatch) {
      Logger.error(invalidCredentialsMsg);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: invalidCredentialsMsg,
      });
    }

    const token = generateAccessToken({ role: existingUser.role, userId: existingUser.id });
    Logger.info(`User logged in: ${existingUser.id} with token: ${token}`);

    existingUser.lastLogin = new Date();
    await existingUser.save();

    const userObject = existingUser.toObject();

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Sign-in successful',
      user: {
        ...userObject,
        token,
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

export const checkSession = async (req: Request, res: Response): Promise<Response> => {
  try {
    const idUser = req.user?.userId;

    const user = await User.findById(idUser);
    if (!user) {
      Logger.error('User not found');
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Session is valid.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    Logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to check session.',
    });
  }
};
