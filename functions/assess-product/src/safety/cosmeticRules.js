/**
 * Applies deterministic safety rules specific to cosmetic and personal care products.
 * 
 * @param {Array<any>} enrichedIngredients - Ingredients augmented with DB data
 * @param {object} userProfile - User preferences
 * @returns {object} { benefits: [], concerns: [], allergenFlags: [] }
 */
export function applyCosmeticRules(enrichedIngredients, userProfile = {}) {
  const benefits = [];
  const concerns = [];
  const allergenFlags = [];
  
  const userAllergens = userProfile.allergens || [];

  for (const item of enrichedIngredients) {
    const { canonical, dbData } = item;
    
    // 1. Check Regulatory Status & Risk Level
    if (dbData.regulatoryStatus === 'prohibited' || dbData.riskLevel === 'high') {
      concerns.push({
        ingredient: canonical,
        severity: 'critical',
        description: dbData.riskDescription || `${canonical} is severely restricted or banned in cosmetics in this jurisdiction.`,
        source: 'Cosmetics Regulatory DB'
      });
    } else if (dbData.riskLevel === 'moderate') {
      concerns.push({
        ingredient: canonical,
        severity: 'moderate',
        description: dbData.riskDescription || `${canonical} is known to be a mild irritant or sensitizer for some users.`,
        source: 'Cosmetics Safety Assessment'
      });
    }

    // 2. Check for Benefits (e.g., Peptides, Hyaluronic Acid, Niacinamide)
    if (dbData.isBeneficial) {
      benefits.push({
        ingredient: canonical,
        description: dbData.benefitDescription || `Active ingredient known to provide cosmetic benefits.`,
        evidenceLevel: 'clinical'
      });
    }
    
    // 3. User Allergens / Sensitivities
    // Cosmetics often have specific sensitizers (e.g., fragrance mix, preservatives)
    if (userAllergens.includes(dbData.allergenGroup) || userAllergens.includes(canonical)) {
      concerns.push({
        ingredient: canonical,
        severity: 'critical',
        description: `Contains ${canonical} which matches your skin sensitivity/allergy profile.`,
        source: 'User Profile Match'
      });
      if (!allergenFlags.includes('USER_MATCH')) allergenFlags.push('USER_MATCH');
    }
    
    // 4. Fragrance & Essential Oils (Often flagged as potential sensitizers)
    if (dbData.category === 'fragrance' || dbData.category === 'essential_oil') {
       if (userProfile.sensitiveSkin) {
         concerns.push({
            ingredient: canonical,
            severity: 'moderate',
            description: `${canonical} is a known skin sensitizer and you indicated sensitive skin.`,
            source: 'Dermatological Guidance'
         });
       }
    }
  }

  return { benefits, concerns, allergenFlags };
}
