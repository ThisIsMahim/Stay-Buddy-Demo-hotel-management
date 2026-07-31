const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userName: { type: String, required: true },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, default: '' },
    type: { type: String, enum: ['REVIEW', 'COMPLAINT'], default: 'REVIEW' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', ReviewSchema);
