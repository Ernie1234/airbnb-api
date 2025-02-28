import { Request, Response } from 'express';
import Logger from '@libs/logger';
import HTTP_STATUS from '@constants/http-status';
import { serverErrorMsg } from '@constants/messages';

export const getAllListings = async (req: Request, res: Response): Promise<Response> => {
  try {
    Logger.info('User Listings');
    // Here you would normally handle login logic (e.g., checking credentials)
    return res.status(HTTP_STATUS.OK).json({ message: 'Listings successfully fetched!' });
  } catch (error) {
    Logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: serverErrorMsg });
  }
};

export const getListing = async (req: Request, res: Response): Promise<Response> => {
  try {
    Logger.info('Login user');
    // Here you would normally handle login logic (e.g., checking credentials)
    return res.status(HTTP_STATUS.OK).json({ message: 'User logged in successfully' });
  } catch (error) {
    Logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: serverErrorMsg });
  }
};
