import { Router } from 'express';
import { loginAdmin, getLatestMarketData, updateMarketData } from '../controllers/adminController.js';

const router = Router();

// Admin Authentication
router.post('/login', loginAdmin);

// Market Data Endpoints
router.get('/market-data', getLatestMarketData);
router.post('/market-data', updateMarketData);

export default router;
