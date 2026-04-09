const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  destinations: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }], default: [] },
  duration: { type: String, required: true }, 
  price: { type: Number, required: true },
  itinerary: [{ day: Number, activity: String }],
  images: [{ type: String }],
});

module.exports = mongoose.model('Package', packageSchema);