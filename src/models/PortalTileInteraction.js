const mongoose = require('mongoose');

const portalTileInteractionSchema = new mongoose.Schema(
  {
    tileId: { type: mongoose.Schema.Types.ObjectId, ref: 'PortalTile', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, enum: ['tapped', 'skipped', 'dismissed'] },
    interactedAt: { type: Date },
    openedInNativeApp: { type: Boolean },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PortalTileInteraction', portalTileInteractionSchema);
