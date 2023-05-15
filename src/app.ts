import express from 'express';
import mongoose from 'mongoose';
import router from './routes/index';
import { login, createUser } from './controllers/user-controller';
import auth from './middleware/auth';
import centralErrorHandling from './middleware/error-handling';

require('dotenv').config();

const {
  PORT = 3000,
  SERVER_DB = '127.0.0.1:27017',
  DATABASE = 'mestodb',
} = process.env;

const app = express();

app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/', router);

app.use(centralErrorHandling);

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://${SERVER_DB}/${DATABASE}`);
    console.log('MongoDB connected!');

    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

connectDB();
