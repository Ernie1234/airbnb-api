/* eslint-disable max-len */
import { Request, Response } from 'express';

import Logger from '../libs/logger';
import HTTP_STATUS from '../constants/http-status';
import { noPropertyMsg, noUserMsg, propertyExistMsg, serverErrorMsg, successPropertyMsg } from '../constants/messages';
import User from '../models/user';
import Listing from '../models/listing';

interface ListingQuery {
  category?: string;
  price?: {
    $gte?: number;
    $lte?: number;
  };
}

type SortOptions = {
  price?: 1 | -1;
  createdAt?: 1 | -1;
};

export const createListing = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { title, description, price, location, images, category, bathroomCount, roomCount, guestCount } = req.body;

    // Validate images
    if (!Array.isArray(images) || images.length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'At least one image is required.',
      });
    }

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
    const { category, minPrice, maxPrice, sortBy, page = 1, limit = 10 } = req.query;
    Logger.info(`Received query parameters: ${JSON.stringify(req.query)}`);

    // Define the query object
    const query: ListingQuery = {};
    if (category && typeof category === 'string') {
      query.category = category.trim();
    }
    if (minPrice) {
      query.price = { $gte: Number(minPrice) };
    }
    if (maxPrice) {
      query.price = { ...query.price, $lte: Number(maxPrice) };
    }

    // Define the sort options
    const sortOptions: SortOptions = {};
    if (sortBy === 'priceAsc') {
      sortOptions.price = 1;
    } else if (sortBy === 'priceDesc') {
      sortOptions.price = -1;
    } else {
      sortOptions.createdAt = -1; // Default sorting
    }

    // Calculate pagination skip value
    const skip = (Number(page) - 1) * Number(limit);

    // Fetch listings with query, sorting, and pagination
    // eslint-disable-next-line unicorn/no-array-callback-reference
    const allListings = await Listing.find(query) // Pass the query object directly
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    // Get the total number of listings matching the query
    const totalListings = await Listing.countDocuments(query);

    Logger.info('All properties fetched successfully');
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: successPropertyMsg,
      data: {
        listings: allListings,
        total: totalListings,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    Logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: serverErrorMsg });
  }
};

export const getListing = async (req: Request, res: Response): Promise<Response> => {
  try {
    const listing = await Listing.findById(req.params.listingId).populate('userId');
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
