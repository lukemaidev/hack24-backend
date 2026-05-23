const PortalDailyRefresh = require('../models/PortalDailyRefresh');

const getAll = async (req, res, next) => {
  try {
    const data = await PortalDailyRefresh.find();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const data = await PortalDailyRefresh.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'PortalDailyRefresh not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const data = await PortalDailyRefresh.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const data = await PortalDailyRefresh.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'PortalDailyRefresh not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const data = await PortalDailyRefresh.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'PortalDailyRefresh not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };
