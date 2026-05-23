const mongoose = require('mongoose');

const portalTileSchema = new mongoose.Schema(
  {
    refreshId: { type: mongoose.Schema.Types.ObjectId, ref: 'PortalDailyRefresh', required: true },
    prescribedMentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'PrescribedMentor' },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' },
    platform: { type: String },
    contentUrl: { type: String },
    contentType: { type: String, enum: ['video', 'post', 'article', 'podcast'] },
    thumbnailUrl: { type: String },
    previewText: { type: String },
    whyThisMatters: { type: String },
    isFilteredOut: { type: Boolean, default: false },
    filterReason: { type: String },
    positionInGrid: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PortalTile', portalTileSchema);
