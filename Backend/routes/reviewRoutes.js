const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');


router.get('/', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id }).populate('destination');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  const review = new Review({
    user: req.user.id,
    destination: req.body.destination,
    rating: req.body.rating,
    comment: req.body.comment,
  });
  try {
    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/', auth, async (req, res) => {
  const { reviewId } = req.body; // Client sends review ID in body
  if (!reviewId) return res.status(400).json({ message: 'Review ID required in body' });

  try {
    const review = await Review.findOne({ _id: reviewId, user: req.user.id });
    if (!review) return res.status(404).json({ message: 'Review not found or not authorized' });

    review.destination = req.body.destination || review.destination;
    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;

    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/', auth, async (req, res) => {
  const { reviewId } = req.body; 
  if (!reviewId) return res.status(400).json({ message: 'Review ID required in body' });

  try {
    const review = await Review.findOne({ _id: reviewId, user: req.user.id });
    if (!review) return res.status(404).json({ message: 'Review not found or not authorized' });

    await review.remove();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;