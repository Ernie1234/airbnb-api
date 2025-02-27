import Logger from '@libs/logger';
import mongoose from 'mongoose';

const connectDb = async (url: string) => {
  try {
    await mongoose.connect(url);
    Logger.info('Database Connected Successfully');
  } catch (error) {
    Logger.error(`Error Connecting to MongoDB: ${error}`);
  }
};

export default connectDb;
