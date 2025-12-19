import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Consumption from '../models/Consumption.js';
import Goal from '../models/Goal.js';

const router = express.Router();

// Schedule a report
router.post('/schedule', authenticate, async (req, res) => {
  try {
    const { frequency, email, reportType, includeComparison } = req.body;
    
    console.log('📊 Report scheduled:', {
      userId: req.user._id,
      email: email || req.user.email,
      frequency,
      reportType,
      includeComparison,
      scheduledAt: new Date()
    });

    // In production, you would:
    // 1. Save to a ScheduledReport model
    // 2. Add to a job queue (Bull, Agenda)
    // 3. Set up cron jobs for email delivery
    
    res.json({ 
      success: true,
      message: 'Report scheduled successfully',
      scheduledFor: frequency === 'daily' ? 'Tomorrow 8:00 AM' : 'Next week',
      email: email || req.user.email
    });
  } catch (error) {
    console.error('Report scheduling error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate instant report
router.post('/generate', authenticate, async (req, res) => {
  try {
    const { period = '30d', type } = req.body;
    
    const now = new Date();
    let startTime;
    switch (period) {
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startTime = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const consumption = await Consumption.aggregate([
      {
        $match: {
          userId: req.user._id,
          timestamp: { $gte: startTime },
          ...(type && { type })
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$value' },
          average: { $avg: '$value' },
          count: { $sum: 1 }
        }
      }
    ]);

    const goals = await Goal.find({ 
      userId: req.user._id,
      status: 'active'
    });

    res.json({
      period,
      consumption,
      goals,
      generatedAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
