import express from 'express';
import { generateContentWithGemini } from '../services/geminiService.js';
import { validatePromptRequest } from '../utils/validator.js';
import { AppError } from '../utils/errorHandler.js';

const router = express.Router();

/**
 * @route POST /api/gemini/generate
 * @desc Generate content using Gemini API
 * @access Public (Consider adding rate limiting or basic auth for production)
 */
router.post('/generate', async (req, res, next) => {
  try {
    // Validate request body
    const { isValid, error } = validatePromptRequest(req.body);
    if (!isValid) {
      throw new AppError(error, 400);
    }

    const { prompt, options } = req.body;

    // Call the Gemini service
    const generatedText = await generateContentWithGemini(prompt, options);

    // Try to parse the text as JSON if it looks like JSON (for our specific use case)
    // Sometimes Gemini returns JSON wrapped in markdown code blocks
    let parsedData = generatedText;
    try {
        let cleanText = generatedText;
        if (cleanText.startsWith('```json')) {
            cleanText = cleanText.substring(7, cleanText.length - 3).trim();
        } else if (cleanText.startsWith('```')) {
            cleanText = cleanText.substring(3, cleanText.length - 3).trim();
        }
        parsedData = JSON.parse(cleanText);
    } catch (e) {
        // If it's not valid JSON, we just return the raw text
        console.log("Response was not JSON or failed to parse. Returning raw text.");
    }

    // Send successful response
    res.status(200).json({
      success: true,
      data: parsedData,
      rawOutput: typeof parsedData !== 'string' ? generatedText : undefined
    });

  } catch (error) {
    // Pass errors to the global error handler
    next(error);
  }
});

export default router;
