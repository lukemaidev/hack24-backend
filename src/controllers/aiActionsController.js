const { chat, analyseFeed, generateMentorTag } = require('../services/claudeService');
const { analyseImages } = require('../services/imageAnalysisService');
const { matchCategories } = require('../services/categoryMatchService');
const UploadedImage = require('../models/UploadedImage');
const User = require('../models/User');

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

const analyseImageAction = async (req, res, next) => {
  try {
    const { imageUrl, imageUrls, prompt, systemPrompt } = req.body;

    // Accept either a single imageUrl or an array of imageUrls
    const urls = imageUrls ?? (imageUrl ? [imageUrl] : null);
    if (!urls || urls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Provide "imageUrl" (string) or "imageUrls" (array) in the request body',
      });
    }

    // 1. Run Claude vision analysis across all images in one message
    const aiDescription = await analyseImages(urls, prompt, systemPrompt);

    // 2. Embed the AI description and compare against every unique Source Category
    const categoryMatches = await matchCategories(aiDescription);

    res.json({
      success: true,
      data: {
        imageCount: urls.length,
        aiDescription,
        categoryMatches, // [{ category, similarity }] sorted descending
      },
    });
  } catch (err) {
    next(err);
  }
};

const analyseUserImagesAction = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const prompt = "Return the video showned or video content if possible in the image";
    const systemPrompt = "You are a helpful assistant that analyzing the image to further investigate user's interests through the content of their feed.";

    // Fetch all uploaded images belonging to the authenticated user
    const images = await UploadedImage.find({ userId });

    if (!images || images.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No uploaded images found for this user',
      });
    }

    const urls = images.map((img) => img.url);

    // Run Claude vision analysis across all images in one message
    const aiDescription = await analyseImages(urls, prompt, systemPrompt);

    // Embed the AI description and compare against every unique Source Category
    const categoryMatches = await matchCategories(aiDescription);

    // Build the $set payload for the user's currentCategoryScores map
    const scoreUpdates = {};
    for (const { category, similarity } of categoryMatches) {
      scoreUpdates[`currentCategoryScores.${category}`] = similarity;
    }

    // Patch the user document with the new scores
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: scoreUpdates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        userId,
        imageCount: urls.length,
        imageUrls: urls,
        aiDescription,
        categoryMatches,                                    // [{ category, similarity }] sorted descending
        currentCategoryScores: Object.fromEntries(updatedUser.currentCategoryScores), // updated scores
      },
    });
  } catch (err) {
    next(err);
  }
};

const predictTargetScoresAction = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { prompt, systemPrompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'prompt is required' });
    }

    // Fixed system prompt — instructs Claude to return scores as JSON matching targetCategoryScores
    const baseSystemPrompt = `You are a content interest analyst. Based on the user's goals and interests,
score each of the following content categories from 0 to 100, where 100 means perfectly aligned with their goals and 0 means no relevance.
Return ONLY a valid JSON object with exactly these keys and numeric values, no extra text:
{
  "Autos & Vehicles": 0,
  "Comedy": 0,
  "Entertainment": 0,
  "Film": 0,
  "Gaming": 0,
  "How To & Style": 0,
  "People & Blogs": 0,
  "Pets & Animals": 0,
  "Science & Technology": 0,
  "Sports": 0,
  "Education": 0,
  "News & Politics": 0,
  "Nonprofit & Activism": 0,
  "Travel": 0,
  "Music": 0
}${systemPrompt ? `\n\nAdditional context: ${systemPrompt}` : ''}`;
    
    // 1. Ask Claude to score each category based on the user's prompt
    const raw = await chat(prompt, baseSystemPrompt);
    console.log(raw)
    // 2. Parse the JSON scores Claude returned
    let categoryScores;
    try {
      categoryScores = raw.replace(/```json|```/g, '').trim(); // Remove any code block formatting
      categoryScores = JSON.parse(categoryScores);
    } catch {
      return res.status(500).json({ success: false, message: 'AI returned an unexpected format', raw });
    }

    // 3. Build the $set payload for the user's targetCategoryScores map
    const scoreUpdates = {};
    for (const [category, score] of Object.entries(categoryScores)) {
      scoreUpdates[`targetCategoryScores.${category}`] = score;
    }

    // 4. Patch the user document with the predicted target scores
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: scoreUpdates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        userId,
        prompt,
        targetCategoryScores: Object.fromEntries(updatedUser.targetCategoryScores),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { chatWithClaude, runFeedAnalysis, getMentorTag, analyseImageAction, analyseUserImagesAction, predictTargetScoresAction };
