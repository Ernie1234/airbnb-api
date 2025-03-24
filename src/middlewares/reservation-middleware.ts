/* eslint-disable consistent-return */
// src/middlewares/reservation-middleware.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

import { createReservationSchema, reservationIdValidationSchema } from '../validators/reservation-validator';
import Logger from '../libs/logger';

const formatJoiError = (error: Joi.ValidationError) => {
  const formattedError: { [key: string]: string } = {};
  // eslint-disable-next-line unicorn/no-array-for-each
  error.details.forEach((detail) => {
    formattedError[detail.path.join('.')] = detail.message;
  });
  return formattedError;
};

export const validateCreateReservation = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = createReservationSchema.validate(req.body);
  if (error) {
    Logger.error('Reservation validation failed');
    return res.status(400).json({
      success: false,
      errors: formatJoiError(error),
    });
  }
  req.body = value;
  next();
};

export const validateReservationId = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = reservationIdValidationSchema.validate(req.params);
  if (error) {
    Logger.error('Reservation ID validation failed');
    return res.status(400).json({
      success: false,
      errors: formatJoiError(error),
    });
  }
  req.params = value;
  next();
};
