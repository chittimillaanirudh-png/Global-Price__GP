import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import geminiRoutes from './routes/geminiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandlerMiddleware } from './utils/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB Atlas
if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    })
    .then(() => {
      console.log(' Successfully connected to MongoDB Atlas Database!');
    })
    .catch((err) => {
      console.error(' MongoDB Atlas connection error:', err.message);
    });
} else {
  console.warn('⚠️ MONGODB_URI is not set. Database persistence will be disabled.');
}

// CORS configuration supporting production & local development origins
const allowedOrigins = [
  FRONTEND_URL,
  'https://global-price-gp.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '2mb' }));

// Health Check Endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Global Price Backend API',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Global Price Backend API is online.',
    database: mongoose.connection.readyState === 1 ? 'MongoDB Atlas Connected' : 'Disconnected',
    documentation: 'Use POST /api/gemini/generate or /api/admin endpoints'
  });
});

// Register Routes
app.use('/api/gemini', geminiRoutes);
app.use('/api/admin', adminRoutes);

// Centralized Error Handling
app.use(errorHandlerMiddleware);

// Bind to 0.0.0.0 for Render Web Service compatibility
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=================================`);
  console.log(` Global Price Backend Server`);
  console.log(` Running on: http://0.0.0.0:${PORT}`);
  console.log(` Allowed Frontend URL: ${FRONTEND_URL}`);
  console.log(`=================================`);
});
