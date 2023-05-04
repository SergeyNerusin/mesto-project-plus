import express from 'express';
import mongoose from 'mongoose';
import router from './routes/index';
import { testMidllware } from './middleware/middleware';

const server = '127.0.0.1:27017'; // REPLACE WITH YOUR OWN SERVER
const database = 'mestodb'; // REPLACE WITH YOUR OWN DB NAME

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

app.use(testMidllware);
app.use('/', router);

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://${server}/${database}`);
    console.log('MongoDB connected!');

    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

connectDB();
