import mongoose from 'mongoose';

const consumptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  meterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meter', required: true },
  type: { type: String, enum: ['water', 'electricity'], required: true },
  value: { type: Number, required: true },
  unit: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
  isRealTime: { type: Boolean, default: false },
  breakdown: {
    hvac: Number,
    lighting: Number,
    appliances: Number,
    waterHeating: Number,
    other: Number
  }
});

consumptionSchema.index({ userId: 1, timestamp: -1 });
consumptionSchema.index({ meterId: 1, timestamp: -1 });
consumptionSchema.index({ type: 1, timestamp: -1 });

export default mongoose.model('Consumption', consumptionSchema);
