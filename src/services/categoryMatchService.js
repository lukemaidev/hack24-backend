/**
 * src/services/categoryMatchService.js
 *
 * Given a piece of text (e.g. an AI-generated image analysis), embed it and
 * compute cosine similarity against every unique "Source Category" in the
 * influencers collection.
 *
 * Returns an array sorted by descending similarity:
 *   [{ category: string, similarity: number }]   (similarity is 0–100 %)
 */

const mongoose = require('mongoose');
const { embedText, embedTexts } = require('./voyageService');

// ─── Cosine similarity ───────────────────────────────────────────────────────
function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot   += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Match `text` against all unique "Source Category" values in the DB.
 *
 * @param {string} text  - the AI-generated description / prompt result
 * @returns {Promise<Array<{ category: string, similarity: number }>>}
 *          similarity is a percentage [0, 100], rounded to 2 decimal places.
 */
async function matchCategories(text) {
  const collection = mongoose.connection.collection('influencers');

  // 1. Fetch all distinct non-empty Source Categories
  const categories = await collection.distinct('Source Category', {
    'Source Category': { $exists: true, $nin: [null, ''] },
  });

  if (!categories.length) return [];

  // 2. Embed the query text + all categories in parallel (one API call each)
  const [queryVec, categoryVecs] = await Promise.all([
    embedText(text),
    embedTexts(categories),
  ]);

  // 3. Compute cosine similarity for each category
  //    Voyage-3 embeddings are L2-normalised, so cosine ∈ [-1, 1].
  //    We map to [0, 100]% via  ((sim + 1) / 2) * 100  so the output is
  //    always a non-negative, human-readable percentage.
  const results = categories.map((category, i) => {
    const raw        = cosineSimilarity(queryVec, categoryVecs[i]);
    const similarity = Math.round(((raw + 1) / 2) * 100 * 100) / 100; // 2 dp
    return { category, similarity };
  });

  // 4. Sort by descending similarity
  results.sort((a, b) => b.similarity - a.similarity);

  return results;
}

module.exports = { matchCategories };
