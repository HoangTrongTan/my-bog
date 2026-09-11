/**
 * API Configuration Module
 * Dynamically resolves API key strictly from production environment variables (AUTH_API_KEY).
 * Supports build-time injection via scripts/set-env.js on Vercel.
 */

import { GENERATED_AUTH_API_KEY } from './env.generated';

declare const process: { env?: Record<string, string | undefined> } | undefined;

interface RuntimeEnvWindow extends Window {
  __ENV__?: { AUTH_API_KEY?: string; GEMINI_API_KEY?: string };
  AUTH_API_KEY?: string;
  GEMINI_API_KEY?: string;
}

export { GEMINI_AI_MODELS, GEMINI_API_BASE_URL } from '../constants/ai.constants';
export { getGeminiApiUrl, callGeminiAiApi } from '../utils/ai.utils';

export const getGeminiApiKey = (): string => {
  // 1. Check build-time injected environment variable from Vercel / CI
  if (typeof GENERATED_AUTH_API_KEY === 'string' && GENERATED_AUTH_API_KEY.trim().length > 0) {
    return GENERATED_AUTH_API_KEY.trim();
  }

  // 2. Check window runtime environment variables
  if (typeof window !== 'undefined') {
    const win = window as RuntimeEnvWindow;
    const envKey =
      win.__ENV__?.AUTH_API_KEY ||
      win.__ENV__?.GEMINI_API_KEY ||
      win.AUTH_API_KEY ||
      win.GEMINI_API_KEY ||
      localStorage.getItem('AUTH_API_KEY') ||
      localStorage.getItem('GEMINI_API_KEY');

    if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
      return envKey.trim();
    }
  }

  // 3. Check process.env (Node.js runtime environment)
  try {
    if (typeof process !== 'undefined' && process?.env) {
      const procKey = process.env['AUTH_API_KEY'] || process.env['GEMINI_API_KEY'];
      if (procKey && typeof procKey === 'string' && procKey.trim().length > 0) {
        return procKey.trim();
      }
    }
  } catch {
    // Ignore process error in browser
  }

  return '';
};
