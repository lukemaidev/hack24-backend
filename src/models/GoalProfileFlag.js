const mongoose = require('mongoose');

const goalProfileFlagSchema = new mongoose.Schema(
  {
    goalProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'GoalProfile', required: true },
    flaggedCategory: { type: String },
    flaggedAt: { type: Date },
    reviewedBy: { type: String },
    actionTaken: { type: String, enum: ['blocked', 'allowed', 'modified'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GoalProfileFlag', goalProfileFlagSchema);
