const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const PasswordResetRequest = require('./src/models/PasswordResetRequest');

dotenv.config({ path: './.env' });

async function checkRequests() {
  try {
    // FIX: Using MONGODB_URI to match .env
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('--- DATABASE AUDIT ---');

    const allRequests = await PasswordResetRequest.find();
    console.log(`TOTAL REQUESTS IN DB: ${allRequests.length}`);

    const pendingRequests = await PasswordResetRequest.find({ status: 'pending' }).populate('user');
    console.log(`PENDING REQUESTS: ${pendingRequests.length}`);

    pendingRequests.forEach((r, i) => {
      console.log(`[${i}] ID: ${r._id}`);
      console.log(`    User Ref: ${r.user ? r.user.email : 'MISSING USER'}`);
      console.log(`    Status: ${r.status}`);
      console.log(`    Created: ${r.createdAt}`);
    });

    console.log('--- END AUDIT ---');

  } catch (err) {
    console.error('AUDIT ERROR:', err);
  } finally {
    process.exit();
  }
}

checkRequests();
