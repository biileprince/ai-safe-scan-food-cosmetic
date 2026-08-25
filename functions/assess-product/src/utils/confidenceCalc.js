/**
 * SafeScan — Confidence Calculator
 * 
 * Utility functions for computing aggregate confidence scores.
 */

/**
 * Calculate the average match confidence from a set of normalized ingredients.
 * 
 * @param {Array<{matchConfidence: number}>} normalizedIngredients
 * @returns {number} Average confidence (0.0 – 1.0)
 */
export function calcAverageMatchConfidence(normalizedIngredients) {
  if (!normalizedIngredients || normalizedIngredients.length === 0) return 0;

  const sum = normalizedIngredients.reduce((acc, ing) => acc + (ing.matchConfidence || 0), 0);
  return sum / normalizedIngredients.length;
}

/**
 * Calculate an overall assessment confidence that factors in:
 * - OCR quality
 * - Ingredient match quality
 * - Database coverage (% of ingredients found in DB)
 * 
 * @param {number} ocrConfidence
 * @param {number} matchConfidence
 * @param {number} dbCoverage - ratio of ingredients found in DB (0-1)
 * @returns {number} Combined confidence (0.0 – 1.0)
 */
export function calcOverallConfidence(ocrConfidence, matchConfidence, dbCoverage) {
  // Weighted formula:
  // OCR quality is most critical (if we can't read the label, nothing else matters)
  // Match quality is second (are the parsed ingredients actually real?)
  // DB coverage is third (do we have safety data for them?)
  const weights = { ocr: 0.5, match: 0.3, db: 0.2 };

  return (
    (ocrConfidence || 0) * weights.ocr +
    (matchConfidence || 0) * weights.match +
    (dbCoverage || 0) * weights.db
  );
}
