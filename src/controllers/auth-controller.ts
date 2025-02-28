import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import user, { ERole, IUser } from '@models/user';

import HTTP_STATUS from '@constants/http-status';
import {
  createdMsg,
  invalidCredentialsMsg,
  loginSuccessMsg,
  noUserMsg,
  serverErrorMsg,
  userAlreadyExist,
} from '@constants/messages';
import Logger from '@libs/logger';
import { generateToken } from '@utils/jwt';

const isUniqueUser = async (email: string) => !user.findOne({ email });

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if email is already taken
    if (!isUniqueUser(email)) {
      Logger.error({ message: userAlreadyExist });
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: userAlreadyExist,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser: IUser = {
      name,
      email,
      password: hashedPassword,
      role: ERole.USER,
      isActive: true,
      createdAt: new Date(),
    };

    // Save the new user to the array
    user.create(newUser);

    // res.status(201).json({ message: 'User registered successfully' });

    Logger.info(`User successfully registered: ${JSON.stringify({ ...newUser, password: undefined }, undefined, 2)}`);
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: createdMsg,
    });
  } catch (error) {
    Logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: serverErrorMsg });
  }
};

//  LOGIN OR SIGNIN USER
export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;
  try {
    const existingUser = await user.findOne({
      email,
    });
    if (!existingUser) {
      Logger.error(noUserMsg);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: noUserMsg,
      });
    }

    if (typeof existingUser.password !== 'string') {
      Logger.error('User password is not a string');
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: serverErrorMsg,
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      Logger.error(invalidCredentialsMsg);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: invalidCredentialsMsg,
      });
    }

    // Generate token and set cookies
    const token = generateToken({
      userId: existingUser.id,
      role: existingUser.role as ERole,
    });
    Logger.info(`Token: ${token}`);

    existingUser.lastLogin = new Date();
    await existingUser.save();

    const userObject = existingUser.toObject();

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: loginSuccessMsg,
      user: {
        ...userObject,
        password: undefined,
        token,
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
