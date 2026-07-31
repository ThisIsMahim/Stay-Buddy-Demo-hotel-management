const mongoose = require('mongoose');

/**
 * HotelService — Extra services offered by a specific hotel.
 * Categories: Food (Room Service), Spa, Transport (Airport Pickup/Drop), Gym, Other
 */
const HotelServiceSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      enum: ['Food', 'Spa', 'Transport', 'Gym', 'Other'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0, // 0 = FREE
      default: 0,
    },
    currency: {
      type: String,
      default: 'BDT',
    },
    icon: {
      type: String, // emoji or icon name (e.g. "🧘", "🏋️", "🚗")
      default: '⭐',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HotelService', HotelServiceSchema);
