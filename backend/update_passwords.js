require('dotenv').config(); 
const mongoose = require('mongoose'); 
const User = require('./models/User'); 
const bcrypt = require('bcryptjs'); 

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const users = await User.find({ role: { $in: ['ADMIN', 'OWNER'] } }); 
    const salt = await bcrypt.genSalt(10); 
    const hash = await bcrypt.hash('password123', salt); 
    let count = 0;
    for (let u of users) { 
        // Only set if not already having a password
        const doc = await User.collection.findOne({ _id: u._id, password: { $exists: true } });
        if (!doc) {
            await User.collection.updateOne({ _id: u._id }, { $set: { password: hash } }); 
            count++;
        }
    } 
    console.log(`Updated ${count} users with default password 'password123'`); 
    process.exit(0); 
}).catch(console.error);
