const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null, // Optional reference
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String, // Proof of the issue
    default: null,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
