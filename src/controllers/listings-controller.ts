/* eslint-disable max-len */
import { Request, Response } from 'express';

import Logger from '@libs/logger';
import HTTP_STATUS from '@constants/http-status';
import { noPropertyMsg, noUserMsg, propertyExistMsg, serverErrorMsg, successPropertyMsg } from '@constants/messages';
import User from '@models/user';
import Listing from '@models/listing';

interface ListingQuery {
  category?: string;
}

export const createListing = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { title, description, price, location, images, category, bathroomCount, roomCount, guestCount } = req.body;

    const user = await User.findById(req.user?.userId).select('-password');
    if (!user) {
      Logger.error(noUserMsg);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: noUserMsg });
    }

    // Create new listing
    const newListing = new Listing({
      title,
      description,
      price,
      location,
      imageSrc: images,
      category,
      bathroomCount,
      roomCount,
      guestCount,
      userId: user.id,
    });
    await newListing.save();

    Logger.info(`Property created successfully: ${newListing}`);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: propertyExistMsg,
      data: newListing,
    });
  } catch (error) {
    Logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: serverErrorMsg });
  }
};
export const getAllListings = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { category } = req.query;
    Logger.info(`Received category query: ${category}`);

    const query: ListingQuery = {};
    if (category && typeof category === 'string') {
      query.category = category.trim();
      Logger.info(`Querying for category: ${query.category}`);
    }

    // const allListings = await Listing.find({ ...query }).sort({ createdAt: -1 });

    const allListings = await Listing.aggregate([
      { $match: query }, // Filter by category
      { $sort: { createdAt: -1 } }, // Sort by createdAt
    ]);
    Logger.info(`Query executed: ${JSON.stringify(query)}`);
    Logger.info('All properties fetched successfully');
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: successPropertyMsg,
      data: allListings,
    });
  } catch (error) {
    Logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: serverErrorMsg });
  }
};
export const getListing = async (req: Request, res: Response): Promise<Response> => {
  try {
    const listing = await Listing.findById(req.params.listingId);
    if (!listing) {
      Logger.error(noPropertyMsg);
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: noPropertyMsg });
    }

    Logger.info(`${successPropertyMsg}: ${listing}`);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: successPropertyMsg,
      data: listing,
    });
  } catch (error) {
    Logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: serverErrorMsg });
  }
};
