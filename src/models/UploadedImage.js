const mongoose = require('mongoose');

const uploadedImageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
    fileName: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    bucket: { type: String },
    storagePath: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UploadedImage', uploadedImageSchema);
