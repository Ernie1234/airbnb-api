import { Request, Response, NextFunction } from 'express';
import Joi, { Schema } from 'joi';

import { createListingSchema, updateListingSchema } from '../validators/listings-validator';

const formatJoiError = (error: Joi.ValidationError) => {
  const formattedError: { [key: string]: string } = {};
  // eslint-disable-next-line unicorn/no-array-for-each
  error.details.forEach((detail: Joi.ValidationErrorItem) => {
    formattedError[detail.path.join('.')] = detail.message;
  });
  return formattedError;
};

const validateFn = <T>(schema: Schema<T>, req: Request, res: Response, next: NextFunction) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(formatJoiError(error));
  }
  req.body = value as T;
  return next();
};

export const validateCreateListing = async (req: Request, res: Response, next: NextFunction) => {
  validateFn(createListingSchema, req, res, next);
};

export const validateUpdateListing = async (req: Request, res: Response, next: NextFunction) => {
  validateFn(updateListingSchema, req, res, next);
};
