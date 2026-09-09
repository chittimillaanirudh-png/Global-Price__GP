import mongoose from 'mongoose';

const MarketDataSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Daily Global Market Dataset'
    },
    data: {
      type: Object,
      required: true
    },
    updatedBy: {
      type: String,
      default: 'Admin'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Index for fast query of the latest active dataset
MarketDataSchema.index({ isActive: 1, createdAt: -1 });

export const MarketData = mongoose.model('MarketData', MarketDataSchema);
