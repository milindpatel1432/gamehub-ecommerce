import mongoose from 'mongoose';
import { seedAdmin } from './seedAdmin.js';
import { seedCategories } from './seedCategories.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gamehub');
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    await seedAdmin();
    await seedCategories();
  } catch (error) {
    console.error(`[Database] Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
