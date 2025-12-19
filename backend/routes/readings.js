import express from 'express';
import Reading from '../models/Reading.js';
import Alert from '../models/Alert.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Create reading
router.post('/', async (req, res) => {
  try {
    const { type, value, unit, notes } = req.body;
    
    const reading = await Reading.create({
      userId: req.user._id,
      type,
      value,
      unit,
      notes
    });

    const io = req.app.get('io');
    io.to(`user:${req.user._id}`).emit('reading:new', reading);

    res.status(201).json(reading);
  } catch (error) {
    console.error('Create reading error:', error);
    res.status(500).json({ error: 'Failed to create reading' });
  }
});

// Get readings
router.get('/', async (req, res) => {
  try {
    const { type, startDate, endDate, limit = 50 } = req.query;
    
    const query = { userId: req.user._id };
    if (type) query.type = type;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const readings = await Reading.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json(readings);
  } catch (error) {
    console.error('Get readings error:', error);
    res.status(500).json({ error: 'Failed to fetch readings' });
  }
});

// Get summary
router.get('/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = { userId: req.user._id };
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const water = await Reading.aggregate([
      { $match: { ...query, type: 'water' } },
      { $group: { _id: null, total: { $sum: '$value' }, count: { $sum: 1 } } }
    ]);

    const electricity = await Reading.aggregate([
      { $match: { ...query, type: 'electricity' } },
      { $group: { _id: null, total: { $sum: '$value' }, count: { $sum: 1 } } }
    ]);

    res.json({
      water: water[0] || { total: 0, count: 0 },
      electricity: electricity[0] || { total: 0, count: 0 }
    });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// Delete reading
router.delete('/:id', async (req, res) => {
  try {
    const reading = await Reading.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!reading) {
      return res.status(404).json({ error: 'Reading not found' });
    }

    res.json({ message: 'Reading deleted' });
  } catch (error) {
    console.error('Delete reading error:', error);
    res.status(500).json({ error: 'Failed to delete reading' });
  }
});

export default router;
