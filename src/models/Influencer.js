const mongoose = require('mongoose');

const influencerSchema = new mongoose.Schema(
  {
    Rank: { type: String },
    Platform: { type: String },
    'Source Category': { type: String },
    'Account Name': { type: String, required: true },
    'Subscribers / Followers': { type: String },
    'Views / Likes / Engagement': { type: String },
    'Videos / Posts': { type: String },
    Following: { type: String },
    'Account URL': { type: String },
    'Social Blade Profile URL': { type: String },
    'AI Category Guess': { type: String },
    Snapshot: { type: String },
    embeddedSnapshot: { type: [Number], default: undefined },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Influencer', influencerSchema);
