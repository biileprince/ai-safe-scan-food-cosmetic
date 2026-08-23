import { getProvider } from '../providers/providerFactory.js';

/**
 * Extracts raw text from a product image using Vision AI.
 * 
 * @param {Buffer} imageBuffer - The image file buffer
 * @param {string} mimeType - e.g., 'image/jpeg'
 * @returns {Promise<{text: string, confidence: number}>}
 */
export async function extractTextFromImage(imageBuffer, mimeType) {
  const provider = getProvider();
  
  const prompt = `
    You are an expert OCR and label reading AI.
    Please extract all the text from this product label exactly as written.
    Pay special attention to the ingredients list, warnings, nutritional facts, and product name.
    Do not summarize. Just output the raw text you see.
  `;

  try {
    const rawText = await provider.analyzeImage(imageBuffer, mimeType, prompt);
    
    // In a real implementation, we could calculate confidence based on
    // known label structures or ask the LLM to score its own confidence.
    // For now, we assume a high baseline if it returns text.
    const confidence = rawText && rawText.length > 20 ? 0.95 : 0.4;

    return {
      text: rawText,
      confidence
    };
  } catch (error) {
    console.error('Error in extractTextFromImage:', error);
    throw new Error('Failed to extract text from image');
  }
}
