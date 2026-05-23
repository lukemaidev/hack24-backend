const mongoose = require('mongoose');

const auditHistorySnapshotSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weeklyScoreId: { type: mongoose.Schema.Types.ObjectId, ref: 'WeeklyHealthScore' },
    snapshotDate: { type: Date },
    overallScore: { type: Number },
    relevanceScore: { type: Number },
    qualityScore: { type: Number },
    diversityScore: { type: Number },
    trajectoryScore: { type: Number },
    categoryBreakdown: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditHistorySnapshot', auditHistorySnapshotSchema);
