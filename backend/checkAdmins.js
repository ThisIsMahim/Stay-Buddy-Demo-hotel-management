const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const admins = await User.find({ role: 'ADMIN' });
    console.log("Admins:");
    for (const a of admins) {
      console.log(`- ${a.email} (${a.name})`);
    }
  } catch (e) {
    console.error(e);
  } finally {
    mongoose.disconnect();
  }
}

run();
