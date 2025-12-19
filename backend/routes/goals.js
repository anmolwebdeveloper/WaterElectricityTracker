import express from 'express';
import Goal from '../models/Goal.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all goals for user
router.get('/', authenticate, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single goal
router.get('/:id', authenticate, async (req, res) => {
  try {
    const goal = await Goal.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new goal
router.post('/', authenticate, async (req, res) => {
  try {
    const goal = new Goal({
      ...req.body,
      userId: req.user._id
    });
    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update goal
router.put('/:id', authenticate, async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete goal
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
