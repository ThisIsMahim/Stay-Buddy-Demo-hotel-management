const mongoose = require('mongoose');

/**
 * User model — extended with notification fields:
 *   - deviceTokens   : array of FCM tokens (user can be logged in on multiple devices)
 *   - emailNotifications / pushNotifications : opt-in flags per channel
 *   - notificationLog : lightweight audit of sent notifications (last 100)
 */
const UserSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────────
    clerkId: { type: String, unique: true, sparse: true },   // Clerk user ID (for customers)
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },               // For Owner/Admin manual login
    phone:   { type: String, trim: true },
    avatar:  { type: String },

    // ── Role & Status ─────────────────────────────────────────
    role:   { type: String, enum: ['ADMIN', 'OWNER', 'USER'], default: 'USER' },
    status: { type: String, enum: ['ACTIVE', 'BLOCKED', 'SUSPENDED'], default: 'ACTIVE' },

    // ── Owner Specific Fields ─────────────────────────────────
    verificationStatus:  { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'] },
    subscriptionEndDate: { type: Date },
    hasAdminOverride:    { type: Boolean, default: false },
    nidDocUrl:           { type: String },
    hotelAuthDocUrl:     { type: String },

    // ── Push Notification Tokens (FCM) ────────────────────────
    // Stored as an array so one user can receive push on phone + browser simultaneously.
    deviceTokens: [
      {
        token:     { type: String, required: true },
        platform:  { type: String, enum: ['web', 'android', 'ios'], default: 'web' },
        userAgent: { type: String },                    // browser/device for display
        lastSeen:  { type: Date, default: Date.now },
      },
    ],

    // ── Notification Preferences ──────────────────────────────
    emailNotifications: {
      bookingConfirmation: { type: Boolean, default: true },
      checkInReminder:     { type: Boolean, default: true },
      checkOutReminder:    { type: Boolean, default: true },
      promotions:          { type: Boolean, default: false },
    },
    pushNotifications: {
      bookingConfirmation: { type: Boolean, default: true },
      checkInReminder:     { type: Boolean, default: true },
      checkOutReminder:    { type: Boolean, default: true },
    },

    // ── Notification Audit Log (last 100) ─────────────────────
    // Stored here to avoid a separate collection for a lightweight audit.
    notificationLog: [
      {
        type:      { type: String, enum: ['EMAIL', 'PUSH', 'BOTH'] },
        event:     { type: String },                    // e.g. 'BOOKING_CONFIRMATION'
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
        sentAt:    { type: Date, default: Date.now },
        status:    { type: String, enum: ['SENT', 'FAILED'], default: 'SENT' },
        error:     { type: String },
      },
    ],
  },
  { timestamps: true }
);

// ── indexes ──────────────────────────────────────────────────
UserSchema.index({ 'deviceTokens.token': 1 });

// ── helper: trim notificationLog to last 100 entries ─────────
UserSchema.pre('save', async function (next) {
  if (this.notificationLog.length > 100) {
    this.notificationLog = this.notificationLog.slice(-100);
  }
  
  // Hash password if modified
  if (this.isModified('password') && this.password) {
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  next();
});

module.exports = mongoose.model('User', UserSchema);
