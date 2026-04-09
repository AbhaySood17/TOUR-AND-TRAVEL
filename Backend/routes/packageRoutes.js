const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const packages = await Package.find().populate('destinations');
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id).populate('destinations');
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', auth, async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.user.id);
    if (user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });

    const pkg = new Package({
      name: req.body.name,
      description: req.body.description,
      duration: req.body.duration,
      price: req.body.price,
      itinerary: req.body.itinerary,
      images: req.body.images,
    });
    const newPackage = await pkg.save();
    res.status(201).json(newPackage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.put('/', auth, async (req, res) => {
  const { packageId } = req.body; 
  if (!packageId) return res.status(400).json({ message: 'Package ID required in body' });

  try {
    const user = await require('../models/User').findById(req.user.id);
    if (user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });

    const pkg = await Package.findById(packageId);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });


    if ('destinations' in req.body) {
        pkg.destinations = req.body.destinations;
    }

    pkg.name = req.body.name || pkg.name;
    pkg.description = req.body.description || pkg.description;
    pkg.duration = req.body.duration || pkg.duration;
    pkg.price = req.body.price || pkg.price;
    pkg.itinerary = req.body.itinerary || pkg.itinerary;
    pkg.images = req.body.images || pkg.images;

    const updatedPackage = await pkg.save();
    res.json(updatedPackage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/', auth, async (req, res) => {
  const { packageId } = req.body; // Client sends package ID in body
  if (!packageId) return res.status(400).json({ message: 'Package ID required in body' });

  try {
    const user = await require('../models/User').findById(req.user.id);
    if (user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });

    const pkg = await Package.findById(packageId);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });

    await pkg.remove();
    res.json({ message: 'Package deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;