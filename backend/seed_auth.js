require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password123', salt);

    // Update ALL admins and owners directly using collection (bypasses pre-save hook)
    await User.collection.updateMany(
        { role: { $in: ['ADMIN', 'OWNER'] } }, 
        { $set: { password: hash } }
    );
    
    console.log('Fixed passwords for all ADMIN and OWNER users!');

    process.exit(0);
}).catch(console.error);
