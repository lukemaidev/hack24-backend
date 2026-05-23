const mongoose = require('mongoose');

const blockedGoalCategorySchema = new mongoose.Schema(
  {
    categoryName: { type: String, required: true, unique: true },
    reason: { type: String, enum: ['extremism', 'eating_disorder', 'self_harm'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BlockedGoalCategory', blockedGoalCategorySchema);
