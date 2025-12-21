import mongoose from 'mongoose';

const globalNotificationSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  
  message: { 
    type: String, 
    required: true 
  },
  
  type: {
    type: String,
    enum: ['info', 'warning', 'alert', 'maintenance', 'update'],
    default: 'info'
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
  // Targeting
  targetAudience: {
    type: String,
    enum: ['all', 'verified', 'pending', 'specific'],
    default: 'all'
  },
  
  specificUsers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  
  // Scheduling
  scheduledFor: Date,
  expiresAt: Date,
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sent', 'expired'],
    default: 'draft'
  },
  
  sentAt: Date,
  
  // Analytics
  totalRecipients: { type: Number, default: 0 },
  readBy: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now }
  }],
  
  // Display Options
  displayOptions: {
    showOnDashboard: { type: Boolean, default: true },
    showAsPopup: { type: Boolean, default: false },
    isDismissible: { type: Boolean, default: true }
  },
  
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
globalNotificationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('GlobalNotification', globalNotificationSchema);
