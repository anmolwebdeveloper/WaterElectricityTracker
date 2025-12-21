import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  phoneNumber: { type: String, unique: true, sparse: true },
  googleId: { type: String, unique: true, sparse: true },
  profilePicture: String,
  avatarUrl: String,
  authMethod: { type: String, enum: ['email', 'google', 'phone'], required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  
  // Account Status Management
  status: { 
    type: String, 
    enum: ['active', 'removed', 'pending', 'suspended'], 
    default: 'pending' 
  },
  statusReason: String,
  statusChangedAt: Date,
  statusChangedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  electricityMeterNo: { type: String, trim: true },
  waterMeterNo: { type: String, trim: true },
  isVerified: { type: Boolean, default: false },
  verificationRequestedAt: { type: Date },
  verifiedAt: { type: Date },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Audit Logs
  auditLogs: [{
    action: String,
    description: String,
    ipAddress: String,
    userAgent: String,
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }],
  
  // Security Tracking
  lastLoginAt: Date,
  lastLoginIp: String,
  lastLoginUserAgent: String,
  loginHistory: [{
    ipAddress: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now },
    success: Boolean
  }],
  
  settings: {
    units: { type: String, enum: ['metric', 'imperial'], default: 'imperial' },
    currency: { type: String, default: 'USD' },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
