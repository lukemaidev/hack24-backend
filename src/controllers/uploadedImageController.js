const UploadedImage = require('../models/UploadedImage');

// GET /api/uploaded-images  — optionally filter by ?userId=
const getAll = async (req, res, next) => {
  try {
    const filter = req.query.userId ? { userId: req.query.userId } : {};
    const data = await UploadedImage.find(filter).populate('userId', 'email fullName');
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/uploaded-images/:id
const getById = async (req, res, next) => {
  try {
    const data = await UploadedImage.findById(req.params.id).populate('userId', 'email fullName');
    if (!data) return res.status(404).json({ success: false, message: 'UploadedImage not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/uploaded-images/user/:userId  — all images for a specific user
const getByUser = async (req, res, next) => {
  try {
    const data = await UploadedImage.find({ userId: req.params.userId }).populate('userId', 'email fullName');
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// POST /api/uploaded-images
// Body: { userId, url, fileName?, mimeType?, size?, bucket?, storagePath? }
const create = async (req, res, next) => {
  try {
    const { userId, url } = req.body;
    if (!userId || !url) {
      return res.status(400).json({ success: false, message: 'userId and url are required' });
    }
    const data = await UploadedImage.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// PUT /api/uploaded-images/:id
const update = async (req, res, next) => {
  try {
    const data = await UploadedImage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!data) return res.status(404).json({ success: false, message: 'UploadedImage not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/uploaded-images/:id
const remove = async (req, res, next) => {
  try {
    const data = await UploadedImage.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'UploadedImage not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, getByUser, create, update, remove };
