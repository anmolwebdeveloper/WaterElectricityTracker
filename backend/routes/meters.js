import express from 'express';
import Meter from '../models/Meter.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all meters for user
router.get('/', authenticate, async (req, res) => {
  try {
    const meters = await Meter.find({ userId: req.user._id })
      .sort({ type: 1, createdAt: -1 });
    res.json(meters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single meter
router.get('/:id', authenticate, async (req, res) => {
  try {
    const meter = await Meter.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    if (!meter) return res.status(404).json({ error: 'Meter not found' });
    res.json(meter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new meter
router.post('/', authenticate, async (req, res) => {
  try {
    const meter = new Meter({
      ...req.body,
      userId: req.user._id
    });
    await meter.save();
    res.status(201).json(meter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update meter
router.put('/:id', authenticate, async (req, res) => {
  try {
    const meter = await Meter.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!meter) return res.status(404).json({ error: 'Meter not found' });
    res.json(meter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete meter
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const meter = await Meter.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    if (!meter) return res.status(404).json({ error: 'Meter not found' });
    res.json({ message: 'Meter deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
