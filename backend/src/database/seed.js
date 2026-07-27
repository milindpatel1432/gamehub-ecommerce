import 'dotenv/config';
import mongoose from 'mongoose';
import { seedAdmin } from './seedAdmin.js';
import { seedCategories } from './seedCategories.js';
import { seedProducts } from './seedProducts.js';

const runSeeder = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('[Seeder Error] MONGODB_URI environment variable is missing.');
      process.exit(1);
    }

    console.log('[Seeder] Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('[Seeder] Connected to MongoDB Atlas.');

    console.log('[Seeder] Starting database seeding process...');
    await seedAdmin();
    await seedCategories();
    await seedProducts();

    console.log('\n=========================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY');
    console.log('=========================================');

    await mongoose.disconnect();
    console.log('[Seeder] Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] ${error.message}`);
    process.exit(1);
  }
};

runSeeder();
