// src/controllers/reservation-controller.ts
import { Request, Response } from 'express';

import HTTP_STATUS from '../constants/http-status';
import {
  noListingMsg,
  noReservationMsg,
  noUserMsg,
  reservationConflictMsg,
  serverErrorMsg,
  successReservationMsg,
} from '../constants/messages';
import Logger from '../libs/logger';
import Listing from '../models/listing';
import Reservation from '../models/reservation';
import User from '../models/user';

export const createReservation = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { listingId, startDate, endDate } = req.body;
    const userId = req.user?.userId;

    // Check if user exists
    const user = await User.findById(userId).select('-password');
    if (!user) {
      Logger.error(noUserMsg);
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: noUserMsg,
      });
    }

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      Logger.error(noListingMsg);
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: noListingMsg,
      });
    }

    // Check for conflicting reservations
    const conflictingReservation = await Reservation.findOne({
      listingId,
      $or: [{ startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }],
    });

    if (conflictingReservation) {
      Logger.error(reservationConflictMsg);
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: reservationConflictMsg,
      });
    }

    // Calculate total price
    // eslint-disable-next-line max-len
    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = days * listing.price;

    // Create reservation
    const reservation = new Reservation({
      userId,
      listingId,
      startDate,
      endDate,
      totalPrice,
    });

    await reservation.save();

    // Update user's reservations
    user.Reservations.push(reservation.id);
    await user.save();

    Logger.info(`Reservation created: ${reservation.id}`);

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: successReservationMsg,
      data: reservation,
    });
  } catch (error) {
    Logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: serverErrorMsg,
    });
  }
};

export const getReservations = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.userId;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const reservations = await Reservation.find({ userId })
      .populate('listingId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalReservations = await Reservation.countDocuments({ userId });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Reservations fetched successfully',
      data: {
        reservations,
        total: totalReservations,
        page: Number(page),
        limit: Number(limit),
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

export const getReservationById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { reservationId } = req.params;
    const userId = req.user?.userId;

    const reservation = await Reservation.findOne({
      _id: reservationId,
      userId,
    }).populate('listingId');

    if (!reservation) {
      Logger.error(noReservationMsg);
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: noReservationMsg,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Reservation fetched successfully',
      data: reservation,
    });
  } catch (error) {
    Logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: serverErrorMsg,
    });
  }
};

export const cancelReservation = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { reservationId } = req.params;
    const userId = req.user?.userId;

    // Find and delete the reservation
    const reservation = await Reservation.findOneAndDelete({
      _id: reservationId,
      userId,
    });

    if (!reservation) {
      Logger.error(noReservationMsg);
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: noReservationMsg,
      });
    }

    // Remove reservation from user's reservations array
    await User.updateOne({ _id: userId }, { $pull: { Reservations: reservationId } });

    Logger.info(`Reservation canceled: ${reservationId}`);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Reservation canceled successfully',
    });
  } catch (error) {
    Logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: serverErrorMsg,
    });
  }
};
