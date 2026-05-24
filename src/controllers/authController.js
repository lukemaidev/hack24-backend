const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

const signToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const signup = async (req, res, next) => {
  try {
    const { email, fullName, subscriptionTier } = req.body;
    if (!email || !fullName) {
      return res.status(400).json({ success: false, message: 'email and fullName are required' });
    }

    console.log('Signup request received with email:', email, 'fullName:', fullName, 'subscriptionTier:', subscriptionTier);

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    console.log('Creating user with email:', email, 'and subscriptionTier:', subscriptionTier);

    const user = await User.create({ email, fullName, subscriptionTier });

    res.status(201).json({ success: true, data: { user } });
  } catch (err) {
    console.log('Error in signup:', err);
    return res.status(500).json({ success: false, message: `Server error ${err.message}` });
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found for that email' });
    }

    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
    return res.status(500).json({ success: false, message: 'Server error ${err.message}' });
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, getMe };
