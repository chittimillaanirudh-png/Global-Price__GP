import mongoose from 'mongoose';
import { MarketData } from '../models/MarketData.js';
import { validateGeminiParsedData } from '../utils/validator.js';
import { AppError } from '../utils/errorHandler.js';

const ADMIN_ID = process.env.ADMIN_ID || '434011';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'GlobalLab@2026';

const ensureDatabaseConnection = async () => {
  if (mongoose.connection.readyState !== 1 && process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
    } catch (err) {
      console.error('Failed on-demand MongoDB connection:', err.message);
    }
  }
  if (mongoose.connection.readyState !== 1) {
    throw new AppError(
      'MongoDB Atlas database is currently connecting or unavailable. Please verify MONGODB_URI on Render and ensure MongoDB Atlas Network Access has IP 0.0.0.0/0 enabled.',
      503
    );
  }
};

/**
 * Admin Login Handler
 */
export const loginAdmin = async (req, res, next) => {
  try {
    const { adminId, password } = req.body || {};

    if (!adminId || !password) {
      throw new AppError('Both Admin ID and Password are required.', 400);
    }

    if (String(adminId).trim() !== ADMIN_ID || String(password).trim() !== ADMIN_PASSWORD) {
      throw new AppError('Invalid Admin ID or Password credentials.', 401);
    }

    // Generate lightweight admin session token
    const token = Buffer.from(`${ADMIN_ID}:${Date.now()}`).toString('base64');

    res.status(200).json({
      success: true,
      message: 'Admin authentication successful',
      token,
      adminId: ADMIN_ID
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get the latest active Market Data stored in MongoDB Atlas
 */
export const getLatestMarketData = async (_req, res, next) => {
  try {
    await ensureDatabaseConnection();
    const latestDoc = await MarketData.findOne({ isActive: true }).sort({ createdAt: -1 });

    if (!latestDoc) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No market dataset published in MongoDB Atlas yet.'
      });
    }

    res.status(200).json({
      success: true,
      data: latestDoc.data,
      metadata: {
        id: latestDoc._id,
        title: latestDoc.title,
        updatedBy: latestDoc.updatedBy,
        updatedAt: latestDoc.updatedAt
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Save & publish a new Market Dataset to MongoDB Atlas
 */
export const updateMarketData = async (req, res, next) => {
  try {
    await ensureDatabaseConnection();
    const { marketData, title } = req.body || {};

    if (!marketData) {
      throw new AppError('Market dataset payload ("marketData") is required.', 400);
    }

    const { isValid, missingKeys } = validateGeminiParsedData(marketData);
    if (!isValid) {
      throw new AppError(`Invalid market dataset schema. Missing required keys: ${missingKeys.join(', ')}`, 400);
    }

    // Deactivate old active records
    await MarketData.updateMany({ isActive: true }, { isActive: false });

    // Save new dataset
    const newDoc = await MarketData.create({
      title: title || `Global Market Dataset ${new Date().toISOString().split('T')[0]}`,
      data: marketData,
      updatedBy: `Admin ${ADMIN_ID}`,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Market dataset successfully published to MongoDB Atlas!',
      metadata: {
        id: newDoc._id,
        title: newDoc.title,
        updatedAt: newDoc.updatedAt
      }
    });
  } catch (err) {
    next(err);
  }
};
