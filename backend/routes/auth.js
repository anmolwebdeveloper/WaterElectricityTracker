import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import twilio from 'twilio';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && 
    process.env.TWILIO_ACCOUNT_SID !== 'your-twilio-account-sid') {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id') {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            profilePicture: profile.photos[0]?.value,
            authMethod: 'google',
            isVerified: true
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  ));
}

const otpStore = new Map();

// Email/Password Registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, electricityMeterNo, waterMeterNo } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({
      email,
      password,
      name,
      electricityMeterNo: electricityMeterNo || null,
      waterMeterNo: waterMeterNo || null,
      authMethod: 'email',
      isVerified: false,
      verificationRequestedAt: electricityMeterNo || waterMeterNo ? new Date() : null
    });

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        authMethod: user.authMethod,
        isVerified: user.isVerified,
        electricityMeterNo: user.electricityMeterNo,
        waterMeterNo: user.waterMeterNo
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Email/Password Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        authMethod: user.authMethod,
        isVerified: user.isVerified,
        electricityMeterNo: user.electricityMeterNo,
        waterMeterNo: user.waterMeterNo
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const token = generateToken(req.user._id);
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
});

// Phone OTP - Request
router.post('/phone/request-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    if (!twilioClient) {
      return res.status(503).json({ 
        error: 'SMS service is not configured. Please use email/password login.' 
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(phoneNumber, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    await twilioClient.messages.create({
      body: `Your WattsFlow verification code is: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    res.json({ message: 'OTP sent successfully', phoneNumber });
  } catch (error) {
    console.error('OTP request error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Phone OTP - Verify
router.post('/phone/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp, name } = req.body;
    
    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP are required' });
    }

    const stored = otpStore.get(phoneNumber);
    if (!stored || stored.otp !== otp || stored.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    otpStore.delete(phoneNumber);

    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = await User.create({
        phoneNumber,
        name: name || 'User',
        authMethod: 'phone',
        isVerified: true
      });
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        authMethod: user.authMethod
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phoneNumber: req.user.phoneNumber,
      authMethod: req.user.authMethod,
      profilePicture: req.user.profilePicture,
      isVerified: req.user.isVerified,
      electricityMeterNo: req.user.electricityMeterNo,
      waterMeterNo: req.user.waterMeterNo,
      verificationRequestedAt: req.user.verificationRequestedAt
    }
  });
});

export default router;
