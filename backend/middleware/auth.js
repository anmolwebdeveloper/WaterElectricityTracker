import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if this is the admin user
    if (decoded.id === 'admin' && decoded.isAdmin) {
      req.user = {
        _id: 'admin',
        id: 'admin',
        name: 'Admin',
        email: 'admin@wattsflow.com',
        isAdmin: true,
        isVerified: true,
        status: 'active',
        role: 'admin'
      };
      return next();
    }
    
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Check user status
    if (req.user.status === 'removed') {
      return res.status(403).json({ 
        error: 'Account deactivated',
        status: 'removed',
        code: 'ACCOUNT_REMOVED',
        message: 'Your account has been deactivated. Please contact support for reactivation.',
        redirectTo: '/verification-pending'
      });
    }

    if (req.user.status === 'suspended') {
      return res.status(403).json({ 
        error: 'Account suspended',
        status: 'suspended',
        code: 'ACCOUNT_SUSPENDED',
        message: 'Your account has been temporarily suspended. ' + (req.user.statusReason || 'Please contact support for details.'),
        redirectTo: '/verification-pending'
      });
    }

    // Track login activity
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    // Update last login info
    if (!req.user.lastLoginAt || Date.now() - req.user.lastLoginAt.getTime() > 60000) { // Update only once per minute
      req.user.lastLoginAt = Date.now();
      req.user.lastLoginIp = ipAddress;
      req.user.lastLoginUserAgent = userAgent;
      
      // Add to login history (keep last 50)
      if (!req.user.loginHistory) req.user.loginHistory = [];
      req.user.loginHistory.unshift({
        ipAddress,
        userAgent,
        timestamp: Date.now(),
        success: true
      });
      req.user.loginHistory = req.user.loginHistory.slice(0, 50);
      
      await req.user.save();
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

// Check if user is verified
export const checkVerified = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check status first
    if (req.user.status !== 'active' && req.user.status !== 'pending') {
      return res.status(403).json({ 
        error: 'Account not accessible',
        status: req.user.status,
        code: `ACCOUNT_${req.user.status.toUpperCase()}`,
        message: 'Your account cannot access this resource.',
        redirectTo: '/verification-pending'
      });
    }

    if (!req.user.isVerified) {
      return res.status(403).json({ 
        error: 'Account pending verification',
        isVerified: false,
        status: req.user.status || 'pending',
        code: 'VERIFICATION_PENDING',
        message: 'Your meter numbers are being verified by an administrator. You will be notified once approved.',
        redirectTo: '/verification-pending'
      });
    }

    next();
  } catch (error) {
    console.error('Verification check error:', error);
    return res.status(500).json({ error: 'Verification check failed' });
  }
};

// Middleware to check if user is admin
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (req.user.role !== 'admin' && !req.user.isAdmin) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'You do not have permission to access this resource.'
      });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(500).json({ error: 'Authorization check failed' });
  }
};

// Alias for backwards compatibility
export const authenticate = protect;
