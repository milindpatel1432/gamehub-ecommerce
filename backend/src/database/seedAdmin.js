import User from '../models/User.js';

export const seedAdmin = async () => {
  try {
    console.log('Running admin seed...');
    let admin = await User.findOne({ email: 'admin@gamehub.com' });
    if (!admin) {
      admin = await User.create({
        fullName: 'GameHub Admin',
        username: 'admin',
        email: 'admin@gamehub.com',
        phone: '1234567890',
        password: 'Admin@12345',
        role: 'admin',
        isVerified: true
      });
      console.log('Admin account created.');
    } else {
      console.log(`[Seed Admin] Found existing user: ${admin.email}, role: ${admin.role}, hash before: ${admin.password}`);
      admin.role = 'admin';
      admin.password = 'Admin@12345';
      await admin.save();
      console.log(`[Seed Admin] User saved. Hash after: ${admin.password}`);
      console.log('Admin account already exists.');
    }
    console.log('[Database] Seeded Admin Credentials:');
    console.log('  Email: admin@gamehub.com');
    console.log('  Password: Admin@12345');
  } catch (error) {
    console.error('[Database] Failed to seed default admin:', error.message);
  }
};
