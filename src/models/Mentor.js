const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    handle: { type: String },
    bio: { type: String },
    avatarUrl: { type: String },
    goalArchetypes: [{ type: String }],
    primaryPlatform: { type: String },
    allPlatforms: { type: mongoose.Schema.Types.Mixed },
    qualityScore: { type: Number, min: 0, max: 100 },
    credibilityScore: { type: Number, min: 0, max: 100 },
    isCurated: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    addedAt: { type: Date },
    retiredAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mentor', mentorSchema);
