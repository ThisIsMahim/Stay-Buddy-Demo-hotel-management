const mongoose = require('mongoose');

const DynamicPricingRuleSchema = new mongoose.Schema(
  {
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    label: { type: String, required: true },
    multiplier: { type: Number, required: true, min: 0 },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DynamicPricingRule', DynamicPricingRuleSchema);
