import {
  model, Schema, Model, Document, 
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import AppError from '../errors/custom-errors';
import regUrl from '../utils/constant';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

interface UserModel extends Model<IUser> {
  findUserByCredentials: (
    // eslint-disable-next-line
    email: string,
    // eslint-disable-next-line
    password: string
  ) => Promise<Document<unknown, AppError, IUser>>;
}

const userSchema = new Schema<IUser, UserModel>({
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

userSchema.static(
  'findUserByCredentials',
  function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email })
      .select('+password')
      .then((user) => {
        if (!user) {
          return AppError.unathorized('Incorrect e-mail or password');
        }

        return bcrypt.compare(password, user.password).then((matched) => {
          if (!matched) {
            return AppError.unathorized('Incorrect e-mail or password');
          }

          return user;
        });
      });
  },
);

export default model<IUser, UserModel>('user', userSchema);
