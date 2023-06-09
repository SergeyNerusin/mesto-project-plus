import { Request, Response, NextFunction } from 'express';
import { MongoError } from 'mongodb';
import { Error } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUserRequest } from '../utils/type-user-request';
import Users from '../models/user';
import AppError from '../errors/custom-errors';
import myKey from '../utils/user-key';
import { STATUS_CREATED } from '../utils/constant';

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await Users.find({});
    return res.send({ data: users });
  } catch (err) {
    return next(err);
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
    return next(err);
  }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await Users.create({
      email,
      password: hashPassword,
      name,
      about,
      avatar,
    });
    return res.status(STATUS_CREATED).send({
      data: {
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    if (
      (err as MongoError) instanceof MongoError
      && (err as MongoError).code === 11000
    ) {
      return next(AppError.conflict('User with this email already exists'));
    }
    if (err instanceof Error && err.name === 'ValidationError') {
      return next(AppError.badRequest('Incorrect data'));
    }
    return next(err);
  }
};

const getCurrentUser = async (
  req: IUserRequest,
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
  } catch (err) {
    return next(err);
  }
};

const updateAboutMe = async (
  req: IUserRequest,
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
    return next(err);
  }
};

const updateAvatar = async (
  req: IUserRequest,
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
    return next(err);
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
  } catch (err) {
    return next(err);
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
