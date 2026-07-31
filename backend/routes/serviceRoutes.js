const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const HotelService = require('../models/HotelService');
const ServiceRequest = require('../models/ServiceRequest');

// ---------------------------------------------------------------------------
// AUTH MIDDLEWARE STUBS
// Replace these with your actual middleware (e.g. from middleware/auth.js)
// ---------------------------------------------------------------------------
const protect = (req, res, next) => {
  // In production: verify JWT, attach req.user
  // e.g. const user = verifyToken(req.headers.authorization);
  // req.user = user;
  req.user = { _id: req.body.userId || req.query.userId || 'user_1' }; // STUB
  next();
};

// ---------------------------------------------------------------------------
// HELPER: Validate that the user has an active/upcoming CONFIRMED booking
//         at the target hotel. Used as middleware before service requests.
// ---------------------------------------------------------------------------
const requireActiveBooking = async (req, res, next) => {
  try {
    const { hotelId, bookingId } = req.body;

    if (!hotelId || !bookingId) {
      return res.status(400).json({
        success: false,
        message: 'hotelId and bookingId are required to request a service.',
      });
    }

    // Dynamically require Booking model (avoids circular imports if needed)
    let Booking;
    try {
      Booking = require('../models/Booking');
    } catch (_) {
      // If Booking model doesn't exist yet in this project, skip DB check
      // and let it through (mock / dev mode)
      console.warn('⚠️  Booking model not found — skipping booking validation (dev mode).');
      return next();
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user._id,
      hotel: hotelId,
      status: 'CONFIRMED',
    });

    if (!booking) {
      return res.status(403).json({
        success: false,
        message:
          'You do not have a valid confirmed booking at this hotel. Service requests are only available for active or upcoming stays.',
      });
    }

    // Attach to request for downstream use
    req.booking = booking;
    next();
  } catch (error) {
    console.error('Active booking check error:', error);
    res.status(500).json({ success: false, message: 'Could not verify booking status.' });
  }
};

// ===========================================================================
// @route   GET /api/services/:hotelId
// @desc    Fetch all ACTIVE extra services for a specific hotel
// @access  Public
// ===========================================================================
router.get('/:hotelId', async (req, res) => {
  try {
    const { hotelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({ success: false, message: 'Invalid hotelId format.' });
    }

    const services = await HotelService.find({ hotel: hotelId, isAvailable: true }).sort({
      category: 1,
      name: 1,
    });

    // Group by category for easier frontend rendering
    const grouped = services.reduce((acc, svc) => {
      if (!acc[svc.category]) acc[svc.category] = [];
      acc[svc.category].push(svc);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
      grouped,
    });
  } catch (error) {
    console.error('Error fetching hotel services:', error);
    res.status(500).json({ success: false, message: 'Server error fetching services.' });
  }
});

// ===========================================================================
// @route   POST /api/services/request
// @desc    Submit a new service request (user must have active booking at hotel)
// @access  Private (authenticated user)
// ===========================================================================
router.post('/request', protect, requireActiveBooking, async (req, res) => {
  try {
    const { hotelId, bookingId, serviceId, requestedDateTime, specialNotes } = req.body;

    // Validate required fields
    if (!serviceId || !requestedDateTime) {
      return res.status(400).json({
        success: false,
        message: 'serviceId and requestedDateTime are required.',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ success: false, message: 'Invalid serviceId format.' });
    }

    // Fetch the service to validate & snapshot price
    const service = await HotelService.findOne({ _id: serviceId, hotel: hotelId, isAvailable: true });
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or is currently unavailable at this hotel.',
      });
    }

    // Validate requested datetime is in the future
    const reqDate = new Date(requestedDateTime);
    if (isNaN(reqDate.getTime()) || reqDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'requestedDateTime must be a valid future date/time.',
      });
    }

    const serviceRequest = await ServiceRequest.create({
      user: req.user._id,
      booking: bookingId,
      hotel: hotelId,
      service: serviceId,
      priceAtRequest: service.price, // Snapshot price at time of request
      requestedDateTime: reqDate,
      specialNotes: specialNotes?.trim() || '',
      status: 'Pending',
    });

    // Populate for rich response
    await serviceRequest.populate('service', 'name category icon');

    res.status(201).json({
      success: true,
      message: `Your request for "${service.name}" has been submitted. The hotel will confirm shortly.`,
      data: serviceRequest,
    });
  } catch (error) {
    console.error('Error creating service request:', error);
    res.status(500).json({ success: false, message: 'Server error. Could not submit service request.' });
  }
});

// ===========================================================================
// @route   GET /api/services/my-requests/:bookingId
// @desc    Fetch all service requests for a specific booking (by user)
// @access  Private
// ===========================================================================
router.get('/my-requests/:bookingId', protect, async (req, res) => {
  try {
    const { bookingId } = req.params;

    const requests = await ServiceRequest.find({
      booking: bookingId,
      user: req.user._id,
    })
      .populate('service', 'name category icon price')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    console.error('Error fetching service requests:', error);
    res.status(500).json({ success: false, message: 'Server error fetching service requests.' });
  }
});

// ===========================================================================
// @route   PATCH /api/services/request/:id/status
// @desc    Update service request status (Hotel Owner / Admin only)
// @access  Private (Owner/Admin)
// ===========================================================================
router.patch('/request/:id/status', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, hotelNotes } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const request = await ServiceRequest.findByIdAndUpdate(
      id,
      { status, hotelNotes: hotelNotes || '' },
      { new: true }
    ).populate('service', 'name category icon');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found.' });
    }

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    console.error('Error updating service request status:', error);
    res.status(500).json({ success: false, message: 'Server error updating status.' });
  }
});

// ===========================================================================
// @route   GET /api/services/hotel-requests/:hotelId
// @desc    Fetch all service requests for a hotel (Owner Dashboard view)
// @access  Private (Owner/Admin)
// ===========================================================================
router.get('/hotel-requests/:hotelId', protect, async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { status } = req.query;

    const filter = { hotel: hotelId };
    if (status) filter.status = status;

    const requests = await ServiceRequest.find(filter)
      .populate('user', 'name email')
      .populate('service', 'name category icon price')
      .populate('booking', 'checkIn checkOut roomType')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    console.error('Error fetching hotel service requests:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ===========================================================================
// SEED ROUTE (DEV ONLY) — POST /api/services/seed/:hotelId
// Seeds sample services for testing. Remove in production.
// ===========================================================================
if (process.env.NODE_ENV !== 'production') {
  router.post('/seed/:hotelId', async (req, res) => {
    try {
      const { hotelId } = req.params;
      await HotelService.deleteMany({ hotel: hotelId });

      const seeds = [
        { hotel: hotelId, name: 'Room Service (Full Menu)', description: 'Order from our full in-room dining menu, available 24/7.', category: 'Food', price: 0, icon: '🍽️', isAvailable: true },
        { hotel: hotelId, name: 'Breakfast in Bed', description: 'Premium continental breakfast delivered to your room.', category: 'Food', price: 350, icon: '🍳', isAvailable: true },
        { hotel: hotelId, name: 'Full Body Spa Massage (60 min)', description: 'Rejuvenating full body massage by certified therapists.', category: 'Spa', price: 1800, icon: '💆', isAvailable: true },
        { hotel: hotelId, name: 'Couples Spa Package', description: 'Romantic spa session for two — aromatherapy & hot stone.', category: 'Spa', price: 3200, icon: '🧘', isAvailable: true },
        { hotel: hotelId, name: 'Gym Access (Day Pass)', description: 'Full access to our state-of-the-art fitness center.', category: 'Gym', price: 0, icon: '🏋️', isAvailable: true },
        { hotel: hotelId, name: 'Personal Trainer (1 Hour)', description: 'One-on-one session with a certified personal trainer.', category: 'Gym', price: 900, icon: '💪', isAvailable: true },
        { hotel: hotelId, name: 'Airport Pickup', description: 'Door-to-door luxury car pickup from the airport.', category: 'Transport', price: 800, icon: '✈️', isAvailable: true },
        { hotel: hotelId, name: 'Airport Drop', description: 'Comfortable car drop-off to your departure terminal.', category: 'Transport', price: 800, icon: '🚗', isAvailable: true },
        { hotel: hotelId, name: 'City Tour (Half Day)', description: 'Guided sightseeing tour of key city landmarks (4 hours).', category: 'Transport', price: 1500, icon: '🗺️', isAvailable: true },
      ];

      const created = await HotelService.insertMany(seeds);
      res.status(201).json({ success: true, message: `${created.length} services seeded.`, data: created });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
}

module.exports = router;
