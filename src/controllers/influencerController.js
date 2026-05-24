const Influencer = require('../models/Influencer');

// GET /api/influencers
const getAll = async (req, res, next) => {
  try {
    const data = await Influencer.find();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/influencers/:id
const getById = async (req, res, next) => {
  try {
    const data = await Influencer.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Influencer not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// POST /api/influencers
// Body: { accountName, rank?, platform?, sourceCategory?, subscribersFollowers?,
//         viewsLikesEngagement?, videosPosts?, following?, accountUrl?,
//         socialBladeProfileUrl?, aiCategoryGuess?, snapshot? }
const create = async (req, res, next) => {
  try {
    const accountName = req.body['Account Name'];
    if (!accountName) {
      return res.status(400).json({ success: false, message: '"Account Name" is required' });
    }
    const data = await Influencer.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// PUT /api/influencers/:id
const update = async (req, res, next) => {
  try {
    const data = await Influencer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!data) return res.status(404).json({ success: false, message: 'Influencer not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/influencers/:id
const remove = async (req, res, next) => {
  try {
    const data = await Influencer.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Influencer not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/influencers/category/:category
// Returns the top 20 influencers for a given Source Category, sorted by Rank ascending
const getTopByCategory = async (req, res, next) => {
  try {
    const category = req.params.category;

    const data = await Influencer.aggregate([
      { $match: { 'Source Category': category } },
      { $addFields: { rankNum: { $toInt: '$Rank' } } },
      { $sort: { rankNum: 1 } },
      { $limit: 20 },
      { $project: { rankNum: 0 } },
    ]);

    if (!data.length) {
      return res.status(404).json({ success: false, message: `No influencers found for category "${category}"` });
    }

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, getTopByCategory, create, update, remove };
