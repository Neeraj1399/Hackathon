const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const User = require('./src/models/User');
const PasswordResetRequest = require('./src/models/PasswordResetRequest');

dotenv.config({ path: './.env' });

async function checkRequests() {
  let output = '';
  try {
    await mongoose.connect(process.env.MONGO_URI);
    output += 'Connected to DB\n';

    const requests = await PasswordResetRequest.find().populate('user', 'email');
    output += `RESET REQUESTS COUNT: ${requests.length}\n`;
    requests.forEach(r => {
      output += `- ID: ${r._id}, User: ${r.user?.email || 'N/A'}, Status: ${r.status}, Created: ${r.createdAt}\n`;
    });

  } catch (err) {
    output += `ERROR: ${err.message}\n`;
  } finally {
    fs.writeFileSync('reset_debug.txt', output);
    process.exit();
  }
}

checkRequests();
