const mongoose = require('mongoose');

const userMilestoneSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    milestoneType: {
      type: String,
      enum: ['first_score', 'score_improved_10', 'portal_streak_7', 'echo_chamber_broken'],
    },
    achievedAt: { type: Date },
    scoreAtTime: { type: Number },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserMilestone', userMilestoneSchema);
