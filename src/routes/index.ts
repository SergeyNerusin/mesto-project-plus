import {
  Router, Request, Response, NextFunction, 
} from 'express';
import userRouter from './user-routers';
import cardRouter from './cards-routers';
import AppError from '../errors/custom-errors';

const router = Router();
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});

export default router;
