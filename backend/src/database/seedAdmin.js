import User from '../models/User.js';

export const seedAdmin = async () => {
  try {
    console.log('[Single Super Admin System] Auditing database admin accounts...');

    // Clean up any stale demo admin account (admin@gamehub.com)
    await User.deleteMany({ email: 'admin@gamehub.com' });

    // Find or create Super Admin: pinal@gmail.com (pinal1405)
    let superAdmin = await User.findOne({
      $or: [{ email: 'pinal@gmail.com' }, { username: 'pinal1405' }]
    });

    const adminPayload = {
      fullName: 'Pinal Admin',
      username: 'pinal1405',
      email: 'pinal@gmail.com',
      password: 'milind@2803',
      role: 'admin',
      isVerified: true,
      isBlocked: false,
    };

    if (!superAdmin) {
      superAdmin = await User.create(adminPayload);
      console.log('[Single Super Admin System] Super Admin account (pinal@gmail.com) created successfully.');
    } else {
      console.log(`[Single Super Admin System] Updating Super Admin account (${superAdmin.email})...`);
      superAdmin.fullName = adminPayload.fullName;
      superAdmin.username = adminPayload.username;
      superAdmin.email = adminPayload.email;
      const isPasswordValid = await superAdmin.comparePassword(adminPayload.password);
      if (!isPasswordValid) {
        superAdmin.password = adminPayload.password;
      }
      superAdmin.role = 'admin';
      superAdmin.isVerified = true;
      superAdmin.isBlocked = false;
      await superAdmin.save();
      console.log('[Single Super Admin System] Super Admin account synchronized successfully.');
    }

    console.log('====================================================');
    console.log('👑 SUPER ADMIN CREDENTIALS ACTIVE');
    console.log('  Full Name: Pinal Admin');
    console.log('  Username:  pinal1405');
    console.log('  Email:     pinal@gmail.com');
    console.log('  Password:  milind@2803');
    console.log('  Role:      admin');
    console.log('====================================================');
  } catch (error) {
    console.error('[Single Super Admin System] Failed to seed/update Super Admin:', error.message);
  }
};
