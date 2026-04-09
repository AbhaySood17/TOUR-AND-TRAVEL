const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('destination')
      .populate('package');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', auth, async (req, res) => {
  const { destination, package: packageId, travelDate, status, totalPrice, travelers } = req.body;

  
  if ((!destination && !packageId) || (destination && packageId)) {
    return res.status(400).json({ message: 'Please provide either destination or package, not both.' });
  }

  const booking = new Booking({
    user: req.user.id,
    destination: destination || null,
    package: packageId || null,
    travelDate,
    status,
    totalPrice,
    travelers,
  });

  try {
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/', auth, async (req, res) => {
  const { bookingId, destination, package: packageId, travelDate, status, totalPrice, travelers } = req.body;
  if (!bookingId) return res.status(400).json({ message: 'Booking ID required in body' });

  try {
    const booking = await Booking.findOne({ _id: bookingId, user: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found or not authorized' });

    if ((destination && packageId)) {
      return res.status(400).json({ message: 'Please provide either destination or package, not both.' });
    }

 
    booking.destination = destination || null;
    booking.package = packageId || null;
    booking.travelDate = travelDate || booking.travelDate;
    booking.status = status || booking.status;
    booking.totalPrice = totalPrice || booking.totalPrice;
    booking.travelers = travelers || booking.travelers;

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete('/', auth, async (req, res) => {
  const { bookingId } = req.body;
  if (!bookingId) return res.status(400).json({ message: 'Booking ID required in body' });

  try {
    const booking = await Booking.findOne({ _id: bookingId, user: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found or not authorized' });

    await Booking.deleteOne({ _id: bookingId, user: req.user.id });
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;