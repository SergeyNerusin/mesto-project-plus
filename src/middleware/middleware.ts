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
    _id: '6451f95f461617bee6fb6914',
  };
  next();
};
