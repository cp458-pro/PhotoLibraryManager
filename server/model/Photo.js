
const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: String,
  description: String,
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
  takenAt: Date,
  location: String,
  tags: [String],
  metadata: mongoose.Schema.Types.Mixed,
  favorite: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Photo', photoSchema);
