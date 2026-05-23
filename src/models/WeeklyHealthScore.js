const mongoose = require('mongoose');

const weeklyHealthScoreSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    goalProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'GoalProfile' },
    weekStartDate: { type: Date, required: true },
    overallScore: { type: Number, min: 0, max: 100 },
    relevanceScore: { type: Number, min: 0, max: 100 },
    qualityScore: { type: Number, min: 0, max: 100 },
    diversityScore: { type: Number, min: 0, max: 100 },
    trajectoryScore: { type: Number, min: 0, max: 100 },
    scoreDelta: { type: Number },
    llmDiagnosis: { type: String },
    generatedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WeeklyHealthScore', weeklyHealthScoreSchema);
