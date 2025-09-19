import { User } from '../models/User.js';

export async function seedDefaultAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@tasker.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  const existing = await User.findOne({ role: 'admin' });
  if (!existing) {
    await User.create({
      name: 'Super Admin',
      email: adminEmail,
      phone: '+910000000000',
      password: adminPassword,
      role: 'admin'
    });
    console.log(`Seeded default admin: ${adminEmail}`);
  }
}
