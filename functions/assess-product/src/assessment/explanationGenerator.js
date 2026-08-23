import { getProvider } from '../providers/providerFactory.js';

/**
 * Generates a plain-language explanation of the safety assessment.
 * 
 * @param {string} category - Product category
 * @param {string} assessmentTier - The overall assessment tier
 * @param {object} analysis - { benefits: [], concerns: [], allergenFlags: [] }
 * @returns {Promise<string>} - Consumer-friendly explanation text
 */
export async function generateExplanation(category, assessmentTier, analysis) {
  const provider = getProvider();
  
  const prompt = `
    You are a friendly, objective, and scientifically accurate product safety assistant.
    Generate a concise 2-3 sentence summary explaining the safety assessment of a ${category} product.
    
    Overall Assessment: ${assessmentTier} (Options: favorable, caution, concern, insufficient)
    
    Benefits Found: ${JSON.stringify(analysis.benefits.map(b => b.ingredient))}
    Concerns Found: ${JSON.stringify(analysis.concerns.map(c => c.ingredient + ' (' + c.severity + ')'))}
    Allergens Flagged: ${JSON.stringify(analysis.allergenFlags)}
    
    Guidelines:
    - If favorable: Reassure the user but remind them it's based on available data.
    - If caution: Highlight the moderate concerns mildly.
    - If concern: Clearly state what the high-risk ingredients or allergens are without being overly alarmist.
    - If insufficient: Explain that the label wasn't clear enough for a full assessment.
    - Keep it simple, accessible, and do not use markdown formatting. Just plain text.
  `;

  try {
    const explanation = await provider.generateText(prompt);
    return explanation.trim();
  } catch (error) {
    console.error('Error in generateExplanation:', error);
    
    // Fallback explanations if AI fails
    if (assessmentTier === 'favorable') return 'Based on the extracted ingredients, this product appears generally favorable with no major known concerns.';
    if (assessmentTier === 'caution') return 'This product contains some ingredients that may require monitoring or cause mild irritation.';
    if (assessmentTier === 'concern') return 'We identified ingredients of high concern or potential allergens in this product. Please review the details carefully.';
    return 'We could not reliably assess this product due to insufficient information.';
  }
}
