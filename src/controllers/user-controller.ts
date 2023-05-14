import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ITestRequest } from '../middleware/middleware';
import Users from '../models/user';
import AppError from '../errors/custom-errors';
import myKey from '../utils/user-key';

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
    if (err instanceof Error && err.name === 'CastError') {
      return next(AppError.badRequest('Incorrect data'));
    }
    next(AppError.serverError('Server error'));
  }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    email, password, name, about, avatar, 
  } = req.body;

  try {
    const existEmail = await Users.findOne({ email });
    if (existEmail) {
      return next(AppError.conflict('User with this email already exists'));
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await Users.create({
      email,
      password: hashPassword,
      name,
      about,
      avatar,
    });
    return res.send({
      data: {
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return next(AppError.badRequest('Incorrect data'));
    }
    next(AppError.serverError('Server error'));
  }
};

const getCurrentUser = async (
  req: ITestRequest,
  res: Response,
  next: NextFunction,
) => {
  const _id = req.user?._id;
  try {
    const currentUser = await Users.findById({ _id });
    if (!currentUser) {
      return next(AppError.unathorized('Authentication error'));
    }
    return res.send({ data: currentUser });
  } catch {
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

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      (process.env.CRYPTO_KEY as string) || myKey,
      { expiresIn: '7d' },
    );
    return res.send({ token });
  } catch {
    next(AppError.unathorized('Authentication error'));
  }
};

export {
  login,
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateAboutMe,
  updateAvatar,
};
