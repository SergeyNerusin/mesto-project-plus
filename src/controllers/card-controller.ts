import { Request, Response, NextFunction } from 'express';
import { IUserRequest } from '../utils/type-user-request';
import Cards from '../models/card';
import AppError from '../errors/custom-errors';
import { STATUS_CREATED } from '../utils/constant';

const getCards = (req: Request, res: Response, next: NextFunction) => Cards.find({})
  .then((cards) => res.send({ data: cards }))
  .catch((err) => next(err));

const createCard = (req: IUserRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user?._id;
  return Cards.create({ name, link, owner })
    .then((card) => {
      res.status(STATUS_CREATED).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof Error && err.name === 'ValidationError') {
        return next(AppError.badRequest('Incorrect data'));
      }
      return next(err);
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
      return next(err);
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
      return next(err);
    });
};

const deleteCard = (req: IUserRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const owner = req.user?._id;
  Cards.findById(cardId)
    .then((cardDelete) => {
      if (!cardDelete) {
        throw AppError.notFound('Card not found');
      }
      if (cardDelete.owner.toString() !== owner) {
        return next(
          AppError.forbidden('You do not have the right to delete card'),
        );
      }
      return cardDelete.deleteOne().then(() => res.send({ data: cardDelete }));
    })
    .catch((err) => {
      if (err instanceof Error && err.name === 'CastError') {
        return next(AppError.badRequest('Incorrect data'));
      }
      return next(err);
    });
};

export {
  getCards, putLikeCard, createCard, deleteLikeCard, deleteCard,
};
