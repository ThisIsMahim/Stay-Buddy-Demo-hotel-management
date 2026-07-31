const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema(
  {
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    type: { type: String, required: true }, // Custom Room Name
    category: { type: String, required: true, default: 'Deluxe Room' }, // Room Classification
    pricePerNight: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 }, // Optional discount price
    totalInventory: { type: Number, required: true, min: 0 },
    availableCount: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    amenities: [{ type: String }],
    floorNumber: { type: Number, default: 1 },
    description: { type: String },
    capacity: { type: String },
    sizeSqFt: { type: Number },
    viewType: { type: String },
    maxAdults: { type: Number, default: 2 },
    maxChildren: { type: Number, default: 0 },
    petsAllowed: { type: Boolean, default: false },
    beds: { type: Map, of: Number }, // Record<string, number>
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', RoomSchema);
