import { getProvider } from '../providers/providerFactory.js';

/**
 * Determines the product category based on raw OCR text.
 * 
 * @param {string} rawText
 * @returns {Promise<string>} e.g., 'food', 'skincare', 'haircare'
 */
export async function classifyProduct(rawText) {
  const provider = getProvider();
  
  const prompt = `
    Based on the following text extracted from a product label, determine the product category.
    Output ONLY one of the following exact strings, and nothing else:
    food, beverage, skincare, haircare, makeup, soap, body_lotion, unknown

    Label text:
    ${rawText}
  `;

  try {
    const result = await provider.generateText(prompt);
    const category = result.trim().toLowerCase();
    
    const validCategories = ['food', 'beverage', 'skincare', 'haircare', 'makeup', 'soap', 'body_lotion'];
    return validCategories.includes(category) ? category : 'unknown';
  } catch (error) {
    console.error('Error in classifyProduct:', error);
    return 'unknown';
  }
}
