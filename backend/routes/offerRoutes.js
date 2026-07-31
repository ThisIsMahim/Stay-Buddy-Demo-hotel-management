const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');

// GET /api/offers — all active offers
router.get('/', async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    res.json(offers.map(o => ({ ...o, id: o._id.toString(), hotelId: o.hotel.toString() })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/offers/hotel/:hotelId
router.get('/hotel/:hotelId', async (req, res) => {
  try {
    const offers = await Offer.find({ hotel: req.params.hotelId }).sort({ createdAt: -1 }).lean();
    res.json(offers.map(o => ({ ...o, id: o._id.toString(), hotelId: o.hotel.toString() })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/offers
router.post('/', async (req, res) => {
  try {
    const offer = await Offer.create({ ...req.body, hotel: req.body.hotelId });
    res.status(201).json({ ...offer.toObject(), id: offer._id.toString(), hotelId: offer.hotel.toString() });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PATCH /api/offers/:id
router.patch('/:id', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    res.json({ ...offer, id: offer._id.toString(), hotelId: offer.hotel.toString() });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/offers/:id
router.delete('/:id', async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
