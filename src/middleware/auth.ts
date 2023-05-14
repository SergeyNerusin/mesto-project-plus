import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import myKey from '../utils/user-key';
import AppError from '../errors/custom-errors';

interface IAuthRequest extends Request {
  user?: string | JwtPayload;
}

export default (req: IAuthRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return AppError.unathorized('Authorization required');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.CRYPTO_KEY || myKey);
  } catch {
    return AppError.unathorized('Authorization required');
  }

  req.user = payload as { _id: JwtPayload }; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
