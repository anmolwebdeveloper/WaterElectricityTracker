import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['threshold', 'unusual', 'goal'], required: true },
  severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  isResolved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

alertSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Alert', alertSchema);
