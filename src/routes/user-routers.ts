import express from 'express';
import {
  getUsers,
  createUser,
  updateAboutMe,
} from '../controllers/user-controller';

const route = express.Router();

route.get('/', getUsers);
route.get('/:_id', getUsers);
route.post('/', createUser);
route.post('/:_id', createUser);
route.patch('/me', updateAboutMe);
route.patch('/me/avatar', updateAboutMe);

export default route;

/*
   GET /users — возвращает всех пользователей
   GET /users/:userId - возвращает пользователя по _id
   POST /users — создаёт пользователя
   PATCH /users/me — обновляет профиль
   PATCH /users/me/avatar — обновляет аватар
*/
