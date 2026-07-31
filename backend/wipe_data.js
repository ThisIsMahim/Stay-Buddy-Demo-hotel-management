require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log('Connected to MongoDB');
    
    const collectionsToClear = [
        'hotels', 
        'rooms', 
        'experiences', 
        'offers', 
        'dynamicpricingrules', 
        'bookings', 
        'housekeepingtasks'
    ];
    
    for (const name of collectionsToClear) {
        if (mongoose.connection.collections[name]) {
            await mongoose.connection.collections[name].deleteMany({});
            console.log(`Cleared collection: ${name}`);
        }
    }
    
    console.log('Clean slate complete. All hotels, rooms, and related entities have been wiped.');
    process.exit(0);
}).catch(console.error);
