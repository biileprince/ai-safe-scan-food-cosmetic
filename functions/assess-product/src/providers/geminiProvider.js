/**
 * SafeScan — Gemini Provider
 * 
 * Concrete implementation of AIProvider for Google Gemini 2.0 Flash.
 * Uses the unified @google/genai SDK.
 */

import { GoogleGenAI } from '@google/genai';
import { AIProvider } from './aiProvider.js';

export class GeminiProvider extends AIProvider {
  constructor(apiKey, config = {}) {
    super(apiKey, config);
    this.client = new GoogleGenAI({ apiKey });
    this.model = config.model || 'gemini-2.5-flash';
  }

  getName() {
    return `Gemini (${this.model})`;
  }

  async analyzeImage(imageBuffer, prompt) {
    const base64Image = imageBuffer.toString('base64');

    const response = await this.client.models.generateContent({
      model: this.model,
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
              },
            },
            { text: prompt },
          ],
        },
      ],
    });

    const text = response.text || '';

    // Estimate confidence based on response quality indicators
    const confidence = this._estimateConfidence(text);

    return { text, confidence, metadata: { model: this.model, provider: 'gemini' } };
  }

  async generateText(prompt, options = {}) {
    const response = await this.client.models.generateContent({
      model: this.model,
      contents: prompt,
      config: {
        temperature: options.temperature ?? 0.3,
        maxOutputTokens: options.maxTokens ?? 2048,
      },
    });

    return {
      text: response.text || '',
      metadata: { model: this.model, provider: 'gemini' },
    };
  }

  async generateStructured(prompt, schema, options = {}) {
    const structuredPrompt = `${prompt}

IMPORTANT: Respond ONLY with valid JSON matching this schema. No markdown, no code fences, no explanation outside the JSON.

Expected JSON schema:
${JSON.stringify(schema, null, 2)}`;

    const response = await this.client.models.generateContent({
      model: this.model,
      contents: structuredPrompt,
      config: {
        temperature: options.temperature ?? 0.1,
        maxOutputTokens: options.maxTokens ?? 4096,
        responseMimeType: 'application/json',
      },
    });

    const raw = response.text || '';

    // Parse the JSON response
    let data;
    try {
      // Clean potential markdown fences
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      data = JSON.parse(cleaned);
    } catch {
      data = null;
    }

    return { data, raw };
  }

  /**
   * Estimate OCR confidence from the response text.
   * Heuristic: longer, structured text with ingredient-like patterns = higher confidence.
   */
  _estimateConfidence(text) {
    if (!text || text.length < 20) return 0.1;
    if (text.length < 50) return 0.3;

    let score = 0.5;

    // Contains ingredient-like patterns
    if (/ingredients?:/i.test(text)) score += 0.15;
    if (/,/.test(text) && text.split(',').length > 3) score += 0.1;
    if (/\b(water|aqua|sodium|acid|extract|oil|vitamin)\b/i.test(text)) score += 0.1;

    // Contains nutrition info
    if (/calories|protein|fat|carbohydrate|sodium|sugar/i.test(text)) score += 0.05;

    // Capped at 0.95 — we never claim 100% OCR confidence
    return Math.min(score, 0.95);
  }
}
