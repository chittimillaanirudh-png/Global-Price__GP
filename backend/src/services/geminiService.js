import { GoogleGenAI } from '@google/genai';
import { AppError } from '../utils/errorHandler.js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the GoogleGenAI client
// Note: We only instantiate this once. It will use process.env.GEMINI_API_KEY automatically if not passed.
let aiClient;
try {
  // @google/genai uses GEMINI_API_KEY from environment variables by default.
  aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} catch (error) {
  console.error("Failed to initialize GoogleGenAI client:", error);
}

/**
 * Service function to interact with the Gemini API using @google/genai
 * @param {string} prompt - The prompt to send to Gemini
 * @param {object} options - Options containing model name and optional system instructions
 * @returns {Promise<string>} - The response text from Gemini
 */
export const generateContentWithGemini = async (prompt, options = {}) => {
  if (!aiClient) {
    throw new AppError('Gemini API client is not initialized. Check your GEMINI_API_KEY.', 500);
  }

  // Default to gemini-2.5-flash if no model is provided
  const model = options.model || 'gemini-2.5-flash';
  
  const generateOptions = {
    temperature: 0.2, // Low temperature for consistent JSON output
  };

  if (options.systemInstruction) {
    generateOptions.systemInstruction = options.systemInstruction;
  }
  
  // Set response schema if provided
  if (options.responseSchema) {
      generateOptions.responseSchema = options.responseSchema;
  }
  
  if (options.responseMimeType) {
      generateOptions.responseMimeType = options.responseMimeType;
  }

  try {
    const response = await aiClient.models.generateContent({
      model: model,
      contents: prompt,
      config: generateOptions,
    });
    
    if (response && response.text) {
      return response.text;
    } else {
      throw new Error("Invalid response format from Gemini API");
    }
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Handle specific API errors
    if (error.status === 401 || error.message.includes('API key')) {
      throw new AppError('Invalid or missing Gemini API Key.', 401, error.message);
    } else if (error.status === 429) {
      throw new AppError('Gemini API rate limit exceeded. Please try again later.', 429, error.message);
    } else {
      throw new AppError(`Failed to generate content: ${error.message || 'Unknown error'}`, 502, error.message);
    }
  }
};
