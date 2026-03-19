const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected to seed admin...');

    const adminEmail = 'adminhackathon@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin already exists.');
      process.exit();
    }

    const admin = new User({
      name: 'Super Admin',
      email: adminEmail,
      password: 'Admin@123',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
