const mongoose = require('mongoose');

const platformConnectionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    platform: {
      type: String,
      enum: ['tiktok', 'youtube', 'instagram', 'linkedin', 'x', 'reddit'],
    },
    connectionMethod: {
      type: String,
      enum: ['oauth', 'export_upload', 'browser_extension'],
    },
    accessToken: { type: String },
    refreshToken: { type: String },
    tokenExpiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
    connectedAt: { type: Date },
    lastSyncedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PlatformConnection', platformConnectionSchema);
