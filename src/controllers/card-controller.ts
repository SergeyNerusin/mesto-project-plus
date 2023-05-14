import { Request, Response, NextFunction } from 'express';
import { IUserRequest } from '../utils/type-user-request';
import Cards from '../models/card';
import AppError from '../errors/custom-errors';

const getCards = (req: Request, res: Response, next: NextFunction) => Cards.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(() => next(AppError.serverError('Server error')));

const createCard = (req: IUserRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user?._id;
  return Cards.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof Error && err.name === 'ValidationError') {
        return next(AppError.badRequest('Incorrect data'));
      }
      return next(AppError.serverError('Server error'));
    });
};

const putLikeCard = (req: IUserRequest, res: Response, next: NextFunction) => {
  const _id = req.user?._id;
  const { cardId } = req.params;
  return Cards.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw AppError.notFound('Card not found');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof Error && err.name === 'CastError') {
        return next(AppError.badRequest('Incorrect data'));
      }
      return next(AppError.serverError('Server error'));
    });
};

const deleteLikeCard = (
  req: IUserRequest,
  res: Response,
  next: NextFunction,
) => {
  const _id = req.user?._id;
  const { cardId } = req.params;
  return Cards.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw AppError.notFound('Card not found');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof Error && err.name === 'CastError') {
        return next(AppError.badRequest('Incorrect data'));
      }
      return next(AppError.serverError('Server error'));
    });
};

const deleteCard = (req: IUserRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  return Cards.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        throw AppError.notFound('Card not found');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof Error && err.name === 'CastError') {
        return next(AppError.badRequest('Incorrect data'));
      }
      return next(AppError.serverError('Server error'));
    });
};

export {
  getCards, putLikeCard, createCard, deleteLikeCard, deleteCard, 
};
