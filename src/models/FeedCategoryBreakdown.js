const mongoose = require('mongoose');

const feedCategoryBreakdownSchema = new mongoose.Schema(
  {
    weeklyScoreId: { type: mongoose.Schema.Types.ObjectId, ref: 'WeeklyHealthScore', required: true },
    category: { type: String },
    percentage: { type: Number, min: 0, max: 100 },
    alignmentStatus: { type: String, enum: ['green', 'amber', 'red'] },
    exampleItemIds: [{ type: mongoose.Schema.Types.ObjectId }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeedCategoryBreakdown', feedCategoryBreakdownSchema);
