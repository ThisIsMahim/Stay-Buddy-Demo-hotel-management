const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    locationLat: { type: Number, default: 0 },
    locationLng: { type: Number, default: 0 },
    images: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isRedMarked: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    amenities: [{ type: String }],
    checkInTime: { type: String, default: '14:00 PM' },
    checkOutTime: { type: String, default: '12:00 PM' },
    acceptedPayments: [{ type: String }],
  },
  { timestamps: true }
);

HotelSchema.index({ name: 'text', city: 'text', address: 'text', description: 'text' });

module.exports = mongoose.model('Hotel', HotelSchema);
