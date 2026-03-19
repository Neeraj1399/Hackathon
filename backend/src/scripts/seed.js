const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    const adminEmail = 'adminhackathon@gmail.com';
    
    // Delete if exists to ensure fresh start
    await User.deleteOne({ email: adminEmail });
    console.log('Cleaned up existing admin (if any)...');

    await User.create({
      name: 'Super Admin',
      email: adminEmail,
      password: 'admin123',
      role: 'admin'
    });
    
    console.log('Admin user created successfully.');
    console.log('Email: adminhackathon@gmail.com');
    console.log('Password: admin123');

    process.exit();
  } catch (err) {
    console.error('Error seeding admin:', err.message);
    process.exit(1);
  }
};

seedAdmin();
