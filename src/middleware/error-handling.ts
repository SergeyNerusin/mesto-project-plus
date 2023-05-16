import { Request, Response, NextFunction } from 'express';
import AppError from '../errors/custom-errors';

export default (
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction,
) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? 'Server error' : message });
};
