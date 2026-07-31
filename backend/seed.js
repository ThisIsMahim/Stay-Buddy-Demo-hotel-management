/**
 * Seed script — populates MongoDB with all the mock data from the frontend api.ts.
 * Run: cd backend && npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Models
const User = require('./models/User');
const Hotel = require('./models/Hotel');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const Offer = require('./models/Offer');
const Experience = require('./models/Experience');
const ExperienceReview = require('./models/ExperienceReview');
const Notification = require('./models/Notification');
const HousekeepingTask = require('./models/HousekeepingTask');
const HotelService = require('./models/HotelService');

async function seed() {
  await connectDB();
  console.log('🌱 Seeding database...\n');

  // ── Clear all collections ──
  await Promise.all([
    User.deleteMany({}), Hotel.deleteMany({}), Room.deleteMany({}),
    Booking.deleteMany({}), Review.deleteMany({}), Offer.deleteMany({}),
    Experience.deleteMany({}), ExperienceReview.deleteMany({}),
    Notification.deleteMany({}), HousekeepingTask.deleteMany({}),
    HotelService.deleteMany({}),
  ]);
  console.log('  ✓ Cleared all collections');

  // ── Users ──
  const users = await User.insertMany([
    { name: 'Platform Admin', email: 'admin@staybuddy.com', role: 'ADMIN', status: 'ACTIVE' },
    { name: 'Rahim Khan', email: 'rahim@gmail.com', role: 'USER', status: 'ACTIVE' },
    { name: 'Sumaiya Akter', email: 'sumaiya@gmail.com', role: 'USER', status: 'BLOCKED' },
    { name: 'Hotel Owner 1', email: 'owner1@staybuddy.com', role: 'OWNER', status: 'ACTIVE' },
    { name: 'Hotel Owner 2', email: 'owner2@staybuddy.com', role: 'OWNER', status: 'ACTIVE' },
  ]);
  const [admin, user1, user2, owner1, owner2] = users;
  console.log(`  ✓ ${users.length} users`);

  // ── Hotels ──
  const hotels = await Hotel.insertMany([
    {
      owner: owner1._id, name: 'The Grand Palace Hotel',
      description: 'Luxury 5-star hotel in Dhaka.', address: 'Road 12, Gulshan-2', city: 'Dhaka',
      locationLat: 23.7946, locationLng: 90.4152,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
      rating: 4.7, totalReviews: 248, isVerified: true, isRedMarked: false, isActive: true,
      amenities: ['WiFi', 'Pool', 'Gym', 'Spa'],
      checkInTime: '14:00 PM', checkOutTime: '12:00 PM',
      acceptedPayments: ['VISA', 'Mastercard', 'bKash'],
    },
    {
      owner: owner2._id, name: 'Budget Stay Mirpur',
      description: 'Affordable stay.', address: 'Section 10', city: 'Dhaka',
      locationLat: 23.8041, locationLng: 90.3659,
      images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
      rating: 3.9, totalReviews: 87, isVerified: true, isRedMarked: false, isActive: true,
      amenities: ['WiFi'],
      checkInTime: '13:00 PM', checkOutTime: '11:00 AM',
      acceptedPayments: ['Cash', 'bKash'],
    },
    {
      owner: owner1._id, name: 'Sky View Banani',
      description: 'Boutique hotel.', address: 'Banani 11', city: 'Dhaka',
      locationLat: 23.7936, locationLng: 90.3988,
      images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
      rating: 4.5, totalReviews: 134, isVerified: true, isRedMarked: false, isActive: true,
      amenities: ['WiFi', 'AC', 'Restaurant'],
      checkInTime: '14:00 PM', checkOutTime: '12:00 PM',
      acceptedPayments: ['VISA', 'Mastercard', 'Amex'],
    },
    /* Rajshahi Hotels */
    {
      owner: owner1._id, name: 'Royal Hotel Rajshahi',
      description: 'Elegant stay in the silk city.', address: 'Court Road', city: 'Rajshahi',
      locationLat: 24.3745, locationLng: 88.6042,
      images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
      rating: 4.2, totalReviews: 45, isVerified: true, isRedMarked: false, isActive: true,
      amenities: ['WiFi', 'AC'],
      checkInTime: '12:00 PM', checkOutTime: '11:00 AM',
      acceptedPayments: ['Cash', 'bKash'],
    },
    {
      owner: owner2._id, name: 'Silk City Inn',
      description: 'Modern budget stay.', address: 'Zero Point', city: 'Rajshahi',
      locationLat: 24.3636, locationLng: 88.6241,
      images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
      rating: 3.8, totalReviews: 21, isVerified: true, isRedMarked: false, isActive: true,
      amenities: ['WiFi'],
      checkInTime: '13:00 PM', checkOutTime: '11:00 AM',
      acceptedPayments: ['Cash'],
    },
    /* Panchagarh Hotels */
    {
      owner: owner1._id, name: 'Panchagarh Eco Resort',
      description: 'Nature-friendly resort with tea garden view.', address: 'Dhakka-Panchagarh Hwy', city: 'Panchagarh',
      locationLat: 26.3411, locationLng: 88.5544,
      images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
      rating: 4.8, totalReviews: 12, isVerified: true, isRedMarked: false, isActive: true,
      amenities: ['WiFi', 'Tea Garden', 'Organic Food'],
      checkInTime: '12:00 PM', checkOutTime: '11:00 AM',
      acceptedPayments: ['Cash', 'bKash'],
    },
    {
      owner: owner2._id, name: 'Border View Inn',
      description: 'Budget stay near the border.', address: 'Banglabandha Road', city: 'Panchagarh',
      locationLat: 26.3333, locationLng: 88.5666,
      images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
      rating: 3.5, totalReviews: 5, isVerified: true, isRedMarked: false, isActive: true,
      amenities: ['WiFi', 'Parking'],
      checkInTime: '13:00 PM', checkOutTime: '11:00 AM',
      acceptedPayments: ['Cash'],
    },
  ]);
  const [hotel1, hotel2, hotel3, hotel4, hotel5, hotel6, hotel7] = hotels;
  console.log(`  ✓ ${hotels.length} hotels`);

  // ── Rooms ──
  const rooms = await Room.insertMany([
    { hotel: hotel1._id, type: 'Single Bed', pricePerNight: 900, totalInventory: 5, availableCount: 4, images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'], amenities: ['AC','TV','WiFi'], floorNumber: 2, roomNumber: '201', capacity: '1 Adult', maxAdults: 1, maxChildren: 0, sizeSqFt: 250, viewType: 'City View' },
    { hotel: hotel1._id, type: 'Double Bed', pricePerNight: 1500, totalInventory: 8, availableCount: 3, images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600'], amenities: ['AC','TV','WiFi'], floorNumber: 3, roomNumber: '305', capacity: '2 Adults', maxAdults: 2, maxChildren: 1, sizeSqFt: 350, viewType: 'Pool View' },
    { hotel: hotel2._id, type: 'Single Bed', pricePerNight: 600, totalInventory: 10, availableCount: 7, images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'], amenities: ['WiFi','TV'], floorNumber: 1, roomNumber: '101', capacity: '1 Adult', maxAdults: 1, maxChildren: 0, sizeSqFt: 200, viewType: 'Street View' },
    { hotel: hotel2._id, type: 'Double Bed', pricePerNight: 1000, totalInventory: 5, availableCount: 2, images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600'], amenities: ['WiFi','TV','AC'], floorNumber: 2, roomNumber: '201', capacity: '2 Adults, 1 Child', maxAdults: 2, maxChildren: 1, sizeSqFt: 300, viewType: 'City View' },
    { hotel: hotel3._id, type: 'Deluxe', pricePerNight: 2200, totalInventory: 3, availableCount: 1, images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600'], amenities: ['AC','TV','WiFi'], floorNumber: 5, roomNumber: '505', capacity: '2 Adults, 2 Children', maxAdults: 3, maxChildren: 2, sizeSqFt: 450, viewType: 'Lake View' },
    
    /* Rajshahi Rooms */
    { hotel: hotel4._id, type: 'Single Bed', pricePerNight: 800, totalInventory: 4, availableCount: 3, images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'], amenities: ['AC','WiFi'], floorNumber: 1, roomNumber: '102', capacity: '1 Adult', maxAdults: 1, maxChildren: 0, sizeSqFt: 220, viewType: 'Garden View' },
    { hotel: hotel5._id, type: 'Double Bed', pricePerNight: 1200, totalInventory: 6, availableCount: 5, images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600'], amenities: ['WiFi'], floorNumber: 2, roomNumber: '202', capacity: '2 Adults', maxAdults: 2, maxChildren: 0, sizeSqFt: 280, viewType: 'Street View' },

    /* Panchagarh Rooms */
    { hotel: hotel6._id, type: 'Eco Suite', pricePerNight: 2500, totalInventory: 3, availableCount: 2, images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600'], amenities: ['Tea Maker','WiFi'], floorNumber: 1, roomNumber: '101', capacity: '2 Adults, 2 Children', maxAdults: 2, maxChildren: 2, sizeSqFt: 400, viewType: 'Tea Garden View' },
    { hotel: hotel7._id, type: 'Standard Double', pricePerNight: 1100, totalInventory: 5, availableCount: 5, images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600'], amenities: ['WiFi'], floorNumber: 1, roomNumber: '101', capacity: '2 Adults', maxAdults: 2, maxChildren: 1, sizeSqFt: 250, viewType: 'Street View' },
  ]);
  const [room1, room2, room3, room4, room5, room6, room7, room8, room9] = rooms;
  console.log(`  ✓ ${rooms.length} rooms`);

  // ── Bookings ──
  const bookings = await Booking.insertMany([
    { user: user1._id, hotel: hotel1._id, room: room2._id, roomType: 'Double Bed', roomNumber: '305', hotelName: 'The Grand Palace Hotel', type: 'ONLINE', status: 'CONFIRMED', checkIn: '2026-03-15', checkOut: '2026-03-17', nights: 2, totalPrice: 3000, paymentMethod: 'bkash' },
    { user: user2._id, hotel: hotel1._id, room: room1._id, roomType: 'Single Bed', roomNumber: '201', hotelName: 'The Grand Palace Hotel', type: 'ONLINE', status: 'CANCELLED', checkIn: '2026-03-15', checkOut: '2026-03-17', nights: 2, totalPrice: 1800, paymentMethod: 'card' },
    { user: user1._id, hotel: hotel3._id, room: room5._id, roomType: 'Deluxe', roomNumber: '505', hotelName: 'Sky View Banani', type: 'ONLINE', status: 'CONFIRMED', checkIn: '2026-03-18', checkOut: '2026-03-19', nights: 1, totalPrice: 2200, paymentMethod: 'bkash' },
  ]);
  console.log(`  ✓ ${bookings.length} bookings`);

  // ── Reviews ──
  const reviews = await Review.insertMany([
    { user: user1._id, userName: 'Rahim Khan', hotel: hotel1._id, rating: 5, comment: 'Outstanding service and premium rooms!', type: 'REVIEW' },
    { user: user2._id, userName: 'Sumaiya Akter', hotel: hotel2._id, rating: 2, comment: 'AC was not working and room was small.', type: 'COMPLAINT' },
    { user: user1._id, userName: 'Rahim Khan', hotel: hotel3._id, rating: 1, comment: 'Fraudulent pricing. Charged extra for water.', type: 'COMPLAINT' },
  ]);
  console.log(`  ✓ ${reviews.length} reviews`);

  // ── Offers ──
  const offers = await Offer.insertMany([
    { hotel: hotel1._id, hotelName: 'The Grand Palace Hotel', title: 'EID FESTIVAL DEAL', discountPercent: 25, imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200', isActive: true },
  ]);
  console.log(`  ✓ ${offers.length} offers`);

  // ── Notifications ──
  const notifs = await Notification.insertMany([
    { recipientId: admin._id.toString(), type: 'BOOKING', title: 'New Global Reservation', message: 'User Rahim Khan booked Double Bed at The Grand Palace Hotel.', isRead: false },
    { recipientId: admin._id.toString(), type: 'COMPLAINT', title: 'Crisis: High Severity Complaint', message: 'Sumaiya Akter reported a critical issue at Budget Stay Mirpur.', isRead: false },
    { recipientId: admin._id.toString(), type: 'PAYMENT', title: 'Yield Transmission Successful', message: '৳3,000 received for Booking.', isRead: true },
  ]);
  console.log(`  ✓ ${notifs.length} notifications`);

  // ── Housekeeping Tasks ──
  const hkTasks = await HousekeepingTask.insertMany([
    { hotel: hotel1._id, room: room1._id, roomType: 'Single Bed', floorNumber: 2, status: 'AVAILABLE' },
    { hotel: hotel1._id, room: room2._id, roomType: 'Double Bed', floorNumber: 3, status: 'CLEANING' },
    { hotel: hotel3._id, room: room5._id, roomType: 'Deluxe', floorNumber: 5, status: 'AVAILABLE' },
  ]);
  console.log(`  ✓ ${hkTasks.length} housekeeping tasks`);

  // ── Hotel Services ──
  const services = await HotelService.insertMany([
    { hotel: hotel1._id, name: 'In-Room Dining (Full Menu)', description: 'Order from our full chef-curated menu delivered to your room, available 24/7.', category: 'Food', price: 0, currency: 'BDT', icon: '🍽️', isAvailable: true },
    { hotel: hotel1._id, name: 'Breakfast in Bed', description: 'Luxurious continental breakfast delivered fresh to your room every morning.', category: 'Food', price: 350, currency: 'BDT', icon: '🍳', isAvailable: true },
    { hotel: hotel1._id, name: 'Full Body Spa Massage (60 min)', description: 'Rejuvenating full body massage by certified aromatherapy therapists.', category: 'Spa', price: 1800, currency: 'BDT', icon: '💆', isAvailable: true },
    { hotel: hotel1._id, name: 'Couples Spa Package', description: 'Romantic spa experience for two — hot stone, aromatherapy & champagne.', category: 'Spa', price: 3200, currency: 'BDT', icon: '🧘', isAvailable: true },
    { hotel: hotel1._id, name: 'Gym Access (Day Pass)', description: 'Full access to our premium fitness center with modern equipment.', category: 'Gym', price: 0, currency: 'BDT', icon: '🏋️', isAvailable: true },
    { hotel: hotel1._id, name: 'Airport Pickup', description: 'Luxury car pickup from Hazrat Shahjalal International Airport.', category: 'Transport', price: 800, currency: 'BDT', icon: '✈️', isAvailable: true },
    { hotel: hotel1._id, name: 'Airport Drop', description: 'Comfortable car drop-off from hotel to your departure terminal.', category: 'Transport', price: 800, currency: 'BDT', icon: '🚗', isAvailable: true },
    { hotel: hotel2._id, name: 'Room Service', description: 'Basic food & beverage delivery to your room.', category: 'Food', price: 0, currency: 'BDT', icon: '🍽️', isAvailable: true },
    { hotel: hotel2._id, name: 'Airport Pickup', description: 'AC car pickup from airport to hotel.', category: 'Transport', price: 600, currency: 'BDT', icon: '✈️', isAvailable: true },
    { hotel: hotel3._id, name: 'In-Room Dining', description: 'Modern menu with Bangladeshi & continental options delivered hot.', category: 'Food', price: 0, currency: 'BDT', icon: '🍽️', isAvailable: true },
    { hotel: hotel3._id, name: 'Rooftop Spa Treatment', description: 'Exclusive rooftop spa with city skyline views — massage & facial combo.', category: 'Spa', price: 2500, currency: 'BDT', icon: '💆', isAvailable: true },
    { hotel: hotel3._id, name: 'Airport Pickup', description: 'Premium sedan pickup from airport.', category: 'Transport', price: 900, currency: 'BDT', icon: '✈️', isAvailable: true },
  ]);
  console.log(`  ✓ ${services.length} hotel services`);

  // ── Experiences ──
  const experiences = await Experience.insertMany([
    {
      owner: owner1._id, hotel: hotel1._id, hotelName: 'The Grand Palace Hotel',
      title: 'Sacred Buddhist Ritual & Yoga', description: 'Experience an ancient Buddhist ritual followed by a calming yoga session led by a licensed practitioner.',
      city: 'Dhaka', location: 'Gulshan, Dhaka', meetingPoint: 'Main lobby of The Grand Palace Hotel, Gulshan-2',
      price: 16, rating: 4.96, reviews: 84,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600','https://images.unsplash.com/photo-1593811167562-9cef47bfc4a7?w=600'],
      badge: 'Original', category: 'original', tags: ['Wellness', 'Cultural', 'Spiritual'],
      highlights: ['Small group (max 5)', 'Free cancellation', 'Includes yoga mat'],
      duration: '2 hours', maxGuests: 5, spokenLanguages: ['English', 'Bangla'],
      amenities: ['WiFi', 'Changing Room', 'Shower', 'Locker', 'Tea & Snacks'],
      services: ['Yoga mat provided', 'Meditation cushion', 'Buddhist ritual kit'],
      whatIncludes: ['Yoga mat & props', 'Herbal tea & light snacks', 'Certificate of completion'],
      whatToBring: ['Comfortable clothing', 'Water bottle', 'Open mind'],
      whatNotIncluded: ['Transportation', 'Personal yoga gear'],
      hostName: 'Priya Sharma', hostBio: 'Certified yoga instructor with 10+ years experience.',
      cancellationPolicy: 'Free cancellation up to 24 hours before.', ageRequirement: '16+ years',
      isActive: true,
    },
    {
      owner: owner1._id, hotel: hotel1._id, hotelName: 'The Grand Palace Hotel',
      title: 'Traditional Tea Ceremony', description: 'A deep dive into 500-year history of Bangladeshi tea culture.',
      city: 'Dhaka', location: 'Banani, Dhaka', price: 65, rating: 4.98, reviews: 120,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
      badge: 'Popular', category: 'standard', tags: ['Food & Drink', 'Cultural'],
      duration: '1.5 hours', maxGuests: 6, hostName: 'Tatsuya Rahman',
      isActive: true,
    },
    {
      owner: owner2._id, hotel: hotel2._id, hotelName: 'Budget Stay Mirpur',
      title: 'Street Photography Walk', description: 'Explore Dhaka\'s vibrant streets with a professional photographer.',
      city: 'Dhaka', location: 'Old Dhaka', price: 30, rating: 4.88, reviews: 67,
      image: 'https://images.unsplash.com/photo-1542965503-cca2b1258252?w=600',
      badge: 'Popular', category: 'standard', tags: ['Adventure', 'Art', 'Outdoor'],
      duration: '3 hours', maxGuests: 8, hostName: 'Karim Hossain',
      isActive: true,
    },
    {
      owner: owner1._id, hotel: hotel3._id, hotelName: 'Sky View Banani',
      title: 'Authentic Pasta Making Class', description: 'Learn the art of homemade pasta from a culinary expert.',
      city: 'Chittagong', location: 'GEC Circle, Chittagong', price: 50, rating: 4.95, reviews: 203,
      image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=600',
      badge: 'Original', category: 'original', tags: ['Food & Drink', 'Cooking'],
      duration: '2.5 hours', maxGuests: 4, hostName: 'Chef Marco Ali',
      isActive: true,
    },
    {
      owner: owner1._id, hotel: hotel1._id, hotelName: 'The Grand Palace Hotel',
      title: 'Sundarbans Mangrove Kayak Tour', description: 'Paddle through the world\'s largest mangrove forest.',
      city: 'Khulna', location: 'Sundarbans, Khulna', price: 120, rating: 4.92, reviews: 45,
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600',
      badge: 'Adventure', category: 'original', tags: ['Adventure', 'Nature', 'Outdoor'],
      duration: '4 hours', maxGuests: 8, hostName: 'Rashed Chowdhury',
      isActive: true,
    },
    {
      owner: owner2._id, hotel: hotel2._id, hotelName: 'Budget Stay Mirpur',
      title: 'Rickshaw Art Workshop', description: 'Create your own rickshaw-art masterpiece.',
      city: 'Dhaka', location: 'Mirpur, Dhaka', price: 22, rating: 4.85, reviews: 38,
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600',
      badge: 'Original', category: 'original', tags: ['Art', 'Cultural'],
      duration: '2 hours', maxGuests: 6, hostName: 'Habib Usta',
      isActive: true,
    },
  ]);
  console.log(`  ✓ ${experiences.length} experiences`);

  // ── Experience Reviews ──
  const expReviews = await ExperienceReview.insertMany([
    { experience: experiences[0]._id, user: user1._id, userName: 'Rahim Khan', rating: 5, comment: 'Life-changing yoga session!' },
    { experience: experiences[1]._id, user: user2._id, userName: 'Sumaiya Akter', rating: 4, comment: 'Great tea selection!' },
  ]);
  console.log(`  ✓ ${expReviews.length} experience reviews`);

  console.log('\n✅ Database seeded successfully!\n');

  // Print IDs for reference
  console.log('📋 Reference IDs:');
  console.log(`  Admin:   ${admin._id}`);
  console.log(`  User 1:  ${user1._id}`);
  console.log(`  User 2:  ${user2._id}`);
  console.log(`  Owner 1: ${owner1._id}`);
  console.log(`  Owner 2: ${owner2._id}`);
  console.log(`  Hotel 1: ${hotel1._id}`);
  console.log(`  Hotel 2: ${hotel2._id}`);
  console.log(`  Hotel 3: ${hotel3._id}`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
