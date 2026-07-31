const mongoose = require('mongoose');

const AdvertisementSchema = new mongoose.Schema(
  {
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    hotelName: { type: String, required: true },
    imageUrl: { type: String, required: true },
    targetUrl: { type: String },
    isActive: { type: Boolean, default: true },
    startDate: { type: String },
    endDate: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Advertisement', AdvertisementSchema);
