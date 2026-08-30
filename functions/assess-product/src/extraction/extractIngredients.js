import { getProvider } from '../providers/providerFactory.js';

/**
 * Parses raw text to extract an array of individual ingredients.
 * 
 * @param {string} rawText
 * @returns {Promise<{productName: string, ingredients: string[]}>}
 */
export async function extractIngredients(rawText) {
  const provider = getProvider();
  
  const prompt = `
    Extract the product name and the list of ingredients from the following label text.
    Return the result strictly as a valid JSON object matching this schema:
    {
      "productName": "string or null if not found",
      "ingredients": ["array of", "individual ingredient strings"]
    }
    
    Ensure that sub-ingredients (e.g., in parentheses) are handled appropriately 
    (either as part of the parent ingredient or flattened, whichever preserves meaning best).
    Do not include markdown blocks or any other text outside the JSON object.
    
    Label text:
    ${rawText}
  `;

  try {
    const response = await provider.generateText(prompt);
    let result = response.text;
    
    // Clean up potential markdown formatting from LLM response
    if (result.includes('\`\`\`json')) {
      result = result.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    }
    
    const parsed = JSON.parse(result);
    return {
      productName: parsed.productName || 'Unknown Product',
      ingredients: parsed.ingredients || []
    };
  } catch (error) {
    console.error('Error in extractIngredients:', error);
    return { productName: 'Unknown Product', ingredients: [] };
  }
}
