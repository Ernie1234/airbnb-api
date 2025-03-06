/* eslint-disable max-len */
import { Request, Response } from 'express';

import HTTP_STATUS from '../constants/http-status';
import { noUserMsg, serverErrorMsg, successPropertyMsg } from '../constants/messages';
import Logger from '../libs/logger';
import User from '../models/user';

export const createFavouriteListing = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { listingId } = req.params;

    const user = await User.findById(req.user?.userId).select('-password');
    if (!user) {
      Logger.error(noUserMsg);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: noUserMsg });
    }

    const favourited = await User.findByIdAndUpdate(user.id, { $addToSet: { favouriteIds: listingId } }, { new: true });

    Logger.info(`${successPropertyMsg}: ${favourited}`);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: successPropertyMsg,
      data: favourited,
    });
  } catch (error) {
    Logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: serverErrorMsg });
  }
};

export const getFavouriteListings = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await User.findById(req.user?.userId).populate('favouriteIds');
    if (!user) {
      Logger.error(noUserMsg);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: noUserMsg });
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Favourite listings fetched successfully',
      data: user.favouriteIds,
    });
  } catch (error) {
    Logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: serverErrorMsg });
  }
};

export const deleteFavouriteListing = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { listingId } = req.params;

    const user = await User.findById(req.user?.userId);
    if (!user) {
      Logger.error(noUserMsg);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: noUserMsg });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { $pull: { favouriteIds: listingId } }, // Use $pull to remove the specified ID
      { new: true },
    );

    Logger.info(`Favourite removed successfully for user: ${user.id}`);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Favourite listing removed successfully',
      data: updatedUser,
    });
  } catch (error) {
    Logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: serverErrorMsg });
  }
};
