const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    hotelName: { type: String },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    city: { type: String, required: true },
    location: { type: String },
    meetingPoint: { type: String },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    image: { type: String },
    images: [{ type: String }],
    badge: { type: String, default: '' },
    category: { type: String, enum: ['original', 'standard'], default: 'standard' },
    tags: [{ type: String }],
    highlights: [{ type: String }],
    duration: { type: String },
    maxGuests: { type: Number },
    spokenLanguages: [{ type: String }],
    amenities: [{ type: String }],
    services: [{ type: String }],
    whatIncludes: [{ type: String }],
    whatToBring: [{ type: String }],
    whatNotIncluded: [{ type: String }],
    hostName: { type: String },
    hostImage: { type: String },
    hostBio: { type: String },
    cancellationPolicy: { type: String },
    ageRequirement: { type: String },
    isSoldOut: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ExperienceSchema.index({ title: 'text', city: 'text', description: 'text' });

module.exports = mongoose.model('Experience', ExperienceSchema);
