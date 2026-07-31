const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const ExperienceBooking = require('../models/ExperienceBooking');
const ExperienceReview = require('../models/ExperienceReview');

// Helper: map _id to id for frontend compatibility
const mapExp = (e) => ({ ...e, id: e._id.toString(), ownerId: e.owner?.toString() || '', hotelId: e.hotel?.toString() || '' });

// GET /api/experiences — search/filter
router.get('/', async (req, res) => {
  try {
    const { city, category, tag, minPrice, maxPrice, minRating, query, sortBy, isActive, ownerId } = req.query;
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (ownerId) filter.owner = ownerId;
    if (city) filter.city = new RegExp(city, 'i');
    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };
    if (query) {
      filter.$or = [
        { title: new RegExp(query, 'i') },
        { city: new RegExp(query, 'i') },
        { description: new RegExp(query, 'i') },
      ];
    }

    let sort = { updatedAt: -1 };
    if (sortBy === 'rating') sort = { rating: -1 };
    else if (sortBy === 'price_asc') sort = { price: 1 };
    else if (sortBy === 'price_desc') sort = { price: -1 };
    else if (sortBy === 'newest') sort = { createdAt: -1 };

    const experiences = await Experience.find(filter).sort(sort).lean();
    res.json(experiences.map(mapExp));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/experiences/:id
router.get('/:id', async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id).lean();
    if (!exp) return res.status(404).json({ message: 'Experience not found' });
    res.json(mapExp(exp));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

const { uploadImages } = require('../utils/uploadHelpers');

// POST /api/experiences
router.post('/', async (req, res) => {
  try {
    let images = req.body.images || [];
    if (req.body.image && !images.includes(req.body.image)) images.push(req.body.image);
    
    const uploaded = await uploadImages(images, 'staybuddy/experiences');
    
    const expData = { ...req.body, owner: req.body.ownerId, hotel: req.body.hotelId || undefined };
    if (uploaded.length > 0) {
      expData.images = uploaded;
      expData.image = uploaded[0];
    }

    const exp = await Experience.create(expData);
    res.status(201).json(mapExp(exp.toObject()));
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PATCH /api/experiences/:id
router.patch('/:id', async (req, res) => {
  try {
    let images = req.body.images;
    if (req.body.image && images && !images.includes(req.body.image)) images.push(req.body.image);

    if (images) {
      const uploaded = await uploadImages(images, 'staybuddy/experiences');
      req.body.images = uploaded;
      if (uploaded.length > 0) req.body.image = uploaded[0];
    } else if (req.body.image && req.body.image.startsWith('data:image')) {
      const uploaded = await uploadImages([req.body.image], 'staybuddy/experiences');
      req.body.image = uploaded[0];
    }

    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!exp) return res.status(404).json({ message: 'Experience not found' });
    res.json(mapExp(exp));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/experiences/:id
router.delete('/:id', async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/experiences/:id/active
router.patch('/:id/active', async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ message: 'Not found' });
    exp.isActive = !exp.isActive;
    await exp.save();
    res.json(mapExp(exp.toObject()));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/experiences/:id/soldout
router.patch('/:id/soldout', async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ message: 'Not found' });
    exp.isSoldOut = !exp.isSoldOut;
    await exp.save();
    res.json(mapExp(exp.toObject()));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/experiences/:id/book
router.post('/:id/book', async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ message: 'Experience not found' });
    const { userId, userName, userEmail, date, guests, paymentMethod } = req.body;
    const booking = await ExperienceBooking.create({
      experience: exp._id, experienceTitle: exp.title,
      user: userId, userName, userEmail, date, guests,
      totalPrice: exp.price * guests, status: 'CONFIRMED', paymentMethod,
    });
    res.status(201).json({
      ...booking.toObject(), id: booking._id.toString(),
      experienceId: booking.experience.toString(), userId: booking.user.toString(),
    });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// GET /api/experiences/bookings/:userId
router.get('/bookings/:userId', async (req, res) => {
  try {
    const bookings = await ExperienceBooking.find({ user: req.params.userId }).sort({ createdAt: -1 }).lean();
    res.json(bookings.map(b => ({
      ...b, id: b._id.toString(), experienceId: b.experience.toString(), userId: b.user.toString(),
    })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/experiences/:id/reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await ExperienceReview.find({ experience: req.params.id }).sort({ createdAt: -1 }).lean();
    res.json(reviews.map(r => ({
      ...r, id: r._id.toString(), experienceId: r.experience.toString(), userId: r.user.toString(),
    })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/experiences/:id/reviews
router.post('/:id/reviews', async (req, res) => {
  try {
    const { userId, userName, rating, comment } = req.body;
    const review = await ExperienceReview.create({
      experience: req.params.id, user: userId, userName, rating, comment,
    });

    // Update experience rating
    const allReviews = await ExperienceReview.find({ experience: req.params.id });
    const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    await Experience.findByIdAndUpdate(req.params.id, { rating: Math.round(avg * 100) / 100, reviews: allReviews.length });

    res.status(201).json({
      ...review.toObject(), id: review._id.toString(), experienceId: review.experience.toString(), userId: review.user.toString(),
    });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
