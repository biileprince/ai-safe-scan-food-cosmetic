/**
 * Applies deterministic safety rules specific to food and beverage products.
 * 
 * @param {Array<any>} enrichedIngredients - Ingredients augmented with DB data
 * @param {object} userProfile - User preferences (allergens, dietary restrictions)
 * @returns {object} { benefits: [], concerns: [], allergenFlags: [] }
 */
export function applyFoodRules(enrichedIngredients, userProfile = {}) {
  const benefits = [];
  const concerns = [];
  const allergenFlags = [];
  
  const userAllergens = userProfile.allergens || [];
  const userDietary = userProfile.dietaryPrefs || [];

  for (const item of enrichedIngredients) {
    const { canonical, dbData } = item;
    
    // 1. Check Regulatory Status & Built-in Risk
    if (dbData.regulatoryStatus === 'prohibited' || dbData.riskLevel === 'high') {
      concerns.push({
        ingredient: canonical,
        severity: 'critical',
        description: dbData.riskDescription || `${canonical} is flagged as high concern or prohibited in this jurisdiction.`,
        source: 'Regulatory Database'
      });
    } else if (dbData.riskLevel === 'moderate') {
      concerns.push({
        ingredient: canonical,
        severity: 'moderate',
        description: dbData.riskDescription || `Consumption of ${canonical} should be monitored.`,
        source: 'Safety Assessment'
      });
    }

    // 2. Check for Benefits
    if (dbData.isBeneficial) {
      benefits.push({
        ingredient: canonical,
        description: dbData.benefitDescription || `Recognized positive properties for ${canonical}.`,
        evidenceLevel: 'established'
      });
    }

    // 3. Evaluate General Allergens
    if (dbData.isAllergen && dbData.allergenGroup) {
      // If it's a known allergen but the user hasn't explicitly set it, we still might want to flag it generally
      if (!allergenFlags.includes(dbData.allergenGroup)) {
        allergenFlags.push(dbData.allergenGroup);
      }
    }
    
    // 4. Evaluate User-Specific Allergens
    if (userAllergens.includes(dbData.allergenGroup) || userAllergens.includes(canonical)) {
      concerns.push({
        ingredient: canonical,
        severity: 'critical',
        description: `This product contains ${canonical} which matches your allergy profile!`,
        source: 'User Profile Match'
      });
      if (!allergenFlags.includes('USER_MATCH')) allergenFlags.push('USER_MATCH');
    }

    // 5. Evaluate Dietary Preferences
    // Example: User is vegan, ingredient is animal-derived
    if (userDietary.includes('vegan') && dbData.category === 'animal_derived') {
      concerns.push({
        ingredient: canonical,
        severity: 'high',
        description: `${canonical} is animal-derived and conflicts with your Vegan preference.`,
        source: 'User Profile Match'
      });
    }
  }

  return { benefits, concerns, allergenFlags };
}
