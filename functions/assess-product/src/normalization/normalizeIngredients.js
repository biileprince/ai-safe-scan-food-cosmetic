import { getProvider } from '../providers/providerFactory.js';

/**
 * Normalizes raw extracted ingredients to their canonical names (e.g., INCI names for cosmetics).
 * 
 * @param {string[]} ingredients - The raw ingredients array
 * @param {string} category - Product category
 * @returns {Promise<Array<{raw: string, canonical: string, matchConfidence: number}>>}
 */
export async function normalizeIngredients(ingredients, category) {
  if (!ingredients || ingredients.length === 0) return [];

  const provider = getProvider();
  
  const prompt = `
    You are a scientific ingredient analyzer.
    I have a list of ingredients extracted from a ${category || 'product'} label.
    Map each raw ingredient to its standardized canonical scientific name (e.g., INCI name for cosmetics, standard FDA chemical name for food).
    
    Return ONLY a valid JSON array of objects with this exact structure:
    [
      {
        "raw": "the exact string from the input",
        "canonical": "the standardized scientific name",
        "matchConfidence": 0.0 to 1.0 (float representing how certain you are of this mapping)
      }
    ]

    Raw Ingredients:
    ${JSON.stringify(ingredients)}
  `;

  try {
    let result = await provider.generateText(prompt);
    
    if (result.includes('\`\`\`json')) {
      result = result.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    }
    
    return JSON.parse(result);
  } catch (error) {
    console.error('Error in normalizeIngredients:', error);
    // Fallback: return un-normalized mapping
    return ingredients.map(ing => ({
      raw: ing,
      canonical: ing.trim().toLowerCase(),
      matchConfidence: 0.5
    }));
  }
}
