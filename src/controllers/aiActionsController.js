const { chat, analyseFeed, generateMentorTag } = require('../services/claudeService');

const chatWithClaude = async (req, res, next) => {
  try {
    const { message, systemPrompt, history } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'message is required' });
    }
    const reply = await chat(message, systemPrompt, history);
    res.json({ success: true, data: { reply } });
  } catch (err) {
    next(err);
  }
};

const runFeedAnalysis = async (req, res, next) => {
  try {
    const { feedSummary, goalProfile } = req.body;
    if (!feedSummary || !goalProfile) {
      return res.status(400).json({ success: false, message: 'feedSummary and goalProfile are required' });
    }
    const result = await analyseFeed(feedSummary, goalProfile);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const getMentorTag = async (req, res, next) => {
  try {
    const { mentor, goalProfile } = req.body;
    if (!mentor || !goalProfile) {
      return res.status(400).json({ success: false, message: 'mentor and goalProfile are required' });
    }
    const tag = await generateMentorTag(mentor, goalProfile);
    res.json({ success: true, data: { tag } });
  } catch (err) {
    next(err);
  }
};

module.exports = { chatWithClaude, runFeedAnalysis, getMentorTag };
