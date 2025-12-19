import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['water', 'electricity', 'cost', 'sustainability'], required: true },
  target: { type: Number, required: true },
  current: { type: Number, default: 0 },
  unit: { type: String, required: true },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['active', 'completed', 'failed'], default: 'active' },
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

goalSchema.index({ userId: 1, status: 1 });

goalSchema.virtual('progress').get(function() {
  return Math.min(Math.round((this.current / this.target) * 100), 100);
});

goalSchema.set('toJSON', { virtuals: true });
goalSchema.set('toObject', { virtuals: true });

export default mongoose.model('Goal', goalSchema);
