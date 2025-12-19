import express from 'express';
import Reading from '../models/Reading.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Get consumption trends
router.get('/trends', async (req, res) => {
  try {
    const { type, period = 'daily', startDate, endDate } = req.query;
    
    const query = { userId: req.user._id };
    if (type) query.type = type;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    let groupBy;
    switch (period) {
      case 'hourly':
        groupBy = { $dateToString: { format: '%Y-%m-%d %H:00', date: '$timestamp' } };
        break;
      case 'monthly':
        groupBy = { $dateToString: { format: '%Y-%m', date: '$timestamp' } };
        break;
      case 'daily':
      default:
        groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } };
    }

    const trends = await Reading.aggregate([
      { $match: query },
      {
        $group: {
          _id: { date: groupBy, type: '$type' },
          total: { $sum: '$value' },
          count: { $sum: 1 },
          avg: { $avg: '$value' }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    res.json(trends);
  } catch (error) {
    console.error('Get trends error:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

// Export data
router.get('/export', async (req, res) => {
  try {
    const { format = 'json', startDate, endDate } = req.query;
    
    const query = { userId: req.user._id };
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const readings = await Reading.find(query).sort({ timestamp: -1 });

    if (format === 'csv') {
      const csv = [
        'Date,Type,Value,Unit,Notes',
        ...readings.map(r => 
          `${r.timestamp.toISOString()},${r.type},${r.value},${r.unit},"${r.notes || ''}"`
        )
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=readings.csv');
      res.send(csv);
    } else {
      res.json(readings);
    }
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

export default router;
