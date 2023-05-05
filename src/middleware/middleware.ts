import { Request, Response, NextFunction } from 'express';

export interface ITestRequest extends Request {
  user?: {
    _id: string;
  };
}

export const testMidllware = (
  req: ITestRequest,
  res: Response,
  next: NextFunction,
) => {
  req.user = {
    _id: '6454c6b7a9f1e4b622ef7c98',
  };
  next();
};
