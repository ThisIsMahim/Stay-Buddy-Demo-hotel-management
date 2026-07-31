const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
// Assuming you have auth middlewares in your actual backend
// const { protect, authorizeSuperAdmin } = require('../middleware/auth');

// Note: Replace "protect" and "authorizeSuperAdmin" with your actual authentication middlewares.
const protect = (req, res, next) => next(); 
const authorizeSuperAdmin = (req, res, next) => next();

// -----------------------------------------------------------------
// @route   POST /api/complaints/create
// @desc    Submit a new complaint
// @access  Private (Logged-in User)
// -----------------------------------------------------------------
router.post('/create', protect, async (req, res) => {
  try {
    const { hotelId, bookingId, description, imageUrl } = req.body;

    // Validate required fields
    if (!hotelId || !description) {
      return res.status(400).json({ success: false, message: 'Hotel and description are required.' });
    }

    const complaint = await Complaint.create({
      user: req.user?._id || req.body.userId, // use req.user._id from auth middleware
      hotel: hotelId,
      booking: bookingId || null,
      description,
      imageUrl: imageUrl || null,
    });

    res.status(201).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ success: false, message: 'Server Error. Could not create complaint.' });
  }
});

// -----------------------------------------------------------------
// @route   GET /api/complaints/admin-all
// @desc    Fetch all complaints for Super Admin Dashboard
// @access  Private (Super Admin)
// -----------------------------------------------------------------
router.get('/admin-all', protect, authorizeSuperAdmin, async (req, res) => {
  try {
    // Populate User and Hotel details
    const complaints = await Complaint.find()
      .populate('user', 'name email')
      .populate('hotel', 'name city')
      .populate('booking', 'roomType checkIn checkOut')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: complaints,
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ success: false, message: 'Server Error. Could not fetch complaints.' });
  }
});

// -----------------------------------------------------------------
// @route   PATCH /api/complaints/:id/status
// @desc    Update complaint status (Admin)
// @access  Private (Super Admin)
// -----------------------------------------------------------------
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    res.json({ success: true, data: complaint });
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ success: false, message: 'Server Error.' });
  }
});

module.exports = router;
