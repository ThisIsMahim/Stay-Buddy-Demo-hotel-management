const mongoose = require('mongoose');

const ExperienceReviewSchema = new mongoose.Schema(
  {
    experience: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ExperienceReview', ExperienceReviewSchema);
