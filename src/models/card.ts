import {
  model,
  Schema,
  Types,
  Document,
} from 'mongoose';
import checkStringLength from '../utils/string-length';
import regUrl from '../utils/constant';

export interface ICard extends Document {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: [Types.ObjectId];
  createdAt: Date
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v: string) => checkStringLength(v, 2, 30),
      message: 'Имя должно быть от 2 до 30 символов',
    },
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => regUrl.test(v),
      message: 'Некорректная ссылка на фото',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [Types.ObjectId],
    default: [],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<ICard>('сard', cardSchema);
