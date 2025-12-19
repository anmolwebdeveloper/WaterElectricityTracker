import mongoose from 'mongoose';

const meterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  meterNumber: { type: String, required: true, unique: true },
  type: { type: String, enum: ['water', 'electricity'], required: true },
  provider: { type: String, required: true },
  location: String,
  installDate: Date,
  lastReading: {
    value: Number,
    timestamp: Date
  },
  status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' },
  settings: {
    unit: String,
    threshold: Number,
    alertEnabled: Boolean
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

meterSchema.index({ userId: 1, type: 1 });
meterSchema.index({ meterNumber: 1 }, { unique: true });

export default mongoose.model('Meter', meterSchema);
