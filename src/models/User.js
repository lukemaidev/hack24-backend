const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    subscriptionTier: { type: String, enum: ['free', 'pro'], default: 'free' },
    onboardingCompleted: { type: Boolean, default: false },
    targetCategoryScores: {
      type: Map,
      of: Number,
      default: () => ({
        'Autos & Vehicles': 0,
        'Comedy': 0,
        'Entertainment': 0,
        'Film': 0,
        'Gaming': 0,
        'How To & Style': 0,
        'People & Blogs': 0,
        'Pets & Animals': 0,
        'Science & Technology': 0,
        'Sports': 0,
        'Education': 0,
        'News & Politics': 0,
        'Nonprofit & Activism': 0,
        'Travel': 0,
        'Music': 0,
      }),
    },
    currentCategoryScores: {
      type: Map,
      of: Number,
      default: () => ({
        'Autos & Vehicles': 0,
        'Comedy': 0,
        'Entertainment': 0,
        'Film': 0,
        'Gaming': 0,
        'How To & Style': 0,
        'People & Blogs': 0,
        'Pets & Animals': 0,
        'Science & Technology': 0,
        'Sports': 0,
        'Education': 0,
        'News & Politics': 0,
        'Nonprofit & Activism': 0,
        'Travel': 0,
        'Music': 0,
      }),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
