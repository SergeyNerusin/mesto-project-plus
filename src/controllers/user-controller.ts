import { Request, Response, NextFunction } from 'express';
import { ITestRequest } from '../middleware/middleware';
import Users from '../models/user';
import AppError from '../errors/custom-errors';

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await Users.find({});
    return res.send({ data: users });
  } catch (err) {
    next(AppError.serverError('Server error'));
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.params;
  try {
    const user = await Users.findById(_id);
    if (!user) {
      return next(AppError.notFound('User not found'));
    }
    return res.send({ data: user });
  } catch (err) {
    if (err instanceof Error) {
      return next(AppError.badRequest('Incorrect data'));
    }
    next(AppError.serverError('Server error'));
  }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await Users.create({ name, about, avatar });
    return res.send({ data: user });
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return next(AppError.badRequest('Incorrect data'));
    }
    next(AppError.serverError('Server error'));
  }
};

const updateAboutMe = async (
  req: ITestRequest,
  res: Response,
  next: NextFunction,
) => {
  const _id = req.user?._id;
  const { name, about } = req.body;
  try {
    const user = await Users.findByIdAndUpdate(
      _id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(AppError.notFound('User not found'));
    }
    return res.send({ data: user });
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return next(AppError.badRequest('Incorrect data'));
    }
    next(AppError.serverError('Server error'));
  }
};

const updateAvatar = async (
  req: ITestRequest,
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;
  const _id = req.user?._id;
  try {
    if (!avatar) {
      return next(AppError.badRequest('Invalid avatar link'));
    }
    const user = await Users.findByIdAndUpdate(
      _id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(AppError.notFound('User not found'));
    }
    return res.send({ data: user });
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return next(AppError.badRequest('Incorrect data'));
    }
    next(AppError.serverError('Server error'));
  }
};

export {
  getUsers, getUserById, createUser, updateAboutMe, updateAvatar, 
};
