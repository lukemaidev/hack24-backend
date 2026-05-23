const mongoose = require('mongoose');

const shareableScoreCardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weeklyScoreId: { type: mongoose.Schema.Types.ObjectId, ref: 'WeeklyHealthScore' },
    trigger: { type: String, enum: ['first_score', 'weekly_summary', 'milestone'] },
    cardImageUrl: { type: String },
    sharedAt: { type: Date },
    platformSharedTo: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShareableScoreCard', shareableScoreCardSchema);
