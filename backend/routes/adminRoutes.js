const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Advertisement = require('../models/Advertisement');
const HousekeepingTask = require('../models/HousekeepingTask');
const DynamicPricingRule = require('../models/DynamicPricingRule');
const Notification = require('../models/Notification');

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalHotels, totalBookings, totalRooms, totalReviews] = await Promise.all([
      User.countDocuments(),
      Hotel.countDocuments(),
      Booking.countDocuments(),
      Room.countDocuments(),
      Review.countDocuments(),
    ]);

    const revenue = await Booking.aggregate([
      { $match: { status: 'CONFIRMED' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    res.json({
      totalUsers, totalHotels, totalBookings, totalRooms, totalReviews,
      totalRevenue: revenue[0]?.total || 0,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Ads ──
router.get('/ads', async (req, res) => {
  try {
    const ads = await Advertisement.find().sort({ createdAt: -1 }).lean();
    res.json(ads.map(a => ({ ...a, id: a._id.toString(), hotelId: a.hotel.toString() })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Housekeeping ──
router.get('/housekeeping/:hotelId', async (req, res) => {
  try {
    const tasks = await HousekeepingTask.find({ hotel: req.params.hotelId }).lean();
    res.json(tasks.map(t => ({
      ...t, id: t._id.toString(), hotelId: t.hotel.toString(), roomId: t.room.toString(),
    })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch('/housekeeping/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const task = await HousekeepingTask.findByIdAndUpdate(
      req.params.id,
      { status, ...(notes !== undefined && { notes }) },
      { new: true }
    ).lean();
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ ...task, id: task._id.toString(), hotelId: task.hotel.toString(), roomId: task.room.toString() });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Dynamic Pricing ──
router.get('/pricing/:hotelId', async (req, res) => {
  try {
    const rules = await DynamicPricingRule.find({ hotel: req.params.hotelId }).lean();
    res.json(rules.map(r => ({ ...r, id: r._id.toString(), hotelId: r.hotel.toString(), roomId: r.room.toString() })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/pricing', async (req, res) => {
  try {
    const rule = await DynamicPricingRule.create({ ...req.body, hotel: req.body.hotelId, room: req.body.roomId });
    res.status(201).json({ ...rule.toObject(), id: rule._id.toString(), hotelId: rule.hotel.toString(), roomId: rule.room.toString() });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/pricing/:id', async (req, res) => {
  try {
    await DynamicPricingRule.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Guest Profiles (CRM) ──
router.get('/guests/:hotelId', async (req, res) => {
  try {
    const bookings = await Booking.find({ hotel: req.params.hotelId, status: 'CONFIRMED' }).populate('user', 'name email phone').lean();
    const profiles = {};
    bookings.forEach(b => {
      const uid = b.user?._id?.toString();
      if (!uid) return;
      if (!profiles[uid]) {
        profiles[uid] = {
          userId: uid, name: b.user.name, email: b.user.email, phone: b.user.phone || '',
          totalBookings: 0, totalSpent: 0, lastStay: '', preferredRoomType: b.roomType,
        };
      }
      profiles[uid].totalBookings++;
      profiles[uid].totalSpent += b.totalPrice;
      if (!profiles[uid].lastStay || b.checkOut > profiles[uid].lastStay) profiles[uid].lastStay = b.checkOut;
    });
    res.json(Object.values(profiles));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Occupancy Report ──
router.get('/occupancy/:hotelId', async (req, res) => {
  try {
    const { year, month } = req.query;
    const y = parseInt(year); const m = parseInt(month);
    const monthStr = `${y}-${String(m).padStart(2,'0')}`;
    const rooms = await Room.find({ hotel: req.params.hotelId }).lean();
    const bookings = await Booking.find({ hotel: req.params.hotelId, status: 'CONFIRMED' }).lean();

    const daysInMonth = new Date(y, m, 0).getDate();
    const roomStats = rooms.map(room => {
      const roomBookings = bookings.filter(b => b.room.toString() === room._id.toString() && b.checkIn.startsWith(monthStr));
      const rev = roomBookings.reduce((s, b) => s + b.totalPrice, 0);
      return {
        roomId: room._id.toString(), roomType: room.type,
        totalBookings: roomBookings.length, totalRevenue: rev,
        occupancyRate: Math.round((roomBookings.length / daysInMonth) * 100),
      };
    });

    res.json({
      month: monthStr, hotelId: req.params.hotelId, roomStats,
      totalRevenue: roomStats.reduce((s, r) => s + r.totalRevenue, 0),
      avgOccupancyRate: roomStats.length > 0 ? Math.round(roomStats.reduce((s, r) => s + r.occupancyRate, 0) / roomStats.length) : 0,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
