const mongoose = require('mongoose');

const portalDailyRefreshSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    refreshDate: { type: Date, required: true },
    generatedAt: { type: Date },
    status: { type: String, enum: ['pending', 'ready', 'stale'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PortalDailyRefresh', portalDailyRefreshSchema);
