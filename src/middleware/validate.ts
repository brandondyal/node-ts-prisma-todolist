import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from './error';

export const validateBody =
  (schema: Joi.ObjectSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const { body } = req;

    const { error } = schema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(',');
      throw new ValidationError(message, 'BadRequestError');
    }
    next();
  };

export const validateQueryParams =
  (schema: Joi.ObjectSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const { query } = req;
    const { error } = schema.validate(query, {
      abortEarly: false,
    });

    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(',');
      throw new ValidationError(message, 'BadRequestError');
    }
    next();
  };
