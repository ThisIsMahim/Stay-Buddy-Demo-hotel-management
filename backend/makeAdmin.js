const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const emailToMakeAdmin = process.argv[2];

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    if (!emailToMakeAdmin) {
      console.log("Current Admins:");
      const admins = await User.find({ role: 'ADMIN' });
      admins.forEach(a => console.log(`- ${a.email} (${a.name})`));
      
      console.log("\nIf you want to make an account an admin, run:");
      console.log("node makeAdmin.js <your-email>");
    } else {
      const user = await User.findOne({ email: emailToMakeAdmin });
      if (!user) {
        console.log(`User with email ${emailToMakeAdmin} not found.`);
      } else {
        user.role = 'ADMIN';
        await user.save();
        console.log(`Success! ${emailToMakeAdmin} is now an ADMIN.`);
      }
    }
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await mongoose.disconnect();
  }
}

run();
