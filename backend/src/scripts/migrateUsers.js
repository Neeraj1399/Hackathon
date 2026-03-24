const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: 'backend/.env' });

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for migration...');

    const users = await User.find({});
    console.log(`Found ${users.length} users to migrate.`);

    for (const user of users) {
      if (user.email === 'adminhackathon@gmail.com') {
        user.systemRole = 'admin';
        user.role = 'Super Admin';
        user.position = 'Administrator';
      } else {
        if (!user.role) user.role = 'Employee';
        if (!user.position) user.position = 'Engineer';
        if (!user.systemRole) {
           if (user.role === 'admin') user.systemRole = 'admin';
           else if (user.role === 'judge') user.systemRole = 'judge';
           else user.systemRole = 'participant';
        }
      }
      
      // Ensure hierarchy fields are null if not set
      if (user.techLead === undefined) user.techLead = null;
      if (user.manager === undefined) user.manager = null;

      await user.save();
      console.log(`Migrated user: ${user.email}`);
    }

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
};

migrate();
