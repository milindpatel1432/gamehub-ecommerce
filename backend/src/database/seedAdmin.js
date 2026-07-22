import User from '../models/User.js';

export const seedAdmin = async () => {
  try {
    console.log('[Single Super Admin System] Auditing database admin accounts...');

    // Audit check for multiple admin accounts
    const allAdmins = await User.find({ role: 'admin' });
    if (allAdmins.length > 1) {
      console.warn(`[SECURITY AUDIT WARNING] Detected ${allAdmins.length} admin accounts in database!`);
      allAdmins.forEach((adm, idx) => {
        console.warn(`  Admin #${idx + 1}: ID=${adm._id}, Email=${adm.email}, Username=${adm.username}`);
      });
      console.warn('  -> Action Required: GameHub policy permits strictly ONE Super Admin. Non-super admin accounts should be reviewed.');
    } else {
      console.log(`[Single Super Admin System] Audit check passed. ${allAdmins.length} Admin account found.`);
    }

    // Preserve and update existing Admin or create single Super Admin
    let superAdmin = await User.findOne({
      $or: [{ role: 'admin' }, { email: 'admin@gamehub.com' }, { username: 'milindadmin' }]
    });

    const adminPayload = {
      fullName: 'Milind Patel',
      username: 'milindadmin',
      email: 'admin@gamehub.com',
      password: 'milind@2803',
      role: 'admin',
      isVerified: true,
      isBlocked: false,
    };

    if (!superAdmin) {
      superAdmin = await User.create(adminPayload);
      console.log('[Single Super Admin System] Permanent Super Admin account created successfully.');
    } else {
      console.log(`[Single Super Admin System] Preserving and updating existing admin account (${superAdmin.email})...`);
      superAdmin.fullName = adminPayload.fullName;
      superAdmin.username = adminPayload.username;
      superAdmin.email = adminPayload.email;
      superAdmin.password = adminPayload.password; // Triggers bcrypt pre-save hook
      superAdmin.role = 'admin';
      superAdmin.isVerified = true;
      superAdmin.isBlocked = false;
      await superAdmin.save();
      console.log('[Single Super Admin System] Permanent Super Admin account updated & synchronized.');
    }

    console.log('====================================================');
    console.log('👑 PERMANENT SUPER ADMIN CREDENTIALS ACTIVE');
    console.log('  Full Name: Milind Patel');
    console.log('  Username:  milindadmin');
    console.log('  Email:     admin@gamehub.com');
    console.log('  Password:  milind@2803');
    console.log('  Role:      admin');
    console.log('====================================================');
  } catch (error) {
    console.error('[Single Super Admin System] Failed to seed/update Super Admin:', error.message);
  }
};
