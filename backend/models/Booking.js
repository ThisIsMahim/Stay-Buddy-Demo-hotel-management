const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, default: null },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    roomType: { type: String, required: true },
    roomNumber: { type: String },
    hotelName: { type: String, required: true },
    type: { type: String, enum: ['ONLINE', 'OFFLINE'], default: 'ONLINE' },
    status: { type: String, enum: ['CONFIRMED', 'CANCELLED', 'PENDING'], default: 'PENDING', index: true },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    nights: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ['card', 'bkash', 'nagad', 'cash'] },
    guestName: { type: String },
    guestEmail: { type: String },
    guestPhone: { type: String },
    specialRequests: { type: String },
    arrivalTime: { type: String },
    travelingForWork: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);
