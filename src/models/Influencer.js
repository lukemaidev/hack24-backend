const mongoose = require('mongoose');

const influencerSchema = new mongoose.Schema(
  {
    rank: { type: String },
    platform: { type: String },
    sourceCategory: { type: String },
    accountName: { type: String, required: true },
    subscribersFollowers: { type: String },
    viewsLikesEngagement: { type: String },
    videosPosts: { type: String },
    following: { type: String },
    accountUrl: { type: String },
    socialBladeProfileUrl: { type: String },
    aiCategoryGuess: { type: String },
    snapshot: { type: String },
    embeddedSnapshot: { type: [Number], default: undefined },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Influencer', influencerSchema);
