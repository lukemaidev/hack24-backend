const mongoose = require('mongoose');

const goalCategorySchema = new mongoose.Schema(
  {
    goalProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'GoalProfile', required: true },
    category: { type: String, required: true },
    targetPercentage: { type: Number, min: 0, max: 100 },
    priority: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GoalCategory', goalCategorySchema);
