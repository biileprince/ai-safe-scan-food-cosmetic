/**
 * Applies nutrition-specific threshold rules for food and beverage products.
 *
 * These rules flag high sodium, sugar, saturated fat, trans fat, etc.
 * based on standard daily value percentages (DV%).
 *
 * @param {object} nutritionData - Extracted nutrition information (if available)
 * @returns {object} { nutritionFlags: object, concerns: [] }
 */
export function applyNutritionRules(nutritionData) {
  const nutritionFlags = {};
  const concerns = [];

  if (!nutritionData) return { nutritionFlags, concerns };

  // Daily Value reference amounts (FDA guidelines)
  const DV = {
    sodium: 2300,       // mg
    sugar: 50,          // g (added sugars)
    saturatedFat: 20,   // g
    cholesterol: 300,   // mg
    fiber: 28,          // g (beneficial)
    protein: 50,        // g (beneficial)
  };

  // HIGH = more than 20% DV per serving is considered "high"
  const HIGH_THRESHOLD = 0.20;
  // LOW = less than 5% DV per serving is considered "low" (good for bad nutrients)
  const LOW_THRESHOLD = 0.05;

  // -- Sodium --
  if (nutritionData.sodiumMg != null) {
    const dvPercent = nutritionData.sodiumMg / DV.sodium;
    nutritionFlags.highSodium = dvPercent > HIGH_THRESHOLD;
    if (nutritionFlags.highSodium) {
      concerns.push({
        ingredient: 'Sodium',
        severity: dvPercent > 0.40 ? 'high' : 'moderate',
        description: `This product contains ${nutritionData.sodiumMg}mg of sodium (${Math.round(dvPercent * 100)}% DV per serving). High sodium intake is linked to elevated blood pressure.`,
        source: 'FDA Nutrition Guidelines'
      });
    }
  }

  // -- Added Sugars --
  if (nutritionData.addedSugarG != null) {
    const dvPercent = nutritionData.addedSugarG / DV.sugar;
    nutritionFlags.highSugar = dvPercent > HIGH_THRESHOLD;
    if (nutritionFlags.highSugar) {
      concerns.push({
        ingredient: 'Added Sugars',
        severity: dvPercent > 0.40 ? 'high' : 'moderate',
        description: `Contains ${nutritionData.addedSugarG}g of added sugars (${Math.round(dvPercent * 100)}% DV per serving). Excess sugar contributes to weight gain and metabolic issues.`,
        source: 'WHO Sugar Guidelines'
      });
    }
  }

  // -- Saturated Fat --
  if (nutritionData.saturatedFatG != null) {
    const dvPercent = nutritionData.saturatedFatG / DV.saturatedFat;
    nutritionFlags.highSatFat = dvPercent > HIGH_THRESHOLD;
    if (nutritionFlags.highSatFat) {
      concerns.push({
        ingredient: 'Saturated Fat',
        severity: 'moderate',
        description: `Contains ${nutritionData.saturatedFatG}g of saturated fat (${Math.round(dvPercent * 100)}% DV per serving). Excess saturated fat may increase cardiovascular risk.`,
        source: 'AHA Dietary Guidelines'
      });
    }
  }

  // -- Trans Fat --
  if (nutritionData.transFatG != null && nutritionData.transFatG > 0) {
    nutritionFlags.transFat = true;
    concerns.push({
      ingredient: 'Trans Fat',
      severity: 'high',
      description: `Contains ${nutritionData.transFatG}g of trans fat per serving. Artificial trans fats are strongly linked to heart disease and are banned in many jurisdictions.`,
      source: 'WHO / FDA Trans Fat Policy'
    });
  }

  // -- Fiber (beneficial) --
  if (nutritionData.fiberG != null) {
    const dvPercent = nutritionData.fiberG / DV.fiber;
    nutritionFlags.goodFiber = dvPercent > HIGH_THRESHOLD;
  }

  // -- Protein (beneficial) --
  if (nutritionData.proteinG != null) {
    const dvPercent = nutritionData.proteinG / DV.protein;
    nutritionFlags.goodProtein = dvPercent > HIGH_THRESHOLD;
  }

  return { nutritionFlags, concerns };
}
