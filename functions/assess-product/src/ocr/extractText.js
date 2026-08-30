import { getProvider } from '../providers/providerFactory.js';

export async function extractTextFromImage(imageBuffer, mimeType) {
  const provider = getProvider();
  
  const prompt = `
    You are an expert OCR and label reading AI.
    Please extract all the text from this product label exactly as written.
    Pay special attention to the ingredients list, warnings, nutritional facts, and product name.
    Do not summarize. Just output the raw text you see.
  `;

  try {
    const result = await provider.analyzeImage(imageBuffer, prompt);
    
    const rawText = typeof result === 'string' ? result : (result.text || '');
    const confidence = rawText && rawText.length > 20 ? 0.95 : 0.4;

    return {
      text: rawText,
      confidence
    };
  } catch (error) {
    // Re-throw with the actual error message so logs show what went wrong
    throw new Error('OCR failed: ' + (error.message || error));
  }
}