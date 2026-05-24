/**
 * scripts/embedInfluencerSnapshots.js
 *
 * For every Influencer document that has a "Snapshot" text field but no
 * "embeddedSnapshot" vector, embed the snapshot text with Voyage AI and
 * save it back as embeddedSnapshot ([Number]).
 *
 * NOTE: The raw MongoDB documents use the original column names with spaces
 * and capitals (e.g. "Snapshot", "Account Name"), so this script queries the
 * native collection directly to avoid Mongoose field-name mapping issues.
 *
 * Usage:
 *   node scripts/embedInfluencerSnapshots.js           # skip already embedded
 *   node scripts/embedInfluencerSnapshots.js --force   # re-embed everything
 */

require('dotenv').config();

const mongoose = require('mongoose');
const { VoyageAIClient } = require('voyageai');
const connectDB = require('../src/config/db');
const { VOYAGE_API_KEY } = require('../src/config/env');

const FORCE = process.argv.includes('--force');
const CONCURRENCY = 5;

const voyage = new VoyageAIClient({ apiKey: VOYAGE_API_KEY });

// ---------------------------------------------------------------------------
// Embed a text string with Voyage AI
// ---------------------------------------------------------------------------
async function embedText(text) {
  const result = await voyage.embed({
    input: [text],
    model: 'voyage-3',
  });
  return result.data[0].embedding; // float[]
}

// ---------------------------------------------------------------------------
// Process one raw MongoDB document
// ---------------------------------------------------------------------------
async function processDoc(collection, doc) {
  const label = `[${doc['Account Name'] ?? doc._id}]`;
  const snapshotText = doc['Snapshot'];

  if (!snapshotText || typeof snapshotText !== 'string' || !snapshotText.trim()) {
    console.log(`${label} — no Snapshot text, skipping.`);
    return;
  }

  if (doc.embeddedSnapshot?.length && !FORCE) {
    console.log(`${label} — already embedded (${doc.embeddedSnapshot.length}d), skipping.`);
    return;
  }

  try {
    const vector = await embedText(snapshotText.trim());

    await collection.updateOne(
      { _id: doc._id },
      { $set: { embeddedSnapshot: vector } }
    );

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

  const collection = mongoose.connection.collection('influencers');

  // ── Diagnostics ────────────────────────────────────────────────────────────
  const total = await collection.countDocuments();
  const withSnapshot = await collection.countDocuments({ Snapshot: { $exists: true, $nin: [null, ''] } });
  const alreadyEmbedded = await collection.countDocuments({ embeddedSnapshot: { $exists: true } });
  const sample = await collection.findOne();

  console.log(`\n── Diagnostics ──────────────────────────────────`);
  console.log(`  Total influencers     : ${total}`);
  console.log(`  With Snapshot text    : ${withSnapshot}`);
  console.log(`  Already embedded      : ${alreadyEmbedded}`);
  console.log(`  Sample Snapshot       : ${String(sample?.['Snapshot'] ?? '(none)').slice(0, 80)}…`);
  console.log(`─────────────────────────────────────────────────\n`);
  // ──────────────────────────────────────────────────────────────────────────

  const filter = FORCE
    ? { Snapshot: { $exists: true, $nin: [null, ''] } }
    : {
        Snapshot: { $exists: true, $nin: [null, ''] },
        $or: [
          { embeddedSnapshot: { $exists: false } },
          { embeddedSnapshot: null },
        ],
      };

  const docs = await collection.find(filter).toArray();
  console.log(`Found ${docs.length} influencer(s) to embed.\n`);

  if (docs.length === 0) {
    console.log('Nothing to do.');
    await mongoose.disconnect();
    return;
  }

  let done = 0;
  for (let i = 0; i < docs.length; i += CONCURRENCY) {
    const chunk = docs.slice(i, i + CONCURRENCY);
    await Promise.all(chunk.map((doc) => processDoc(collection, doc)));
    done += chunk.length;
    console.log(`── Progress: ${done}/${docs.length} ──`);
  }

  console.log('\nAll done.');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
