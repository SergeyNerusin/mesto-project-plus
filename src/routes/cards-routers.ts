import express from 'express';
import {
  getCards,
  createCard,
  putLikeCard,
  deleteLikeCard,
  deleteCard,
} from '../controllers/card-controller';
import {
  cardDataValidation,
  idCardValidation,
} from '../validation/card-validation';

const route = express.Router();

route.get('/', getCards);
route.post('/', cardDataValidation, createCard);
route.put('/:cardId/likes', idCardValidation, putLikeCard);
route.delete('/:cardId/likes', idCardValidation, deleteLikeCard);
route.delete('/:cardId', idCardValidation, deleteCard);

export default route;

/*
   GET /cards — возвращает все карточки
   POST /cards — создаёт карточку
   PUT /cards/:cardId/likes — поставить лайк карточке
   DELETE /cards/:cardId/likes — убрать лайк с карточки
   DELETE /cards/:cardId — удаляет карточку по идентификатору
*/
