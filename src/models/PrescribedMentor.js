const mongoose = require('mongoose');

const prescribedMentorSchema = new mongoose.Schema(
  {
    prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserMentorPrescription', required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
    whyThisMatters: { type: String },
    isAntiEchoChamberInjection: { type: Boolean, default: false },
    source: { type: String, enum: ['ai_prescribed', 'user_added', 'user_swapped'] },
    position: { type: Number, min: 1, max: 12 },
    addedAt: { type: Date },
    removedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PrescribedMentor', prescribedMentorSchema);
