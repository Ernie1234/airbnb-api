/* eslint-disable newline-per-chained-call */
import Joi from 'joi';

// Define ObjectId validation (reuse your existing pattern)
const objectIdSchema = Joi.string()
  .pattern(/^[\dA-Fa-f]{24}$/)
  .required()
  .messages({
    'string.base': 'ID must be a string',
    'string.empty': 'ID cannot be empty',
    'string.pattern.base': 'ID is invalid',
    'any.required': 'ID is required',
  });

// Comment content validation
const contentSchema = Joi.string().min(10).max(5000).required().messages({
  'string.base': 'Content must be a string',
  'string.empty': 'Content cannot be empty',
  'string.min': 'Content must be at least 10 characters long',
  'string.max': 'Content must be no more than 5000 characters long',
  'any.required': 'Content is required',
});

// Rating validation (1-5 stars)
const ratingSchema = Joi.number().integer().min(1).max(5).required().messages({
  'number.base': 'Rating must be a number',
  'number.integer': 'Rating must be an integer',
  'number.min': 'Rating must be at least 1',
  'number.max': 'Rating must be at most 5',
  'any.required': 'Rating is required',
});

// Schema for creating a new comment
export const createCommentSchema = Joi.object({
  listingId: objectIdSchema.messages({
    'any.required': 'Listing ID is required',
  }),
  content: contentSchema,
  rating: ratingSchema,
});

// Schema for updating a comment
export const updateCommentSchema = Joi.object({
  content: contentSchema.optional(),
  rating: ratingSchema.optional(),
});

// Schema for comment ID validation
export const commentIdValidationSchema = Joi.object({
  commentId: objectIdSchema.messages({
    'any.required': 'Comment ID is required',
  }),
});

// Schema for getting comments by listing
export const listingCommentsSchema = Joi.object({
  listingId: objectIdSchema.messages({
    'any.required': 'Listing ID is required',
  }),
});
