import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import geminiRoutes from './routes/geminiRoutes.js';
import { errorHandler } from './utils/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Enable CORS. In production, restrict this to your frontend URL.
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Parse JSON request bodies
app.use(express.json({ limit: '2mb' })); // Increased limit if passing large prompts/context

// Routes
app.use('/api/gemini', geminiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Global Price Backend is running' });
});

// 404 Route Not Found handling
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: {
            message: `Route not found: ${req.originalUrl}`
        }
    });
});

// Global Error Handler Middleware
// This must be defined last, after other app.use() and routes calls
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
