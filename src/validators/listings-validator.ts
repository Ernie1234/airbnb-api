import Joi from 'joi';

// Define the schema for the Listing model
const titleSchema = Joi.string()
  .min(5)
  .max(100)
  .required()

  .message('Title must be between 5 and 100 characters long.');

const descriptionSchema = Joi.string()
  .min(10)
  .max(500)
  .required()
  .message('Description must be between 10 and 500 characters long.');

const priceSchema = Joi.number().greater(0).required().message('Price must be a positive number.');

const locationSchema = Joi.string().required().message('Location is required.');

const imagesSchema = Joi.array().items(Joi.string().uri().message('Each image must be a valid URL.')).optional();

const availabilitySchema = Joi.object({
  startDate: Joi.date().required().message('Start date is required.'),
  endDate: Joi.date().greater(Joi.ref('startDate')).required().message('End date must be greater than start date.'),
});

// Schema for creating a new listing
export const createListingSchema = Joi.object({
  title: titleSchema,
  description: descriptionSchema,
  price: priceSchema,
  location: locationSchema,
  images: imagesSchema,
  availability: availabilitySchema,
});

// Schema for updating an existing listing
export const updateListingSchema = Joi.object({
  title: titleSchema.optional(),
  description: descriptionSchema.optional(),
  price: priceSchema.optional(),
  location: locationSchema.optional(),
  images: imagesSchema.optional(),
  availability: availabilitySchema.optional(),
});
