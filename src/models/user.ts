import { model, Schema, Document } from 'mongoose';
import checkStringLength from '../utils/string-length';
import regUrl from '../utils/constant';

export interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => checkStringLength(v, 2, 30),
      message: 'Имя должно быть от 2 до 30 символов',
    },
  },
  about: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => checkStringLength(v, 2, 200),
      message: 'Информация о пользователе должна быть от 2 до 200 символов',
    },
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => regUrl.test(v),
      message: 'Некорректная ссылка на аватар',
    },
  },
});

export default model<IUser>('user', userSchema);
