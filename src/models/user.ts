import { model, Schema } from 'mongoose';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const regUrl = /https?:\/\/.*\.(jpg|jpeg|png|gif))/i;

function checkStringLength(v: string, min: number, max: number): boolean {
  return v.replaceAll(' ', '').length > min && v.length < max;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    unique: true,
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
      message: 'Информация о пользователе должна быть от 2 до 200 символов',
    },
  },
});

export default model<IUser>('User', userSchema);
