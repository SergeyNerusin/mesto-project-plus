import {
  model, Schema, Types, Document, 
} from 'mongoose';
import regUrl from '../utils/constant';

export interface ICard extends Document {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Array<Types.ObjectId>;
  createdAt: Date;
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => regUrl.test(v),
      message: 'Incorrect foto link',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [Types.ObjectId],
    ref: 'user',
    default: [],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<ICard>('сard', cardSchema);
