import {
  Router, Request, Response, NextFunction, 
} from 'express';
import userRouter from './user-routers';
import cardRouter from './cards-routers';
import AppError from '../errors/custom-errors';

const router = Router();
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req: Request, res: Response, next: NextFunction) => next(AppError.notFound('Resource is not found')));

export default router;
