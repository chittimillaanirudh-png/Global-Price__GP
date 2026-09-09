import { ParsedData } from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export interface GeminiApiResponse {
  success: boolean;
  data?: ParsedData;
  error?: string;
  details?: any;
  disclaimer?: string;
}

/**
 * Sends prompt to the secure backend API endpoint POST /api/gemini/generate
 */
export const fetchGeminiDataFromBackend = async (prompt: string): Promise<ParsedData> => {
  const endpoint = `${API_BASE_URL}/api/gemini/generate`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
  } catch (err: any) {
    console.error('Backend Network Error:', err);
    throw new Error(
      `Cannot connect to backend server at ${API_BASE_URL}. Please check if the backend service is running.`
    );
  }

  const result: GeminiApiResponse = await response.json().catch(() => ({
    success: false,
    error: 'Failed to parse backend response as JSON.',
  }));

  if (!response.ok || !result.success || !result.data) {
    const errorMsg = result.error || `Backend returned status ${response.status}`;
    throw new Error(errorMsg);
  }

  return result.data;
};
