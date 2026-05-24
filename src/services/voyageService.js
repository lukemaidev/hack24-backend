/**
 * src/services/voyageService.js
 *
 * Thin wrapper around the Voyage AI client for text embedding.
 */

const { VoyageAIClient } = require('voyageai');
const { VOYAGE_API_KEY } = require('../config/env');

const voyage = new VoyageAIClient({ apiKey: VOYAGE_API_KEY });

const VOYAGE_MODEL = 'voyage-3';

/**
 * Embed a single text string.
 * @param {string} text
 * @returns {Promise<number[]>}
 */
async function embedText(text) {
  const result = await voyage.embed({ input: [text], model: VOYAGE_MODEL });
  return result.data[0].embedding;
}

/**
 * Embed multiple texts in a single API call.
 * @param {string[]} texts
 * @returns {Promise<number[][]>}
 */
async function embedTexts(texts) {
  if (!texts.length) return [];
  const result = await voyage.embed({ input: texts, model: VOYAGE_MODEL });
  return result.data.map((d) => d.embedding);
}

module.exports = { embedText, embedTexts };
