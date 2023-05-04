import { Request, Response } from 'express';
import { ITestRequest } from '../middleware/middleware';
import Cards from '../models/card';
import AppError from '../errors/custom-errors';

const getCards = (req: Request, res: Response) => Cards.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

const createCard = (req: ITestRequest, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user?._id;
  return Cards.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const putLikeCard = (req: ITestRequest, res: Response) => {
  const _id = req.user?._id;
  const { cardId } = req.params;
  return Cards.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const deleteLikeCard = (req: ITestRequest, res: Response) => {
  const _id = req.user?._id;
  const { cardId } = req.params;
  return Cards.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const deleteCard = (req: ITestRequest, res: Response) => {
  const { cardId } = req.params;
  return Cards.findByIdAndDelete(cardId)
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export {
  getCards, putLikeCard, createCard, deleteLikeCard, deleteCard, 
};
