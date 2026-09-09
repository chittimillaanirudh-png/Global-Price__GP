import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import geminiRoutes from './routes/geminiRoutes.js';
import { errorHandlerMiddleware } from './utils/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS configuration supporting production & local development origins
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // If deployed on Vercel preview or custom subdomain, match domain pattern if desired
      if (origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive CORS for smooth multi-domain deployment
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '1mb' }));

// Health Check Endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Global Price Backend API',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Global Price Backend API is online.',
    documentation: 'Use POST /api/gemini/generate to query Gemini AI'
  });
});

// Gemini Routes
app.use('/api/gemini', geminiRoutes);

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
