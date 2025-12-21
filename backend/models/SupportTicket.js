import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema({
  ticketNumber: { 
    type: String, 
    unique: true, 
    required: true 
  },
  
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  subject: { 
    type: String, 
    required: true 
  },
  
  description: { 
    type: String, 
    required: true 
  },
  
  category: {
    type: String,
    enum: ['billing', 'technical', 'account', 'meter', 'general'],
    default: 'general'
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  
  // Conversation thread
  messages: [{
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    senderRole: {
      type: String,
      enum: ['user', 'admin'],
      required: true
    },
    message: { 
      type: String, 
      required: true 
    },
    timestamp: { 
      type: Date, 
      default: Date.now 
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  
  resolvedAt: Date,
  resolvedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-generate ticket number
supportTicketSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('SupportTicket').countDocuments();
    this.ticketNumber = `TKT-${Date.now()}-${(count + 1).toString().padStart(5, '0')}`;
  }
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('SupportTicket', supportTicketSchema);
