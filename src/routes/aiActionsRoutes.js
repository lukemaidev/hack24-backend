const express = require('express');
const { chatWithClaude, runFeedAnalysis, getMentorTag, analyseImageAction } = require('../controllers/aiActionsController');

const router = express.Router();

// POST /api/ai-actions/chat
router.post('/chat', chatWithClaude);

// POST /api/ai-actions/analyse-feed
router.post('/analyse-feed', runFeedAnalysis);

// POST /api/ai-actions/mentor-tag
router.post('/mentor-tag', getMentorTag);

// POST /api/ai-actions/analyse-image
router.post('/analyse-image', analyseImageAction);

module.exports = router;
