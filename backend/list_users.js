const mongoose = require('mongoose');
require('dotenv').config({path:'./.env'});
const User = require('./src/models/User');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find({});
    console.log('--- ALL USERS ---');
    users.forEach(u => console.log(`- ${u.name} (${u.email}) [Role: ${u.role}]`));
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

run();
