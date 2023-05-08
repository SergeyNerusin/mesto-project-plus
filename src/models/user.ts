import { model, Schema, Document } from 'mongoose';
import validator from 'validator';
import regUrl from '../utils/constant';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    unique: true,
    required: [true, 'e-mail is required'],
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    select: false,
    minlength: 8,
  },
  name: {
    type: String,
    trim: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив-Кусто',
  },
  about: {
    type: String,
    trim: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => regUrl.test(v),
      message: 'Incorrect avatar link',
    },
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

export default model<IUser>('user', userSchema);
