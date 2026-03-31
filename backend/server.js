import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import readingsRoutes from './routes/readings.js';
import alertsRoutes from './routes/alerts.js';
import analyticsRoutes from './routes/analytics.js';
import goalsRoutes from './routes/goals.js';
import consumptionRoutes from './routes/consumption.js';
import metersRoutes from './routes/meters.js';
import reportsRoutes from './routes/reports.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');

// CORS configuration for development and production
const corsOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL].filter(Boolean)
  : [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176'
    ].filter(Boolean);

const corsOriginHandler = (origin, callback) => {
  if (!origin) {
    return callback(null, true);
  }

  if (corsOrigins.length === 0 || corsOrigins.includes(origin)) {
    return callback(null, true);
  }

  return callback(new Error('Not allowed by CORS'));
};

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: corsOrigins.length === 0 ? true : corsOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(helmet());
app.use(cors({
  origin: corsOriginHandler,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wattsflow')
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => console.error('✗ MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/readings', readingsRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/consumption', consumptionRoutes);
app.use('/api/meters', metersRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(frontendDistPath));

  app.get(/^(?!\/api(?:\/|$))(?!\/socket\.io(?:\/|$)).*/, (req, res) => {
    const indexPath = path.join(frontendDistPath, 'index.html');

    if (!existsSync(indexPath)) {
      return res.status(503).json({
        error: 'Frontend build not found. Ensure frontend/dist is built during deploy.'
      });
    }

    return res.sendFile(indexPath);
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'WattsFlow backend is running',
      health: '/api/health'
    });
  });
}

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('subscribe', (userId) => {
    socket.join(`user:${userId}`);
    console.log(`User ${userId} subscribed to real-time updates`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.set('io', io);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV}`);
});

export { io };
