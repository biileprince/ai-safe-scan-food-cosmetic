/**
 * Aggregates findings and determines the final overall assessment.
 * 
 * @param {object} analysis - { benefits: [], concerns: [], allergenFlags: [] }
 * @param {number} extractionConfidence - e.g., 0.8
 * @returns {string} - The overall assessment tier
 */
export function calculateOverallAssessment(analysis, extractionConfidence) {
  const { concerns, allergenFlags } = analysis;

  // 1. Check for insufficient evidence
  // If the OCR confidence is very low, we cannot reliably assess the product
  if (extractionConfidence < 0.4) {
    return 'insufficient';
  }

  // 2. Check for critical concerns or allergens
  const hasCriticalConcerns = concerns.some(c => c.severity === 'critical' || c.severity === 'high');
  const hasAllergens = allergenFlags && allergenFlags.length > 0;
  
  if (hasCriticalConcerns || hasAllergens) {
    return 'concern';
  }

  // 3. Check for moderate concerns
  const hasModerateConcerns = concerns.some(c => c.severity === 'moderate');
  
  if (hasModerateConcerns) {
    return 'caution';
  }

  // 4. Default to generally favorable if no concerns are found
  // (Assuming extraction confidence is acceptable)
  return 'favorable';
}
