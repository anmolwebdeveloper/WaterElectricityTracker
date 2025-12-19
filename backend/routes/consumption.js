import express from 'express';
import Consumption from '../models/Consumption.js';
import Meter from '../models/Meter.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get consumption data for user
router.get('/', authenticate, async (req, res) => {
  try {
    const { type, period = '24h', meterId } = req.query;
    
    // If user is not verified, return demo/zero data
    if (!req.user.isVerified) {
      const now = new Date();
      const demoData = [];
      const hours = period === '24h' ? 24 : period === '7d' ? 168 : 720;
      
      for (let i = hours; i >= 0; i -= period === '24h' ? 1 : period === '7d' ? 6 : 24) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        demoData.push({
          timestamp,
          value: 0,
          type: type || 'electricity',
          meterId: 'demo',
          breakdown: {
            hvac: 0,
            lighting: 0,
            appliances: 0,
            other: 0
          }
        });
      }
      
      return res.json({
        data: demoData,
        summary: {
          total: 0,
          average: 0,
          peak: 0,
          cost: 0
        },
        isDemo: true,
        message: 'Showing demo data. Your account is pending verification.'
      });
    }
    
    // Calculate time range
    const now = new Date();
    let startTime;
    switch (period) {
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const query = { 
      userId: req.user._id,
      timestamp: { $gte: startTime }
    };
    
    if (type) query.type = type;
    if (meterId) query.meterId = meterId;

    const consumption = await Consumption.find(query)
      .populate('meterId', 'meterNumber type provider')
      .sort({ timestamp: 1 });
      
    res.json(consumption);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get live consumption data
router.get('/live', authenticate, async (req, res) => {
  try {
    // If user is not verified, return demo data
    if (!req.user.isVerified) {
      return res.json({
        timestamp: new Date(),
        electricity: { current: 0, unit: 'kW' },
        water: { current: 0, unit: 'gal/min' },
        isDemo: true,
        message: 'Live data will be available after verification'
      });
    }
    
    const consumption = await Consumption.find({ 
      userId: req.user._id,
      isRealTime: true,
      timestamp: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // Last 5 minutes
    })
    .populate('meterId', 'meterNumber type')
    .sort({ timestamp: -1 })
    .limit(50);
    
    res.json(consumption);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get usage breakdown
router.get('/breakdown', authenticate, async (req, res) => {
  try {
    const { type, period = '30d' } = req.query;
    
    // If user is not verified, return demo breakdown
    if (!req.user.isVerified) {
      return res.json({
        breakdown: {
          hvac: 0,
          lighting: 0,
          appliances: 0,
          other: 0
        },
        total: 0,
        isDemo: true,
        message: 'Breakdown data will be available after verification'
      });
    }
    
    const now = new Date();
    const startTime = period === '30d' 
      ? new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      : new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const consumption = await Consumption.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: type || 'electricity',
          timestamp: { $gte: startTime }
        }
      },
      {
        $group: {
          _id: null,
          hvac: { $sum: '$breakdown.hvac' },
          lighting: { $sum: '$breakdown.lighting' },
          appliances: { $sum: '$breakdown.appliances' },
          waterHeating: { $sum: '$breakdown.waterHeating' },
          other: { $sum: '$breakdown.other' }
        }
      }
    ]);

    res.json(consumption[0] || {
      hvac: 0,
      lighting: 0,
      appliances: 0,
      waterHeating: 0,
      other: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create consumption record (for testing/manual entry)
router.post('/', authenticate, async (req, res) => {
  try {
    const consumption = new Consumption({
      ...req.body,
      userId: req.user._id
    });
    await consumption.save();
    
    // Emit real-time update
    const io = req.app.get('io');
    io.to(`user:${req.user._id}`).emit('consumption:new', consumption);
    
    res.status(201).json(consumption);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
