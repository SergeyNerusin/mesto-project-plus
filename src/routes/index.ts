import { Router } from 'express';
import userRouter from './user-routers';
import cardRouter from './cards-routers';

const router = Router();
router.use('/users', userRouter);
router.use('/cards', cardRouter);
export default router;
