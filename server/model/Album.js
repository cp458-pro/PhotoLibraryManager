
const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  coverPhotoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo' },
}, { timestamps: true });

module.exports = mongoose.model('Album', albumSchema);
