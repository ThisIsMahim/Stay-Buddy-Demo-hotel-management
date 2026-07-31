const mongoose = require('mongoose');

const WalletTransactionSchema = new mongoose.Schema(
  {
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['CREDIT', 'DEBIT'], required: true },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WalletTransaction', WalletTransactionSchema);
