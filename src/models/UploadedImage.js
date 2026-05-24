const mongoose = require('mongoose');

const uploadedImageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UploadedImage', uploadedImageSchema);
