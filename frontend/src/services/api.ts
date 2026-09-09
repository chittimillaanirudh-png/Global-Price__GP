import { ParsedData } from '../types';

const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;

  // If VITE_API_URL is explicitly configured to a remote server, use it
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl.replace(/\/$/, '');
  }

  // In production browser environment (e.g. deployed on Vercel), fall back to live Render backend
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://global-price-gp.onrender.com';
  }

  return (envUrl || 'http://localhost:5000').replace(/\/$/, '');
};

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
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/api/gemini/generate`;

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
      `Cannot connect to backend server at ${baseUrl}. Please ensure your backend is online.`
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
