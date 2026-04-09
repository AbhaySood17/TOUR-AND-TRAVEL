const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', default: null },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', default: null },

  bookingDate: { type: Date, default: Date.now },
  travelDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  totalPrice: { type: Number, required: true },
  travelers: { type: Number, default: 1 },
});

module.exports = mongoose.model('Booking', bookingSchema);