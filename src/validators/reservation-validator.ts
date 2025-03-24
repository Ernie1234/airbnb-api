// src/validators/reservation-validator.ts
import Joi from 'joi';

export const createReservationSchema = Joi.object({
  listingId: Joi.string()
    .pattern(/^[\dA-Fa-f]{24}$/)
    .required()
    .messages({
      'string.base': 'Listing ID must be a string',
      'string.empty': 'Listing ID cannot be empty',
      'string.pattern.base': 'Listing ID is invalid',
      'any.required': 'Listing ID is required',
    }),
  startDate: Joi.date().required().messages({
    'date.base': 'Start date must be a valid date',
    'any.required': 'Start date is required',
  }),
  endDate: Joi.date().greater(Joi.ref('startDate')).required().messages({
    'date.base': 'End date must be a valid date',
    'date.greater': 'End date must be after start date',
    'any.required': 'End date is required',
  }),
});

export const reservationIdValidationSchema = Joi.object({
  reservationId: Joi.string()
    .pattern(/^[\dA-Fa-f]{24}$/)
    .required()
    .messages({
      'string.base': 'Reservation ID must be a string',
      'string.empty': 'Reservation ID cannot be empty',
      'string.pattern.base': 'Reservation ID is invalid',
      'any.required': 'Reservation ID is required',
    }),
});
