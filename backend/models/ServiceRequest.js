const mongoose = require('mongoose');

/**
 * ServiceRequest — A user's request for an extra hotel service during an active booking.
 * Status Flow: Pending → Confirmed → Completed (or Cancelled)
 */
const ServiceRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
      index: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HotelService',
      required: true,
    },

    // Snapshot of service price at time of request (for immutable billing)
    priceAtRequest: {
      type: Number,
      required: true,
      min: 0,
    },

    // When the user wants the service
    requestedDateTime: {
      type: Date,
      required: true,
    },

    // E.g., "My flight number is BG 123, arrival at 3:00 PM"
    specialNotes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
      index: true,
    },

    // Optional: staff notes / rejection reason from hotel side
    hotelNotes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);
