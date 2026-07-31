const mongoose = require('mongoose');
const User = require('./backend/models/User');
require('dotenv').config({ path: './backend/.env' });

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'mdtohid232020@gmail.com';
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      user.role = 'ADMIN';
      await user.save();
      console.log(`User ${email} is now an ADMIN.`);
    } else {
      // If user doesn't exist, create it (assuming clerkId will be synced later)
      const newUser = await User.create({
        name: 'Admin User',
        email: email.toLowerCase(),
        role: 'ADMIN',
        status: 'ACTIVE'
      });
      console.log(`User ${email} not found, so a new ADMIN account was created.`);
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

makeAdmin();
