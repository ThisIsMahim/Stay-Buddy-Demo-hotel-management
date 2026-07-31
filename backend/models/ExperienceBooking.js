const mongoose = require('mongoose');

const ExperienceBookingSchema = new mongoose.Schema(
  {
    experience: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience', required: true, index: true },
    experienceTitle: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    date: { type: String, required: true },
    guests: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['CONFIRMED', 'CANCELLED', 'PENDING'], default: 'PENDING' },
    paymentMethod: { type: String, enum: ['card', 'bkash', 'cash'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ExperienceBooking', ExperienceBookingSchema);
