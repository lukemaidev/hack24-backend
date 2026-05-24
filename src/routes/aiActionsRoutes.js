const express = require('express');
const { chatWithClaude, runFeedAnalysis, getMentorTag, analyseImageAction, analyseUserImagesAction, predictTargetScoresAction } = require('../controllers/aiActionsController');

const router = express.Router();

// POST /api/ai-actions/chat
router.post('/chat', chatWithClaude);

// POST /api/ai-actions/analyse-feed
router.post('/analyse-feed', runFeedAnalysis);

// POST /api/ai-actions/mentor-tag
router.post('/mentor-tag', getMentorTag);

// POST /api/ai-actions/analyse-image
router.post('/analyse-image', analyseImageAction);

// POST /api/ai-actions/analyse-user-images/:id
// Fetches all UploadedImage URLs for the given user ID, then runs Claude vision analysis
router.post('/analyse-user-images/:id', analyseUserImagesAction);

// POST /api/ai-actions/predict-target-scores/:id
// Embeds the user's prompt and patches targetCategoryScores with predicted similarity scores
router.post('/predict-target-scores/:id', predictTargetScoresAction);

module.exports = router;
