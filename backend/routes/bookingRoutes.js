const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Notification = require('../models/Notification');
const WalletTransaction = require('../models/WalletTransaction');
const User = require('../models/User');
const mongoose = require('mongoose');

// Helper to resolve mongo _id from Clerk ID or Mongo ID string
const resolveUser = async (userId) => {
  if (!userId || userId.startsWith('guest_')) return null;
  try {
    // 1. Try finding by Mongo ObjectId if it's a valid hex string
    if (mongoose.Types.ObjectId.isValid(userId)) {
      const user = await User.findById(userId);
      if (user) return user._id;
    }
    // 2. Otherwise find by Clerk clerkId
    const user = await User.findOne({ clerkId: userId });
    return user ? user._id : null;
  } catch (err) {
    console.error('Error resolving user:', err);
    return null;
  }
};

// GET /api/bookings/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId }).sort({ createdAt: -1 }).lean();
    res.json(bookings.map(b => ({
      ...b, id: b._id.toString(), userId: b.user?.toString() || null, hotelId: b.hotel.toString(), roomId: b.room.toString(),
    })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/bookings/hotel/:hotelId
router.get('/hotel/:hotelId', async (req, res) => {
  try {
    const bookings = await Booking.find({ hotel: req.params.hotelId }).sort({ createdAt: -1 }).lean();
    res.json(bookings.map(b => ({
      ...b, id: b._id.toString(), userId: b.user?.toString() || null, hotelId: b.hotel.toString(), roomId: b.room.toString(),
    })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/bookings — all bookings (admin)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
    res.json(bookings.map(b => ({
      ...b, id: b._id.toString(), userId: b.user?.toString() || null, hotelId: b.hotel.toString(), roomId: b.room.toString(),
    })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/bookings
router.post('/', async (req, res) => {
  try {
    const { 
      userId, hotelId, roomId, roomType, roomNumber, hotelName, 
      type, checkIn, checkOut, nights, totalPrice, paymentMethod,
      guestName, guestEmail, guestPhone, specialRequests, arrivalTime, travelingForWork
    } = req.body;

    // Check availability
    const room = await Room.findById(roomId);
    if (!room || room.availableCount <= 0) {
      return res.status(400).json({ message: 'Room not available' });
    }

    const mongoUserId = await resolveUser(userId);

    const booking = await Booking.create({
      user: mongoUserId, hotel: hotelId, room: roomId,
      roomType, roomNumber, hotelName, type: type || 'ONLINE',
      status: 'CONFIRMED', checkIn, checkOut, nights, totalPrice, paymentMethod,
      guestName, guestEmail, guestPhone, specialRequests, arrivalTime, travelingForWork
    });

    // Decrease available count
    room.availableCount = Math.max(0, room.availableCount - 1);
    await room.save();

    // Create wallet transaction
    await WalletTransaction.create({
      hotel: hotelId, booking: booking._id, amount: totalPrice, type: 'CREDIT',
      description: `Booking ${booking._id} — ${roomType}`,
    });

    // Create notification
    await Notification.create({
      recipientId: hotelId, type: 'BOOKING', title: 'New Booking',
      message: `New ${roomType} booking for ${checkIn} to ${checkOut}. Total: ৳${totalPrice}`,
    });

    res.status(201).json({
      ...booking.toObject(), id: booking._id.toString(),
      userId: booking.user?.toString() || null, hotelId: booking.hotel.toString(), roomId: booking.room.toString(),
    });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PATCH /api/bookings/:id/cancel
router.patch('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = 'CANCELLED';
    await booking.save();

    // Restore room availability
    const room = await Room.findById(booking.room);
    if (room) { room.availableCount += 1; await room.save(); }

    res.json({
      ...booking.toObject(), id: booking._id.toString(),
      userId: booking.user?.toString() || null, hotelId: booking.hotel.toString(), roomId: booking.room.toString(),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/bookings/:id/checkin
router.patch('/:id/checkin', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    // Mark as confirmed if pending
    if (booking.status === 'PENDING') booking.status = 'CONFIRMED';
    await booking.save();

    await Notification.create({
      recipientId: booking.hotel.toString(), type: 'CHECKIN', title: 'Guest Checked In',
      message: `Guest checked in for booking ${booking._id}`,
    });

    res.json({
      ...booking.toObject(), id: booking._id.toString(),
      userId: booking.user?.toString() || null, hotelId: booking.hotel.toString(), roomId: booking.room.toString(),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/bookings/:id/checkout
router.patch('/:id/checkout', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    await booking.save();

    // Restore room availability
    const room = await Room.findById(booking.room);
    if (room) { room.availableCount += 1; await room.save(); }

    res.json({
      ...booking.toObject(), id: booking._id.toString(),
      userId: booking.user?.toString() || null, hotelId: booking.hotel.toString(), roomId: booking.room.toString(),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/bookings/process-payment
router.post('/process-payment', async (req, res) => {
  try {
    const { 
      userId, hotelId, roomId, checkIn, checkOut, nights, paymentMethod,
      guestName, guestEmail, guestPhone, specialRequests, arrivalTime, travelingForWork
    } = req.body;

    // Check availability
    const room = await Room.findById(roomId);
    if (!room || room.availableCount <= 0) {
      return res.status(400).json({ message: 'Room not available' });
    }

    // Determine price (priority: discountPrice > pricePerNight)
    const unitPrice = room.discountPrice || room.pricePerNight;
    const totalPrice = unitPrice * nights;

    const mongoUserId = await resolveUser(userId);

    const booking = await Booking.create({
      user: mongoUserId, hotel: hotelId, room: roomId,
      roomType: room.type, hotelName: 'Stay Buddy Managed', type: 'ONLINE',
      status: 'CONFIRMED', checkIn, checkOut, nights, totalPrice, paymentMethod,
      guestName, guestEmail, guestPhone, specialRequests, arrivalTime, travelingForWork
    });

    // Decrease available count
    room.availableCount = Math.max(0, room.availableCount - 1);
    await room.save();

    // Create wallet transaction
    await WalletTransaction.create({
      hotel: hotelId, booking: booking._id, amount: totalPrice, type: 'CREDIT',
      description: `Confirmed Online Booking — ${room.type}`,
    });

    // Create notification
    await Notification.create({
      recipientId: hotelId, type: 'BOOKING', title: 'Payment Success',
      message: `New paid booking for ${room.type}. Revenue: ৳${totalPrice}`,
    });

    res.status(201).json({
      message: 'Payment processed and booking confirmed!',
      booking: { ...booking.toObject(), id: booking._id.toString() }
    });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
