import express from 'express';
import User from '../models/User.js';
import SupportTicket from '../models/SupportTicket.js';
import GlobalNotification from '../models/GlobalNotification.js';
import SystemSettings from '../models/SystemSettings.js';
import Consumption from '../models/Consumption.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Apply admin protection to all routes
router.use(protect);
router.use(requireAdmin);

// ==================== USER MANAGEMENT ====================

// @desc    Get all users with advanced filtering
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const { status, search, role, isVerified } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (role) query.role = role;
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { electricityMeterNo: { $regex: search, $options: 'i' } },
        { waterMeterNo: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// @desc    Get all pending verification users
// @route   GET /api/admin/pending
// @access  Private/Admin
router.get('/pending', async (req, res) => {
  try {
    const pendingUsers = await User.find({ isVerified: false, status: { $ne: 'removed' } })
      .select('name email phoneNumber electricityMeterNo waterMeterNo verificationRequestedAt createdAt status')
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
router.patch('/verify/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isVerified && user.status === 'active') {
      return res.status(400).json({ error: 'User already verified' });
    }

    user.isVerified = true;
    user.status = 'active';
    user.verifiedAt = new Date();
    
    if (req.user._id !== 'admin' && req.user.id !== 'admin') {
      user.verifiedBy = req.user._id;
    }
    
    // Add audit log
    if (!user.auditLogs) user.auditLogs = [];
    user.auditLogs.push({
      action: 'USER_VERIFIED',
      description: 'User account verified and activated',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      performedBy: req.user._id !== 'admin' ? req.user._id : null
    });
    
    await user.save();

    res.json({
      message: 'User verified successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        status: user.status,
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
router.delete('/reject/:id', async (req, res) => {
  try {
    const { reason } = req.body;
    
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Cannot reject verified user' });
    }

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
router.get('/verified', async (req, res) => {
  try {
    const verifiedUsers = await User.find({ isVerified: true })
      .select('name email phoneNumber electricityMeterNo waterMeterNo verifiedAt createdAt status lastLoginAt')
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

// @desc    Deactivate/Remove a user
// @route   PATCH /api/admin/users/:id/deactivate
// @access  Private/Admin
router.patch('/users/:id/deactivate', async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Cannot deactivate admin users' });
    }

    user.status = 'removed';
    user.statusReason = reason || 'Account deactivated by administrator';
    user.statusChangedAt = new Date();
    user.statusChangedBy = req.user._id !== 'admin' ? req.user._id : null;
    
    // Add audit log
    if (!user.auditLogs) user.auditLogs = [];
    user.auditLogs.push({
      action: 'USER_DEACTIVATED',
      description: `Account deactivated. Reason: ${reason || 'No reason provided'}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      performedBy: req.user._id !== 'admin' ? req.user._id : null
    });
    
    await user.save();

    res.json({
      message: 'User deactivated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        statusReason: user.statusReason
      }
    });
  } catch (error) {
    console.error('Error deactivating user:', error);
    res.status(500).json({ error: 'Failed to deactivate user' });
  }
});

// @desc    Reactivate a removed/suspended user
// @route   PATCH /api/admin/users/:id/reactivate
// @access  Private/Admin
router.patch('/users/:id/reactivate', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.status === 'active') {
      return res.status(400).json({ error: 'User is already active' });
    }

    user.status = 'active';
    user.statusReason = null;
    user.statusChangedAt = new Date();
    user.statusChangedBy = req.user._id !== 'admin' ? req.user._id : null;
    
    // Add audit log
    if (!user.auditLogs) user.auditLogs = [];
    user.auditLogs.push({
      action: 'USER_REACTIVATED',
      description: 'Account reactivated by administrator',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      performedBy: req.user._id !== 'admin' ? req.user._id : null
    });
    
    await user.save();

    res.json({
      message: 'User reactivated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Error reactivating user:', error);
    res.status(500).json({ error: 'Failed to reactivate user' });
  }
});

// @desc    Get user audit logs
// @route   GET /api/admin/users/:id/audit-logs
// @access  Private/Admin
router.get('/users/:id/audit-logs', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('auditLogs loginHistory')
      .populate('auditLogs.performedBy', 'name email');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      auditLogs: user.auditLogs || [],
      loginHistory: user.loginHistory || []
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// ==================== SYSTEM-WIDE ANALYTICS ====================

// @desc    Get system-wide analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
router.get('/analytics', async (req, res) => {
  try {
    // User stats
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active', isVerified: true });
    const pendingUsers = await User.countDocuments({ isVerified: false, status: 'pending' });
    const removedUsers = await User.countDocuments({ status: 'removed' });
    
    // Get user growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsersLast30Days = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Consumption stats
    const totalElectricityConsumption = await Consumption.aggregate([
      { $match: { type: 'electricity' } },
      { $group: { _id: null, total: { $sum: '$usage' } } }
    ]);
    
    const totalWaterConsumption = await Consumption.aggregate([
      { $match: { type: 'water' } },
      { $group: { _id: null, total: { $sum: '$usage' } } }
    ]);
    
    // Peak usage hours
    const peakHours = await Consumption.aggregate([
      {
        $group: {
          _id: { $hour: '$timestamp' },
          count: { $sum: 1 },
          totalUsage: { $sum: '$usage' }
        }
      },
      { $sort: { totalUsage: -1 } },
      { $limit: 5 }
    ]);
    
    // Recent activity
    const recentLogins = await User.find({ lastLoginAt: { $exists: true } })
      .sort({ lastLoginAt: -1 })
      .limit(10)
      .select('name email lastLoginAt lastLoginIp');
    
    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        pending: pendingUsers,
        removed: removedUsers,
        newLast30Days: newUsersLast30Days
      },
      consumption: {
        electricity: {
          total: totalElectricityConsumption[0]?.total || 0,
          unit: 'kWh'
        },
        water: {
          total: totalWaterConsumption[0]?.total || 0,
          unit: 'gallons'
        }
      },
      peakHours: peakHours.map(p => ({
        hour: p._id,
        usage: p.totalUsage,
        count: p.count
      })),
      recentActivity: recentLogins
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// ==================== SUPPORT TICKETS ====================

// @desc    Get all support tickets
// @route   GET /api/admin/tickets
// @access  Private/Admin
router.get('/tickets', async (req, res) => {
  try {
    const { status, priority } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    
    const tickets = await SupportTicket.find(query)
      .populate('user', 'name email phoneNumber')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      count: tickets.length,
      tickets
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch support tickets' });
  }
});

// @desc    Get a single ticket
// @route   GET /api/admin/tickets/:id
// @access  Private/Admin
router.get('/tickets/:id', async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate('user', 'name email phoneNumber')
      .populate('assignedTo', 'name email')
      .populate('messages.sender', 'name email role');
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    res.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// @desc    Reply to a support ticket
// @route   POST /api/admin/tickets/:id/reply
// @access  Private/Admin
router.post('/tickets/:id/reply', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const ticket = await SupportTicket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    ticket.messages.push({
      sender: req.user._id !== 'admin' ? req.user._id : null,
      senderRole: 'admin',
      message,
      timestamp: new Date()
    });
    
    if (ticket.status === 'open') {
      ticket.status = 'in-progress';
    }
    
    await ticket.save();
    
    res.json({
      message: 'Reply sent successfully',
      ticket
    });
  } catch (error) {
    console.error('Error replying to ticket:', error);
    res.status(500).json({ error: 'Failed to send reply' });
  }
});

// @desc    Update ticket status
// @route   PATCH /api/admin/tickets/:id/status
// @access  Private/Admin
router.patch('/tickets/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['open', 'in-progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const ticket = await SupportTicket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    ticket.status = status;
    
    if (status === 'resolved' || status === 'closed') {
      ticket.resolvedAt = new Date();
      ticket.resolvedBy = req.user._id !== 'admin' ? req.user._id : null;
    }
    
    await ticket.save();
    
    res.json({
      message: 'Ticket status updated',
      ticket
    });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({ error: 'Failed to update ticket status' });
  }
});

// ==================== GLOBAL NOTIFICATIONS ====================

// @desc    Get all notifications
// @route   GET /api/admin/notifications
// @access  Private/Admin
router.get('/notifications', async (req, res) => {
  try {
    const notifications = await GlobalNotification.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      count: notifications.length,
      notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// @desc    Create a global notification
// @route   POST /api/admin/notifications
// @access  Private/Admin
router.post('/notifications', async (req, res) => {
  try {
    const { title, message, type, priority, targetAudience, scheduledFor, expiresAt, displayOptions } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }
    
    // Count recipients
    let recipientCount = 0;
    if (targetAudience === 'all') {
      recipientCount = await User.countDocuments();
    } else if (targetAudience === 'verified') {
      recipientCount = await User.countDocuments({ isVerified: true, status: 'active' });
    } else if (targetAudience === 'pending') {
      recipientCount = await User.countDocuments({ isVerified: false, status: 'pending' });
    }
    
    const notification = await GlobalNotification.create({
      title,
      message,
      type: type || 'info',
      priority: priority || 'medium',
      targetAudience: targetAudience || 'all',
      scheduledFor: scheduledFor || new Date(),
      expiresAt,
      status: scheduledFor && new Date(scheduledFor) > new Date() ? 'scheduled' : 'sent',
      sentAt: scheduledFor && new Date(scheduledFor) > new Date() ? null : new Date(),
      totalRecipients: recipientCount,
      displayOptions: displayOptions || { showOnDashboard: true, showAsPopup: false, isDismissible: true },
      createdBy: req.user._id !== 'admin' ? req.user._id : null
    });
    
    res.status(201).json({
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// @desc    Delete a notification
// @route   DELETE /api/admin/notifications/:id
// @access  Private/Admin
router.delete('/notifications/:id', async (req, res) => {
  try {
    const notification = await GlobalNotification.findByIdAndDelete(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// ==================== UTILITY RATE MANAGEMENT ====================

// @desc    Get system settings
// @route   GET /api/admin/settings
// @access  Private/Admin
router.get('/settings', async (req, res) => {
  try {
    let settings = await SystemSettings.findOne({ region: 'global' });
    
    if (!settings) {
      settings = await SystemSettings.create({ region: 'global' });
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// @desc    Update utility rates
// @route   PATCH /api/admin/settings/rates
// @access  Private/Admin
router.patch('/settings/rates', async (req, res) => {
  try {
    const { electricityRate, waterRate } = req.body;
    
    let settings = await SystemSettings.findOne({ region: 'global' });
    
    if (!settings) {
      settings = await SystemSettings.create({ region: 'global' });
    }
    
    if (electricityRate) {
      settings.electricityRate = {
        ...settings.electricityRate.toObject(),
        ...electricityRate,
        lastUpdated: new Date(),
        updatedBy: req.user._id !== 'admin' ? req.user._id : null
      };
    }
    
    if (waterRate) {
      settings.waterRate = {
        ...settings.waterRate.toObject(),
        ...waterRate,
        lastUpdated: new Date(),
        updatedBy: req.user._id !== 'admin' ? req.user._id : null
      };
    }
    
    await settings.save();
    
    res.json({
      message: 'Utility rates updated successfully',
      settings
    });
  } catch (error) {
    console.error('Error updating rates:', error);
    res.status(500).json({ error: 'Failed to update utility rates' });
  }
});

// @desc    Update system configuration
// @route   PATCH /api/admin/settings/config
// @access  Private/Admin
router.patch('/settings/config', async (req, res) => {
  try {
    const { systemConfig } = req.body;
    
    let settings = await SystemSettings.findOne({ region: 'global' });
    
    if (!settings) {
      settings = await SystemSettings.create({ region: 'global' });
    }
    
    settings.systemConfig = {
      ...settings.systemConfig.toObject(),
      ...systemConfig
    };
    
    await settings.save();
    
    res.json({
      message: 'System configuration updated successfully',
      settings
    });
  } catch (error) {
    console.error('Error updating config:', error);
    res.status(500).json({ error: 'Failed to update system configuration' });
  }
});

export default router;
