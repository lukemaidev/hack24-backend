const anthropic = require('../config/claude');
const { ANTHROPIC_MODEL } = require('../config/env');

/**
 * Fetch an image from a URL, convert to base64, and analyse with Claude vision.
 * @param {string} imageUrl   - publicly accessible image URL (e.g. Supabase storage)
 * @param {string} [prompt]   - instruction for Claude
 * @param {string} [systemPrompt]
 */
const analyseImage = async (
  imageUrl,
  prompt = 'What is in this image?',
  systemPrompt = ''
) => {
  const imageRes = await fetch(imageUrl);
  if (!imageRes.ok) {
    throw new Error(`Failed to fetch image: ${imageRes.status} ${imageRes.statusText}`);
  }

  const mediaType = imageRes.headers.get('content-type') || 'image/jpeg';
  const buffer = await imageRes.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');

  const params = {
    model: ANTHROPIC_MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64,
            },
          },
          {
            type: 'text',
            text: prompt,
          },
        ],
      },
    ],
  };

  if (systemPrompt) {
    params.system = systemPrompt;
  }

  const response = await anthropic.messages.create(params);
  return response.content[0].text;
};

module.exports = { analyseImage };
