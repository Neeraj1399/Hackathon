const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./backend/src/models/User');
const PasswordResetRequest = require('./backend/src/models/PasswordResetRequest');

dotenv.config({ path: './backend/.env' });

async function checkRequests() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const requests = await PasswordResetRequest.find().populate('user', 'email');
    console.log('RESET REQUESTS COUNT:', requests.length);
    requests.forEach(r => {
      console.log(`- User: ${r.user?.email}, Status: ${r.status}, Created: ${r.createdAt}`);
    });

  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

checkRequests();
