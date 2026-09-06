/**
 * AI Utility Functions
 */

import { GEMINI_AI_MODELS, GEMINI_API_BASE_URL } from '../constants/ai.constants';
import { getGeminiApiKey } from '../configs/api.config';

/**
 * Builds Google Gemini API URL with model, API key, and action method.
 * @param model Model identifier name (e.g., 'gemini-2.0-flash')
 * @param apiKey Optional API key override (defaults to resolved getGeminiApiKey())
 * @param action API action endpoint (defaults to 'generateContent')
 * @returns Fully formatted Gemini API Endpoint URL
 */
export const getGeminiApiUrl = (
  model: string,
  apiKey: string = getGeminiApiKey(),
  action: string = 'generateContent'
): string => {
  return `${GEMINI_API_BASE_URL}/${model}:${action}?key=${apiKey}`;
};

/**
 * Single Centralized Function to Call Google Gemini AI API with automatic model fallback.
 * @param prompt Text prompt sent to Gemini AI
 * @param models List of fallback model names (defaults to GEMINI_AI_MODELS)
 * @returns Raw text response string from Gemini AI
 */
export async function callGeminiAiApi(
  prompt: string,
  models: string[] = GEMINI_AI_MODELS
): Promise<string> {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  let lastError: any = null;

  for (const model of models) {
    try {
      const url = getGeminiApiUrl(model, apiKey, 'generateContent');
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          return rawText;
        }
      } else {
        const errJson = await res.json().catch(() => null);
        console.warn(`Gemini AI (${model}) HTTP ${res.status}:`, errJson);
      }
    } catch (err) {
      console.warn(`Gemini AI (${model}) fetch failed:`, err);
      lastError = err;
    }
  }

  throw lastError || new Error('ALL_GEMINI_MODELS_FAILED');
}
