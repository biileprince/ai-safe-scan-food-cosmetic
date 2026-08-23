/**
 * SafeScan — AI Provider Interface
 * 
 * Base interface that all AI providers must implement.
 * This enables swapping between Gemini, OpenAI, Claude, etc.
 * without changing any business logic.
 */

/**
 * @typedef {Object} AIVisionResult
 * @property {string} text - Extracted or generated text
 * @property {number} confidence - 0.0–1.0 confidence score
 * @property {Object} [metadata] - Provider-specific metadata
 */

/**
 * @typedef {Object} AITextResult
 * @property {string} text - Generated text response
 * @property {Object} [metadata] - Provider-specific metadata
 */

/**
 * @typedef {Object} AIStructuredResult
 * @property {Object} data - Parsed structured data (JSON)
 * @property {string} raw - Raw text response before parsing
 */

/**
 * Abstract AI Provider interface.
 * All providers (Gemini, OpenAI, Claude) implement these methods.
 */
export class AIProvider {
  constructor(apiKey, config = {}) {
    if (new.target === AIProvider) {
      throw new Error('AIProvider is abstract — use a concrete implementation like GeminiProvider');
    }
    this.apiKey = apiKey;
    this.config = config;
  }

  /**
   * Get the provider name for logging.
   * @returns {string}
   */
  getName() {
    throw new Error('getName() must be implemented');
  }

  /**
   * Analyze an image and extract text (OCR).
   * @param {Buffer} imageBuffer - The image data
   * @param {string} prompt - Instructions for what to extract
   * @returns {Promise<AIVisionResult>}
   */
  async analyzeImage(imageBuffer, prompt) {
    throw new Error('analyzeImage() must be implemented');
  }

  /**
   * Generate text from a prompt.
   * @param {string} prompt - The text prompt
   * @param {Object} [options] - Additional options
   * @returns {Promise<AITextResult>}
   */
  async generateText(prompt, options = {}) {
    throw new Error('generateText() must be implemented');
  }

  /**
   * Generate structured JSON output from a prompt.
   * @param {string} prompt - The text prompt
   * @param {Object} schema - Expected JSON schema
   * @param {Object} [options] - Additional options
   * @returns {Promise<AIStructuredResult>}
   */
  async generateStructured(prompt, schema, options = {}) {
    throw new Error('generateStructured() must be implemented');
  }
}
