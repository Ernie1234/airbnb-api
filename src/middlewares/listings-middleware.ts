/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import Joi, { Schema } from 'joi';

import { createListingSchema, objectIdValidationSchema, updateListingSchema } from '@validators/listings-validator';

const formatJoiError = (error: Joi.ValidationError) => {
  const formattedError: { [key: string]: string } = {};
  // eslint-disable-next-line unicorn/no-array-for-each
  error.details.forEach((detail: Joi.ValidationErrorItem) => {
    formattedError[detail.path.join('.')] = detail.message;
  });
  return formattedError;
};
// eslint-disable-next-line operator-linebreak
const validateFn = <T extends Record<string, any>>(
  schema: Schema<T>,
  data: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error, value } = schema.validate(data);
  if (error) {
    return res.status(400).send(formatJoiError(error));
  }
  // Assign the validated value back to the request body or params as needed
  if (req.body === data) {
    req.body = value as T;
  } else {
    req.params = value as T;
  }
  return next();
};

export const validateCreateListing = async (req: Request, res: Response, next: NextFunction) =>
  validateFn(createListingSchema, req.body, req, res, next);
export const validateUpdateListing = async (req: Request, res: Response, next: NextFunction) =>
  validateFn(updateListingSchema, req.body, req, res, next);
export const validateListingId = async (req: Request, res: Response, next: NextFunction) =>
  validateFn(objectIdValidationSchema, req.params, req, res, next);
