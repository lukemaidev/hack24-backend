const anthropic = require('../config/claude');

const CLAUDE_MODEL = 'claude-sonnet-4-6';

/**
 * Send a chat message to Claude.
 * @param {string} userMessage
 * @param {string} [systemPrompt]
 * @param {Array}  [history]  - prior messages [{role, content}]
 */
const chat = async (userMessage, systemPrompt = '', history = []) => {
  const messages = [
    ...history,
    { role: 'user', content: userMessage },
  ];

  const params = {
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    messages,
  };

  if (systemPrompt) {
    params.system = [
      {
        type: 'text',
        text: systemPrompt,
        cache_control: { type: 'ephemeral' },
      },
    ];
  }

  const response = await anthropic.messages.create(params);
  return response.content[0].text;
};

/**
 * Analyse a feed and return an AI-generated health diagnosis.
 * @param {Object} feedSummary  - aggregated feed data passed to Claude
 * @param {Object} goalProfile  - user's goal profile
 */
const analyseFeed = async (feedSummary, goalProfile) => {
  const system = `You are an AI feed health analyst for Algorithm Health.
Your job is to assess how well a user's social media feed aligns with their personal goals.
Return a concise, plain-English diagnosis and an overall health score (0-100).
Respond in JSON: { "score": number, "diagnosis": string, "recommendations": string[] }`;

  const prompt = `Goal Profile:\n${JSON.stringify(goalProfile, null, 2)}\n\nFeed Summary:\n${JSON.stringify(feedSummary, null, 2)}`;

  const raw = await chat(prompt, system);

  try {
    return JSON.parse(raw);
  } catch {
    return { score: null, diagnosis: raw, recommendations: [] };
  }
};

/**
 * Generate a personalised "why this matters" tag for a prescribed mentor.
 * @param {Object} mentor
 * @param {Object} goalProfile
 */
const generateMentorTag = async (mentor, goalProfile) => {
  const system = `You are a personalisation engine for Algorithm Health.
Write a single short sentence (max 20 words) explaining why this mentor is relevant to this user's goal.
Return only the sentence — no extra text.`;

  const prompt = `Mentor: ${mentor.name} (${mentor.bio})\nUser goal: ${goalProfile.goalSummary}`;
  return chat(prompt, system);
};

module.exports = { chat, analyseFeed, generateMentorTag };
