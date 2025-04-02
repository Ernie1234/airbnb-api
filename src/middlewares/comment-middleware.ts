/* eslint-disable consistent-return */
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

import {
  createCommentSchema,
  updateCommentSchema,
  commentIdValidationSchema,
  listingCommentsSchema,
} from '../validators/comment-validator';
import Logger from '../libs/logger';

const formatJoiError = (error: Joi.ValidationError) => {
  const formattedError: { [key: string]: string } = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const detail of error.details) {
    formattedError[detail.path.join('.')] = detail.message;
  }
  return formattedError;
};

export const validateCreateComment = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = createCommentSchema.validate(req.body);
  if (error) {
    Logger.error('Comment validation failed');
    return res.status(400).json({
      success: false,
      errors: formatJoiError(error),
    });
  }
  req.body = value;
  next();
};

export const validateUpdateComment = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = updateCommentSchema.validate(req.body);
  if (error) {
    Logger.error('Comment update validation failed');
    return res.status(400).json({
      success: false,
      errors: formatJoiError(error),
    });
  }
  req.body = value;
  next();
};

export const validateCommentId = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = commentIdValidationSchema.validate(req.params);
  if (error) {
    Logger.error('Comment ID validation failed');
    return res.status(400).json({
      success: false,
      errors: formatJoiError(error),
    });
  }
  req.params = value;
  next();
};

export const validateListingComments = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = listingCommentsSchema.validate(req.params);
  if (error) {
    Logger.error('Listing comments validation failed');
    return res.status(400).json({
      success: false,
      errors: formatJoiError(error),
    });
  }
  req.params = value;
  next();
};
