const mongoose = require('mongoose');

const userMentorPrescriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    goalProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'GoalProfile' },
    generatedAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserMentorPrescription', userMentorPrescriptionSchema);
