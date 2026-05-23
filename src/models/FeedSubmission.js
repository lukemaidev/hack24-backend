const mongoose = require('mongoose');

const feedSubmissionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    platformConnectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'PlatformConnection' },
    platform: { type: String },
    rawPayload: { type: mongoose.Schema.Types.Mixed },
    submittedAt: { type: Date },
    processedAt: { type: Date },
    status: {
      type: String,
      enum: ['pending', 'processing', 'complete', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeedSubmission', feedSubmissionSchema);
