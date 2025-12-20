import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all pending verification users
// @route   GET /api/admin/pending
// @access  Private/Admin
router.get('/pending', protect, async (req, res) => {
  try {
    const pendingUsers = await User.find({ isVerified: false })
      .select('name email phoneNumber electricityMeterNo waterMeterNo verificationRequestedAt createdAt')
      .sort({ verificationRequestedAt: -1, createdAt: -1 });

    res.json({
      count: pendingUsers.length,
      users: pendingUsers
    });
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({ error: 'Failed to fetch pending users' });
  }
});

// @desc    Verify a user by ID
// @route   PATCH /api/admin/verify/:id
// @access  Private/Admin
router.patch('/verify/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'User already verified' });
    }

    user.isVerified = true;
    user.verifiedAt = new Date();
    // Only set verifiedBy if it's not the admin (admin has string ID 'admin')
    if (req.user._id !== 'admin' && req.user.id !== 'admin') {
      user.verifiedBy = req.user._id;
    }
    
    await user.save();

    res.json({
      message: 'User verified successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        verifiedAt: user.verifiedAt
      }
    });
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ error: 'Failed to verify user' });
  }
});

// @desc    Reject a verification request
// @route   DELETE /api/admin/reject/:id
// @access  Private/Admin
router.delete('/reject/:id', protect, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Cannot reject verified user' });
    }

    // For now, we'll just delete the user. In production, you might want to:
    // - Keep the user but mark as rejected
    // - Send notification email
    // - Log the rejection reason
    await user.deleteOne();

    res.json({
      message: 'User verification rejected and account deleted',
      reason: reason || 'No reason provided'
    });
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(500).json({ error: 'Failed to reject user' });
  }
});

// @desc    Get all verified users
// @route   GET /api/admin/verified
// @access  Private/Admin
router.get('/verified', protect, async (req, res) => {
  try {
    const verifiedUsers = await User.find({ isVerified: true })
      .select('name email phoneNumber electricityMeterNo waterMeterNo verifiedAt createdAt')
      .sort({ verifiedAt: -1 });

    res.json({
      count: verifiedUsers.length,
      users: verifiedUsers
    });
  } catch (error) {
    console.error('Error fetching verified users:', error);
    res.status(500).json({ error: 'Failed to fetch verified users' });
  }
});

export default router;
