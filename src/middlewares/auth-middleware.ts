/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable implicit-arrow-linebreak */
import { Request, Response, NextFunction, RequestHandler } from 'express';
import Joi, { Schema } from 'joi';

import {
  emailVerificationSchema,
  forgetPasswordSchema,
  resendCodeSchema,
  resetPasswordSchema,
  userLoginSchema,
  userRegistrationSchema,
} from '@validators/auth-validator';
import { verifyToken } from '@utils/jwt';
import Logger from '@libs/logger';

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

export const validateUserRegistration = validateFn(userRegistrationSchema);
export const validateUserResend = validateFn(resendCodeSchema);
export const validateVerificationCode = validateFn(emailVerificationSchema);
export const validateUserLogin = validateFn(userLoginSchema);
export const validateForgetPassword = validateFn(forgetPasswordSchema);

export const validateResetPassword = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;
  const { password } = req.body;
  const { error, value } = resetPasswordSchema.validate({ token, password }, { abortEarly: false });

  if (error) {
    res.status(400).send(formatJoiError(error));
    return;
  }

  req.body = value;
  next();
};

// eslint-disable-next-line consistent-return
export const authenticationJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No Token provided!' });
  }

  try {
    // Verify the token
    req.user = verifyToken(token);
    next();
  } catch (error) {
    Logger.error(error);
    return res.status(403).json({ message: 'Invalid or expired Token!' });
  }
};
