const mongoose = require('mongoose');

const goalProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rawIntakeAnswers: { type: mongoose.Schema.Types.Mixed },
    goalArchetype: { type: String },
    goalSummary: { type: String },
    timeframe: { type: String },
    startingPoint: { type: String },
    successDefinition: { type: String },
    version: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GoalProfile', goalProfileSchema);
