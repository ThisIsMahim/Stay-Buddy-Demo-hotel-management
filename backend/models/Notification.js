const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    recipientId: { type: String, required: true, index: true },
    type: { type: String, enum: ['BOOKING', 'PAYMENT', 'COMPLAINT', 'SYSTEM', 'CHECKIN'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
