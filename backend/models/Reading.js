import mongoose from 'mongoose';

const readingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['water', 'electricity'], required: true },
  value: { type: Number, required: true },
  unit: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  notes: String
});

readingSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model('Reading', readingSchema);
