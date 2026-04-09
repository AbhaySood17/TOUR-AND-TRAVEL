const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');
const auth = require('../middleware/auth');


router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ message: 'Destination not found' });
    res.json(destination);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', auth, async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.user.id);
    if (user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });

    const destination = new Destination({
      name: req.body.name,
      location: req.body.location,
      description: req.body.description,
      price: req.body.price,
      images: req.body.images,
      category: req.body.category,
      rating: req.body.rating,
    });
    const newDestination = await destination.save();
    res.status(201).json(newDestination);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.put('/', auth, async (req, res) => {
  const { destinationId } = req.body; 
  if (!destinationId) return res.status(400).json({ message: 'Destination ID required in body' });

  try {
    const user = await require('../models/User').findById(req.user.id);
    if (user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });

    const destination = await Destination.findById(destinationId);
    if (!destination) return res.status(404).json({ message: 'Destination not found' });

    destination.name = req.body.name || destination.name;
    destination.location = req.body.location || destination.location;
    destination.description = req.body.description || destination.description;
    destination.price = req.body.price || destination.price;
    destination.images = req.body.images || destination.images;
    destination.category = req.body.category || destination.category;
    destination.rating = req.body.rating || destination.rating;

    const updatedDestination = await destination.save();
    res.json(updatedDestination);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete('/', auth, async (req, res) => {
  const { destinationId } = req.body; 
  if (!destinationId) return res.status(400).json({ message: 'Destination ID required in body' });

  try {
    const user = await require('../models/User').findById(req.user.id);
    if (user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });

    const destination = await Destination.findById(destinationId);
    if (!destination) return res.status(404).json({ message: 'Destination not found' });

    await destination.deleteOne({_id : destinationId})
    res.json({ message: 'Destination deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;