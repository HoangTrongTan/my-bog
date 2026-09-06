/**
 * API Configuration Module
 * Dynamically resolves API key strictly from production environment variables (AUTH_API_KEY).
 *
 * Does NOT store or hardcode any default key in source files.
 */

declare const process: any;

export const getGeminiApiKey = (): string => {
  // 1. Check window runtime environment variables (injected in production deployment like Vercel / Netlify / Docker)
  if (typeof window !== 'undefined') {
    const win = window as any;
    const envKey =
      win.__ENV__?.AUTH_API_KEY ||
      win.AUTH_API_KEY ||
      localStorage.getItem('AUTH_API_KEY');

    if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
      return envKey.trim();
    }
  }

  // 2. Check process.env (if replaced at build time in production)
  try {
    if (typeof process !== 'undefined' && process?.env) {
      const procKey = process.env['AUTH_API_KEY'];
      if (procKey && typeof procKey === 'string' && procKey.trim().length > 0) {
        return procKey.trim();
      }
    }
  } catch {
    // Ignore process reference error in strict browser context
  }

  return '';
};
