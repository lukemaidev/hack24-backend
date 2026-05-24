const anthropic = require('../config/claude');
const { ANTHROPIC_MODEL } = require('../config/env');

/**
 * Fetch a single image URL and return its base64 content block for Claude.
 * @param {string} url
 * @returns {Promise<{ type: 'image', source: { type, media_type, data } }>}
 */
async function fetchImageBlock(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch image "${url}": ${res.status} ${res.statusText}`);
  }
  const mediaType = res.headers.get('content-type') || 'image/jpeg';
  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return {
    type: 'image',
    source: { type: 'base64', media_type: mediaType, data: base64 },
  };
}

/**
 * Fetch multiple image URLs concurrently, analyse them all in a single Claude
 * message, and return the text response.
 *
 * @param {string[]} imageUrls    - one or more publicly accessible image URLs
 * @param {string}   [prompt]     - instruction for Claude
 * @param {string}   [systemPrompt]
 * @returns {Promise<string>}
 */
const analyseImages = async (
  imageUrls,
  prompt = 'What is in these images?',
  systemPrompt = ''
) => {
  if (!imageUrls || imageUrls.length === 0) {
    throw new Error('At least one imageUrl is required');
  }

  // Fetch all images in parallel
  const imageBlocks = await Promise.all(imageUrls.map(fetchImageBlock));

  // Build content: all image blocks first, then the text prompt
  const content = [
    ...imageBlocks,
    { type: 'text', text: prompt },
  ];

  const params = {
    model: ANTHROPIC_MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content }],
  };

  if (systemPrompt) {
    params.system = systemPrompt;
  }

  const response = await anthropic.messages.create(params);
  return response.content[0].text;
};

/**
 * Single-image convenience wrapper (backward compatible).
 * @param {string} imageUrl
 * @param {string} [prompt]
 * @param {string} [systemPrompt]
 * @returns {Promise<string>}
 */
const analyseImage = (imageUrl, prompt, systemPrompt) =>
  analyseImages([imageUrl], prompt, systemPrompt);

module.exports = { analyseImage, analyseImages };
