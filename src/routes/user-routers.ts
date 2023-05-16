import express from 'express';
import {
  getUsers,
  getUserById,
  getCurrentUser,
  updateAboutMe,
  updateAvatar,
} from '../controllers/user-controller';
import {
  idValidation,
  aboutUserValidation,
  avatarValidation,
} from '../validation/user-validation';

const route = express.Router();

route.get('/', getUsers);
route.get('/:_id', idValidation, getUserById);
route.get('/me', getCurrentUser);
route.patch('/me', aboutUserValidation, updateAboutMe);
route.patch('/me/avatar', avatarValidation, updateAvatar);

export default route;

/*
   GET /users — возвращает всех пользователей
   GET /users/:userId - возвращает пользователя по _id
   POST /users — создаёт пользователя
   PATCH /users/me — обновляет профиль
   PATCH /users/me/avatar — обновляет аватар
*/
