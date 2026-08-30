/**
 * SafeScan — Provider Factory
 * 
 * Reads environment variables to determine which AI provider to use
 * and returns the configured instance.
 * 
 * Environment variables:
 *   AI_PROVIDER  — "gemini" | "openai" | "claude" (default: "gemini")
 *   AI_API_KEY   — The API key for the selected provider
 *   AI_MODEL     — Optional model override (e.g., "gemini-2.0-flash", "gpt-4o")
 */

import { GeminiProvider } from './geminiProvider.js';
// Future providers:
// import { OpenAIProvider } from './openaiProvider.js';
// import { ClaudeProvider } from './claudeProvider.js';

/**
 * Create and return the configured AI provider instance.
 * 
 * @param {Object} [overrides] - Optional overrides for testing
 * @param {string} [overrides.provider] - Override AI_PROVIDER env
 * @param {string} [overrides.apiKey] - Override AI_API_KEY env
 * @param {string} [overrides.model] - Override AI_MODEL env
 * @returns {import('./aiProvider.js').AIProvider}
 */
export function getProvider(overrides = {}) {
  const provider = overrides.provider || process.env.AI_PROVIDER || 'gemini';
  const apiKey = overrides.apiKey || process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
  const model = overrides.model || process.env.AI_MODEL;

  if (!apiKey) {
    throw new Error(
      `AI_API_KEY or GEMINI_API_KEY environment variable is required. ` +
      `Set it in your Appwrite Function environment variables.`
    );
  }

  const config = {};
  if (model) config.model = model;

  switch (provider.toLowerCase()) {
    case 'gemini':
    case 'google':
      return new GeminiProvider(apiKey, config);

    // case 'openai':
    //   return new OpenAIProvider(apiKey, config);

    // case 'claude':
    // case 'anthropic':
    //   return new ClaudeProvider(apiKey, config);

    default:
      throw new Error(
        `Unknown AI provider: "${provider}". ` +
        `Supported providers: gemini, openai, claude. ` +
        `Set AI_PROVIDER environment variable.`
      );
  }
}

/**
 * List all supported provider names.
 */
export function getSupportedProviders() {
  return ['gemini']; // Add 'openai', 'claude' as they are implemented
}
