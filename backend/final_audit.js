const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to:', mongoose.connection.name);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    // Try to find documents in passwordresetrequests (lowercased plurals)
    const count = await mongoose.connection.db.collection('passwordresetrequests').countDocuments();
    console.log('Documents in passwordresetrequests:', count);

    const docs = await mongoose.connection.db.collection('passwordresetrequests').find().toArray();
    docs.forEach(d => console.log('Doc:', JSON.stringify(d)));

  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

run();
