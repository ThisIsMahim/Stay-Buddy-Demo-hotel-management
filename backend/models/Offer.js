const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema(
  {
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    hotelName: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    discountPercent: { type: Number, required: true, min: 0, max: 100 },
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true },
    startDate: { type: String },
    endDate: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Offer', OfferSchema);
