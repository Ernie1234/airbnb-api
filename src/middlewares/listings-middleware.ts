/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable implicit-arrow-linebreak */
import { Request, Response, NextFunction, RequestHandler } from 'express';
import Joi, { Schema } from 'joi';

import { createListingSchema, updateListingSchema } from '@validators/listings-validator';

const formatJoiError = (error: Joi.ValidationError): Record<string, string> =>
  // eslint-disable-next-line implicit-arrow-linebreak
  Object.fromEntries(error.details.map((detail) => [detail.path.join('.'), detail.message]));
// eslint-disable-next-line operator-linebreak
const validateFn =
  <T>(schema: Schema<T>): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      res.status(400).send(formatJoiError(error));
      return;
    }
    req.body = value as T;
    next();
  };

export const validateCreateListing = validateFn(createListingSchema);
export const validateUpdateListing = validateFn(updateListingSchema);
