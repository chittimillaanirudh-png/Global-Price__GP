import { Router } from 'express';
import { generateData } from '../controllers/geminiController.js';

const router = Router();

// POST /api/gemini/generate
router.post('/generate', generateData);

export default router;
