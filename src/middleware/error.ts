import { NextFunction, Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export class ValidationError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Error.captureStackTrace(this);
  }
}

const statusCodeMap: Record<string, number> = {
  BadRequestError: 400,
  NotFoundError: 404,
  P2025: 404,
  P2003: 404,
  P2002: 409,
};

export const errorHandler = (
  error: PrismaClientKnownRequestError | ValidationError,
  _request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  const { code, name, message } = error;
  const status = statusCodeMap[code] || statusCodeMap[name] || 500;

  response.status(status).end(message);
};

export const invalidPathHandler = (
  _request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  response.status(404).end('THESE ARE NOT THE DROIDS YOU ARE LOOKING FOR');
};
