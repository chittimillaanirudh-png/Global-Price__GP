import { validatePromptRequest } from '../utils/validator.js';
import { fetchStructuredGPData } from '../services/geminiService.js';
import { AppError } from '../utils/errorHandler.js';

/**
 * Controller to handle POST /api/gemini/generate
 */
export const generateData = async (req, res, next) => {
  try {
    const { isValid, error } = validatePromptRequest(req.body);
    if (!isValid) {
      throw new AppError(error, 400);
    }

    const { prompt } = req.body;
    const parsedData = await fetchStructuredGPData(prompt);

    res.status(200).json({
      success: true,
      data: parsedData,
      disclaimer: "Data generated via Gemini AI economic estimation. Real-time macro metrics are supplemented via verified data sources."
    });
  } catch (err) {
    next(err);
  }
};
