/* eslint-disable newline-per-chained-call */
import Joi from 'joi';

// Define the schema for the Listing model
const titleSchema = Joi.string().min(5).max(100).required().messages({
  'string.min': 'Title must be at least 5 characters long.',
  'string.max': 'Title must be no more than 100 characters long.',
  'any.required': 'Title is required.',
});

const descriptionSchema = Joi.string().min(10).max(500).required().messages({
  'string.min': 'Description must be at least 10 characters long.',
  'string.max': 'Description must be no more than 500 characters long.',
  'any.required': 'Description is required.',
});

const priceSchema = Joi.number().greater(0).required().messages({
  'number.greater': 'Price must be a positive number.',
  'any.required': 'Price is required.',
});

const locationSchema = Joi.string().required().messages({
  'any.required': 'Location is required.',
});

const imagesSchema = Joi.array()
  .items(
    Joi.string().uri().messages({
      'string.uri': 'Each image must be a valid URL.',
    }),
  )
  .optional();

const availabilitySchema = Joi.object({
  startDate: Joi.date().required().messages({
    'any.required': 'Start date is required.',
  }),
  endDate: Joi.date().greater(Joi.ref('startDate')).required().messages({
    'date.greater': 'End date must be greater than start date.',
    'any.required': 'End date is required.',
  }),
});

const categorySchema = Joi.string().required().messages({
  'any.required': 'Category is required.',
});

const bathroomCountSchema = Joi.number().integer().min(0).required().messages({
  'number.base': 'Bathroom count must be a number.',
  'number.integer': 'Bathroom count must be an integer.',
  'any.required': 'Bathroom count is required.',
});

const roomCountSchema = Joi.number().integer().min(0).required().messages({
  'number.base': 'Room count must be a number.',
  'number.integer': 'Room count must be an integer.',
  'any.required': 'Room count is required.',
});

const guestCountSchema = Joi.number().integer().min(0).required().messages({
  'number.base': 'Guest count must be a number.',
  'number.integer': 'Guest count must be an integer.',
  'any.required': 'Guest count is required.',
});

// Schema for creating a new listing
export const createListingSchema = Joi.object({
  title: titleSchema,
  description: descriptionSchema,
  price: priceSchema,
  location: locationSchema,
  images: imagesSchema,
  category: categorySchema,
  bathroomCount: bathroomCountSchema,
  roomCount: roomCountSchema,
  guestCount: guestCountSchema,
});

// Schema for updating an existing listing
export const updateListingSchema = Joi.object({
  title: titleSchema.optional(),
  description: descriptionSchema.optional(),
  price: priceSchema.optional(),
  location: locationSchema.optional(),
  images: imagesSchema.optional(),
  availability: availabilitySchema.optional(),
  category: categorySchema.optional(),
  bathroomCount: bathroomCountSchema.optional(),
  roomCount: roomCountSchema.optional(),
  guestCount: guestCountSchema.optional(),
});
