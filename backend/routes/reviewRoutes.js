const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Hotel = require('../models/Hotel');
const User = require('../models/User');

// GET /api/reviews/hotel/:hotelId
router.get('/hotel/:hotelId', async (req, res) => {
  try {
    const reviews = await Review.find({ hotel: req.params.hotelId }).sort({ createdAt: -1 }).lean();
    res.json(reviews.map(r => ({
      ...r, id: r._id.toString(), userId: r.user.toString(), hotelId: r.hotel.toString(),
    })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/reviews — all reviews (admin)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    res.json(reviews.map(r => ({
      ...r, id: r._id.toString(), userId: r.user.toString(), hotelId: r.hotel.toString(),
    })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/reviews
router.post('/', async (req, res) => {
  try {
    const { userId, userName, hotelId, rating, comment, type } = req.body;
    
    // Find MongoDB user ID from Clerk ID
    const userDoc = await User.findOne({ clerkId: userId });
    if (!userDoc) {
      return res.status(404).json({ message: 'Internal user not found for this clerkId.' });
    }

    const review = await Review.create({ user: userDoc._id, userName, hotel: hotelId, rating, comment, type: type || 'REVIEW' });

    // Update hotel rating
    const allReviews = await Review.find({ hotel: hotelId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Hotel.findByIdAndUpdate(hotelId, { rating: Math.round(avgRating * 10) / 10, totalReviews: allReviews.length });

    res.status(201).json({ ...review.toObject(), id: review._id.toString(), userId: review.user.toString(), hotelId: review.hotel.toString() });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE /api/reviews/:id
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // Recalculate hotel rating
    const allReviews = await Review.find({ hotel: review.hotel });
    const avgRating = allReviews.length > 0 ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length : 0;
    await Hotel.findByIdAndUpdate(review.hotel, { rating: Math.round(avgRating * 10) / 10, totalReviews: allReviews.length });

    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
