const mongoose = require('mongoose');

const mentorGoalMappingSchema = new mongoose.Schema(
  {
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
    goalArchetype: { type: String },
    relevanceScore: { type: Number, min: 0, max: 100 },
    mappedBy: { type: String, enum: ['human', 'ai'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MentorGoalMapping', mentorGoalMappingSchema);
