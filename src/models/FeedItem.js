const mongoose = require('mongoose');

const feedItemSchema = new mongoose.Schema(
  {
    submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeedSubmission', required: true },
    platform: { type: String },
    externalId: { type: String },
    contentType: { type: String, enum: ['video', 'post', 'reel', 'article'] },
    creatorHandle: { type: String },
    creatorExternalId: { type: String },
    title: { type: String },
    url: { type: String },
    postedAt: { type: Date },
    engagementSignals: { type: mongoose.Schema.Types.Mixed },
    detectedCategories: [{ type: String }],
    qualityScore: { type: Number, min: 0, max: 100 },
    voyageEmbedding: [{ type: Number }],
    rawData: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeedItem', feedItemSchema);
