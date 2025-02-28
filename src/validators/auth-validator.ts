import Joi from 'joi';

import { emailRequiredMsg, invalidEmailMsg, pwdRequiredMsg } from '../constants/messages';

export const userRegistrationSchema = Joi.object({
  firstName: Joi.string()
    .min(1)
    .max(50)
    .required()

    .messages({
      'string.base': 'First name must be a string',
      'string.empty': 'First name cannot be empty',
      'string.min': 'First name must be at least 1 character long',
      'string.max': 'First name must be less than or equal to 50 characters long',
      'any.required': 'First name is required',
    }),

  lastName: Joi.string()
    .min(1)
    .max(50)
    .required()

    .messages({
      'string.base': 'Last name must be a string',
      'string.empty': 'Last name cannot be empty',
      'string.min': 'Last name must be at least 1 character long',
      'string.max': 'Last name must be less than or equal to 50 characters long',
      'any.required': 'Last name is required',
    }),
  password: Joi.string()
    .min(8)
    .required()
    .trim()

    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'any.required': pwdRequiredMsg,
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .trim()

    .messages({
      'any.only': 'Passwords must match',
      'any.required': 'Confirm Password is required',
    }),

  email: Joi.string()
    .email()
    .required()
    .trim()

    .messages({
      'string.email': invalidEmailMsg,
      'any.required': emailRequiredMsg,
    }),
});

export const resendCodeSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .trim()

    .messages({
      'string.email': invalidEmailMsg,
      'any.required': emailRequiredMsg,
    }),
});

export const emailVerificationSchema = Joi.object({
  verificationCode: Joi.string().length(6).required().messages({
    'string.length': 'Verification code must be exactly 6 characters long',
    'any.required': 'Verification code is required',
  }),
});

export const userLoginSchema = Joi.object({
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'any.required': pwdRequiredMsg,
  }),
  email: Joi.string()
    .email()
    .required() // Ensure there's a line break before this
    .messages({
      'string.email': 'Email must be a valid email address',
      'any.required': emailRequiredMsg,
    }),
});

export const forgetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': emailRequiredMsg,
  }),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Token is required',
    'any.required': 'Token is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': pwdRequiredMsg,
    'string.min': 'Password must be at least 6 characters long',
    'any.required': pwdRequiredMsg,
  }),
});
