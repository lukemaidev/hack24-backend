const mongoose = require('mongoose');

const alignedScrollItemSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'AlignedScrollSession', required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' },
    contentUrl: { type: String },
    platform: { type: String },
    positionShown: { type: Number },
    watchDurationSeconds: { type: Number },
    action: { type: String, enum: ['scrolled_past', 'watched', 'tapped_through'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AlignedScrollItem', alignedScrollItemSchema);
