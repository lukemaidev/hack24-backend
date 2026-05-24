/**
 * scripts/embedInfluencerSnapshots.js
 *
 * For every Influencer that has a `snapshot` URL but no `embeddedSnapshot`:
 *   1. Fetch the image from Supabase storage.
 *   2. Send it to Claude vision to get a rich text description.
 *   3. Embed that description with Voyage AI (voyage-multimodal-3).
 *   4. Save the vector back to `embeddedSnapshot`.
 *
 * Usage:
 *   node scripts/embedInfluencerSnapshots.js
 *
 * Options:
 *   --force   Re-embed even if embeddedSnapshot already exists.
 */

require('dotenv').config();

const mongoose = require('mongoose');
const { VoyageAIClient } = require('voyageai');
const Anthropic = require('@anthropic-ai/sdk');
const connectDB = require('../src/config/db');
const Influencer = require('../src/models/Influencer');
const { ANTHROPIC_MODEL, VOYAGE_API_KEY } = require('../src/config/env');

const FORCE = process.argv.includes('--force');
const CONCURRENCY = 3; // parallel requests at a time

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const voyage = new VoyageAIClient({ apiKey: VOYAGE_API_KEY });

// ---------------------------------------------------------------------------
// Step 1 – describe the snapshot image with Claude vision
// ---------------------------------------------------------------------------
async function describeSnapshot(imageUrl) {
  const imageRes = await fetch(imageUrl);
  if (!imageRes.ok) {
    throw new Error(`Image fetch failed: ${imageRes.status} ${imageRes.statusText} — ${imageUrl}`);
  }

  const mediaType = imageRes.headers.get('content-type') || 'image/jpeg';
  const buffer = await imageRes.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');

  const response = await anthropic.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 512,
    system:
      'You are an analyst describing social media influencer profile snapshots. ' +
      'Provide a concise, factual description (3–5 sentences) covering the visible ' +
      'content, style, platform indicators, and any text present.',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
          { type: 'text', text: 'Describe this influencer snapshot.' },
        ],
      },
    ],
  });

  return response.content[0].text;
}

// ---------------------------------------------------------------------------
// Step 2 – embed the description with Voyage AI
// ---------------------------------------------------------------------------
async function embedText(text) {
  const result = await voyage.embed({
    input: [text],
    model: 'voyage-3',
  });
  return result.data[0].embedding; // float[]
}

// ---------------------------------------------------------------------------
// Process one influencer
// ---------------------------------------------------------------------------
async function processInfluencer(influencer) {
  const label = `[${influencer.accountName ?? influencer._id}]`;

  if (!influencer.snapshot) {
    console.log(`${label} — no snapshot URL, skipping.`);
    return;
  }

  if (influencer.embeddedSnapshot?.length && !FORCE) {
    console.log(`${label} — already embedded (${influencer.embeddedSnapshot.length}d), skipping.`);
    return;
  }

  try {
    console.log(`${label} — describing snapshot…`);
    const description = await describeSnapshot(influencer.snapshot);

    console.log(`${label} — embedding description…`);
    const vector = await embedText(description);

    await Influencer.findByIdAndUpdate(influencer._id, { embeddedSnapshot: vector });
    console.log(`${label} — saved ${vector.length}-dim embedding. ✓`);
  } catch (err) {
    console.error(`${label} — ERROR: ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// Run with bounded concurrency
// ---------------------------------------------------------------------------
async function run() {
  await connectDB();

  const filter = FORCE ? { snapshot: { $exists: true, $ne: null } } : {
    snapshot: { $exists: true, $ne: null },
    $or: [{ embeddedSnapshot: { $exists: false } }, { embeddedSnapshot: { $size: 0 } }],
  };

  const influencers = await Influencer.find(filter).lean();
  console.log(`Found ${influencers.length} influencer(s) to embed.`);

  // Process in chunks of CONCURRENCY
  for (let i = 0; i < influencers.length; i += CONCURRENCY) {
    const chunk = influencers.slice(i, i + CONCURRENCY);
    await Promise.all(chunk.map(processInfluencer));
  }

  console.log('\nDone.');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
