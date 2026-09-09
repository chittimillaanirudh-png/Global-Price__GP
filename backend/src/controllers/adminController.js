import mongoose from 'mongoose';
import { MarketData } from '../models/MarketData.js';
import { validateGeminiParsedData } from '../utils/validator.js';
import { AppError } from '../utils/errorHandler.js';

const ADMIN_ID = process.env.ADMIN_ID || '434011';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'GlobalLab@2026';

// In-Memory Fallback Dataset Store for seamless high availability
let inMemoryDataset = null;

const tryConnectDB = async () => {
  if (mongoose.connection.readyState === 1) return true;
  
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 3000
      });
      return true;
    } catch (err) {
      console.warn('[MongoDB Atlas] On-demand connection warning:', err.message);
    }
  }
  return false;
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
 * Get the latest active Market Data stored in MongoDB Atlas (with in-memory fallback)
 */
export const getLatestMarketData = async (_req, res, next) => {
  try {
    const isConnected = await tryConnectDB();

    if (isConnected) {
      try {
        const latestDoc = await MarketData.findOne({ isActive: true }).sort({ createdAt: -1 });
        if (latestDoc) {
          return res.status(200).json({
            success: true,
            data: latestDoc.data,
            metadata: {
              id: latestDoc._id,
              title: latestDoc.title,
              updatedBy: latestDoc.updatedBy,
              updatedAt: latestDoc.updatedAt,
              storage: 'MongoDB Atlas'
            }
          });
        }
      } catch (dbErr) {
        console.warn('[MongoDB Atlas] Query error, using fallback:', dbErr.message);
      }
    }

    // Return in-memory fallback if MongoDB Atlas is unavailable or empty
    if (inMemoryDataset) {
      return res.status(200).json({
        success: true,
        data: inMemoryDataset.data,
        metadata: {
          id: 'in-memory-active',
          title: inMemoryDataset.title,
          updatedBy: inMemoryDataset.updatedBy,
          updatedAt: inMemoryDataset.updatedAt,
          storage: 'In-Memory Store (Atlas Reconnecting)'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: null,
      message: 'No market dataset published yet.'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Save & publish a new Market Dataset to MongoDB Atlas (with in-memory fallback)
 */
export const updateMarketData = async (req, res, next) => {
  try {
    const { marketData, title } = req.body || {};

    if (!marketData) {
      throw new AppError('Market dataset payload ("marketData") is required.', 400);
    }

    const { isValid, missingKeys } = validateGeminiParsedData(marketData);
    if (!isValid) {
      throw new AppError(`Invalid market dataset schema. Missing required keys: ${missingKeys.join(', ')}`, 400);
    }

    const titleStr = title || `Global Market Dataset ${new Date().toISOString().split('T')[0]}`;
    const updatedByStr = `Admin ${ADMIN_ID}`;
    const now = new Date().toISOString();

    // Always update in-memory cache for instant availability
    inMemoryDataset = {
      title: titleStr,
      data: marketData,
      updatedBy: updatedByStr,
      updatedAt: now
    };

    const isConnected = await tryConnectDB();

    if (isConnected) {
      try {
        // Deactivate old active records
        await MarketData.updateMany({ isActive: true }, { isActive: false });

        // Save new dataset to MongoDB Atlas
        const newDoc = await MarketData.create({
          title: titleStr,
          data: marketData,
          updatedBy: updatedByStr,
          isActive: true
        });

        return res.status(201).json({
          success: true,
          message: 'Market dataset successfully published to MongoDB Atlas!',
          metadata: {
            id: newDoc._id,
            title: newDoc.title,
            updatedAt: newDoc.updatedAt,
            storage: 'MongoDB Atlas'
          }
        });
      } catch (dbErr) {
        console.error('[MongoDB Atlas] Write error, saved in memory:', dbErr.message);
      }
    }

    // Response if saved in memory store
    res.status(201).json({
      success: true,
      message: 'Market dataset published to active memory store (MongoDB Atlas connecting).',
      metadata: {
        id: 'in-memory-active',
        title: titleStr,
        updatedAt: now,
        storage: 'Active Memory'
      }
    });
  } catch (err) {
    next(err);
  }
};
