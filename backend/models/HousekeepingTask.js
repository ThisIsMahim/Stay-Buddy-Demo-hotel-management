const mongoose = require('mongoose');

const HousekeepingTaskSchema = new mongoose.Schema(
  {
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    roomType: { type: String, required: true },
    floorNumber: { type: Number, required: true },
    status: { type: String, enum: ['AVAILABLE', 'OCCUPIED', 'CLEANING', 'MAINTENANCE', 'BLOCKED'], default: 'AVAILABLE' },
    assignedTo: { type: String },
    notes: { type: String },
    lastCleaned: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HousekeepingTask', HousekeepingTaskSchema);
