import mongoose from 'mongoose';
import { seedAdmin } from './seedAdmin.js';
import { seedCategories } from './seedCategories.js';
import { seedProducts } from './seedProducts.js';

const connectDB = async () => {
  let connected = false;
  
  if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('YOUR_PASSWORD')) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
      connected = true;
    } catch (error) {
      console.warn(`[Database] Atlas Connection Warning: ${error.message}`);
    }
  }

  if (!connected) {
    try {
      console.log('[Database] Starting In-Memory MongoDB Server for local demo...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`[Database] In-Memory MongoDB Connected successfully at: ${mongoUri}`);
      connected = true;
    } catch (memErr) {
      console.error(`[Database] In-Memory Fallback Error: ${memErr.message}`);
      process.exit(1);
    }
  }

  try {
    await seedAdmin();
    await seedCategories();
    await seedProducts();
    console.log('[Database] All seeds (Admin, Categories, Products) initialized successfully.');
  } catch (seedErr) {
    console.error(`[Database] Seeding Error: ${seedErr.message}`);
  }
};

export default connectDB;
