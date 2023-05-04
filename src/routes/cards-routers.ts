import express from 'express';
import {
  getCards,
  createCard,
  putLikeCard,
  deleteLikeCard,
  deleteCard,
} from '../controllers/card-controller';

const route = express.Router();

route.get('/', getCards);
route.post('/', createCard);
route.put('/:cardId/likes', putLikeCard);
route.delete('/:cardId/likes', deleteLikeCard);
route.delete('/:cardId', deleteCard);

export default route;

/*
   GET /cards — возвращает все карточки
   POST /cards — создаёт карточку
   PUT /cards/:cardId/likes — поставить лайк карточке
   DELETE /cards/:cardId/likes — убрать лайк с карточки
   DELETE /cards/:cardId — удаляет карточку по идентификатору
*/
