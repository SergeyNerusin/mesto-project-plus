import { model, Schema, Document } from 'mongoose';
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
    trim: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => regUrl.test(v),
      message: 'Incorrect avatar link',
    },
  },
});

export default model<IUser>('user', userSchema);
