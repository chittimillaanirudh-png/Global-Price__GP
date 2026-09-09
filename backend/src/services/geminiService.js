import { GoogleGenAI } from '@google/genai';
import { AppError } from '../utils/errorHandler.js';
import { validateGeminiParsedData } from '../utils/validator.js';

/**
 * Service to handle secure interactions with the Gemini API.
 */
export const fetchStructuredGPData = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    throw new AppError('GEMINI_API_KEY is missing or not configured on the backend server.', 500);
  }

  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  const systemInstruction = `You are a professional global trade economist engine. Your sole task is to calculate and return exact JSON data matching the user's specified schema for all target countries. Return ONLY valid raw JSON with no markdown wrapping or additional explanations.`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    const rawText = response.text;
    if (!rawText) {
      throw new AppError('Gemini API returned an empty response.', 502);
    }

    // Extract JSON block
    let parsedData = null;
    try {
      const firstBrace = rawText.indexOf('{');
      const lastBrace = rawText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        const jsonStr = rawText.substring(firstBrace, lastBrace + 1);
        parsedData = JSON.parse(jsonStr);
      } else {
        parsedData = JSON.parse(rawText);
      }
    } catch (parseErr) {
      console.error('[Gemini Service] JSON Parsing Error:', parseErr.message);
      throw new AppError('Failed to parse Gemini response as valid JSON.', 502, { rawTextSnippet: rawText.slice(0, 300) });
    }

    // Validate structured fields
    const { isValid, missingKeys } = validateGeminiParsedData(parsedData);
    if (!isValid) {
      throw new AppError(`Gemini response is missing required GP fields: ${missingKeys.join(', ')}`, 502, { missingKeys });
    }

    return parsedData;
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }

    // Handle rate limits and API status codes
    const errMsg = err.message || '';
    if (errMsg.includes('429') || errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('rate limit')) {
      throw new AppError('Gemini API rate limit exceeded or quota exhausted. Please try again later.', 429);
    }

    if (errMsg.toLowerCase().includes('api key') || errMsg.toLowerCase().includes('unauthorized') || errMsg.includes('401') || errMsg.includes('403')) {
      throw new AppError('Invalid or unauthorized GEMINI_API_KEY provided.', 401);
    }

    if (errMsg.toLowerCase().includes('timeout') || errMsg.toLowerCase().includes('econnreset') || errMsg.toLowerCase().includes('fetch failed')) {
      throw new AppError('Network connection timeout while calling Gemini API.', 504);
    }

    console.error('[Gemini Service] Unexpected API Error:', err);
    throw new AppError(`Gemini API Error: ${errMsg || 'Failed to generate content'}`, 500);
  }
};
