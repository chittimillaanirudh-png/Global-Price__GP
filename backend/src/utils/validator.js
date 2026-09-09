/**
 * Utility functions for validating requests and Gemini responses.
 */

export const validatePromptRequest = (body) => {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Request body must be a JSON object.' };
  }
  
  if (!body.prompt || typeof body.prompt !== 'string' || body.prompt.trim().length === 0) {
    return { isValid: false, error: 'Field "prompt" is required and must be a non-empty string.' };
  }
  
  if (body.prompt.length > 50000) {
    return { isValid: false, error: 'Prompt exceeds maximum allowed length (50,000 characters).' };
  }
  
  return { isValid: true };
};

export const validateGeminiParsedData = (data) => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, missingKeys: ['Invalid JSON object'] };
  }

  const requiredKeys = [
    'BaseRetailCost',
    'CountryTaxRate',
    'CountryDutyRate',
    'LogisticsPremium',
    'RetailMargin',
    'GlobalPurchasingPower'
  ];

  const missingKeys = requiredKeys.filter(
    (key) => typeof data[key] !== 'number' || isNaN(data[key])
  );

  if (data.TargetCountries && typeof data.TargetCountries !== 'object') {
    missingKeys.push('TargetCountries must be an object');
  }

  return {
    isValid: missingKeys.length === 0,
    missingKeys
  };
};
