import mongoose from 'mongoose';

const systemSettingsSchema = new mongoose.Schema({
  region: { type: String, required: true, unique: true, default: 'global' },
  
  // Utility Rates
  electricityRate: {
    value: { type: Number, required: true, default: 0.12 },
    currency: { type: String, default: 'USD' },
    unit: { type: String, default: 'kWh' },
    lastUpdated: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  
  waterRate: {
    value: { type: Number, required: true, default: 0.004 },
    currency: { type: String, default: 'USD' },
    unit: { type: String, default: 'gallon' },
    lastUpdated: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  
  // Peak Hours Configuration
  peakHours: {
    electricity: [{
      start: String, // e.g., "17:00"
      end: String,   // e.g., "21:00"
      multiplier: { type: Number, default: 1.5 }
    }],
    water: [{
      start: String,
      end: String,
      multiplier: { type: Number, default: 1.2 }
    }]
  },
  
  // System Configuration
  systemConfig: {
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: String,
    allowNewRegistrations: { type: Boolean, default: true },
    requireEmailVerification: { type: Boolean, default: false },
    requireAdminApproval: { type: Boolean, default: true }
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
systemSettingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('SystemSettings', systemSettingsSchema);
