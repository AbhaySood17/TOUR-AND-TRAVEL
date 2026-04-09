const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  category: { type: String, enum: ['beach', 'mountain', 'city', 'adventure'] },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Destination', destinationSchema);