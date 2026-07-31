const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');

// GET /api/rooms/hotel/:hotelId
router.get('/hotel/:hotelId', async (req, res) => {
  try {
    const rooms = await Room.find({ hotel: req.params.hotelId }).lean();
    res.json(rooms.map(r => ({ ...r, id: r._id.toString(), hotelId: r.hotel.toString() })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/rooms — all rooms (admin)
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find().populate('hotel', 'name').lean();
    res.json(rooms.map(r => ({
      ...r,
      id: r._id.toString(),
      hotelId: r.hotel?._id?.toString() || '',
      hotelName: r.hotel?.name || '',
    })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

const { uploadImages } = require('../utils/uploadHelpers');

// POST /api/rooms
router.post('/', async (req, res) => {
  try {
    const { images: imgPayload, category, ...roomData } = req.body;
    const uploadedImages = await uploadImages(imgPayload, 'staybuddy/rooms');
    const room = await Room.create({ 
      ...roomData, 
      category: category || "Single Bed",
      hotel: req.body.hotelId, 
      images: uploadedImages 
    });
    res.status(201).json({ ...room.toObject(), id: room._id.toString(), hotelId: room.hotel.toString() });
  } catch (err) { 
    console.error('Add room error:', err);
    res.status(400).json({ message: err.message }); 
  }
});

// PATCH /api/rooms/:id
router.patch('/:id', async (req, res) => {
  try {
    if (req.body.images) {
      req.body.images = await uploadImages(req.body.images, 'staybuddy/rooms');
    }
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ ...room, id: room._id.toString(), hotelId: room.hotel.toString() });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/rooms/:id
router.delete('/:id', async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/rooms/:id/price
router.patch('/:id/price', async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, { pricePerNight: req.body.pricePerNight }, { new: true }).lean();
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ ...room, id: room._id.toString(), hotelId: room.hotel.toString() });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/rooms/:id/inventory
router.patch('/:id/inventory', async (req, res) => {
  try {
    const { totalInventory, availableCount } = req.body;
    const room = await Room.findByIdAndUpdate(
      req.params.id, 
      { totalInventory, availableCount }, 
      { new: true }
    ).lean();
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ ...room, id: room._id.toString(), hotelId: room.hotel.toString() });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/rooms/:id/discount
router.patch('/:id/discount', async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, { discountPrice: req.body.discountPrice }, { new: true }).lean();
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ ...room, id: room._id.toString(), hotelId: room.hotel.toString() });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/rooms/:id/calendar?year=2026&month=3
router.get('/:id/calendar', async (req, res) => {
  try {
    const { year, month } = req.query;
    const y = parseInt(year); const m = parseInt(month);
    const daysInMonth = new Date(y, m, 0).getDate();
    const room = await Room.findById(req.params.id).lean();
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const bookings = await Booking.find({
      room: req.params.id,
      status: 'CONFIRMED',
    }).lean();

    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayBookings = bookings.filter(b => dateStr >= b.checkIn && dateStr < b.checkOut);
      days.push({
        date: dateStr,
        isBooked: dayBookings.length >= room.totalInventory,
        bookingId: dayBookings[0]?._id?.toString(),
        guestName: '',
        availableCount: Math.max(0, room.totalInventory - dayBookings.length),
        totalCount: room.totalInventory,
      });
    }
    res.json(days);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
