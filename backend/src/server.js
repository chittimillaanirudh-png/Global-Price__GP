import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import geminiRoutes from './routes/geminiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler } from './utils/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas if MONGODB_URI is provided
const connectDB = async () => {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB Atlas Connected Successfully.');
    } catch (err) {
      console.error('MongoDB Atlas Connection Error:', err.message);
    }
  } else {
    console.log('MONGODB_URI not provided. Server running without MongoDB connection.');
  }
};
connectDB();

// Dynamic CORS configuration allowing Vercel deployment, local dev, and wildcard subdomains
const allowedOrigins = [
  'https://global-price-gp.vercel.app',
  'https://global-price-app.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000'
];

if (process.env.FRONTEND_URL) {
  const cleanEnvUrl = process.env.FRONTEND_URL.trim().replace(/\/$/, '');
  if (!allowedOrigins.includes(cleanEnvUrl)) {
    allowedOrigins.push(cleanEnvUrl);
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      
      const cleanOrigin = origin.trim().replace(/\/$/, '');
      if (allowedOrigins.includes(cleanOrigin) || cleanOrigin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      
      // Fallback: allow request to prevent breaking hackathon presentations
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// Preflight CORS handler for all routes
app.options('*', cors());

// Parse JSON request bodies
app.use(express.json({ limit: '5mb' }));

// Routes
app.use('/api/gemini', geminiRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Global Price Backend is running',
    dbConnected: mongoose.connection.readyState === 1 
  });
});

// 404 Route Not Found handling
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.originalUrl}`
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
