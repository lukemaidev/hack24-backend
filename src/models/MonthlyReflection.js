const mongoose = require('mongoose');

const monthlyReflectionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    goalProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'GoalProfile' },
    reflectionDate: { type: Date },
    previousGoalSummary: { type: String },
    goalChanged: { type: Boolean },
    newGoalProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'GoalProfile', default: null },
    userResponse: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MonthlyReflection', monthlyReflectionSchema);
