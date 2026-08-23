import { getAppwriteClient } from '../utils/appwriteClient.js';
import { Query } from 'node-appwrite';

/**
 * Looks up normalized ingredients in the Appwrite 'ingredients' collection.
 * 
 * @param {Array<{canonical: string, raw: string, matchConfidence: number}>} ingredients
 * @param {string} jurisdiction - e.g., 'US', 'EU', 'NG'
 * @returns {Promise<Array<any>>} - Array of enriched ingredient objects with regulatory data
 */
export async function lookupIngredients(ingredients, jurisdiction = 'NG') {
  if (!ingredients || ingredients.length === 0) return [];
  
  const { databases } = getAppwriteClient();
  const DB_ID = 'safescan_db';
  const COLLECTION_ID = 'ingredients';
  
  const enrichedIngredients = [];

  for (const ing of ingredients) {
    try {
      // Query the database for the canonical name
      // In a robust implementation, we would also check synonyms using full-text search
      const result = await databases.listDocuments(DB_ID, COLLECTION_ID, [
        Query.equal('canonicalName', ing.canonical),
        Query.limit(1)
      ]);
      
      let dbData = null;
      if (result.documents.length > 0) {
        dbData = result.documents[0];
      }

      enrichedIngredients.push({
        raw: ing.raw,
        canonical: ing.canonical,
        matchConfidence: ing.matchConfidence,
        foundInDb: !!dbData,
        dbData: dbData || {
          // Default fallback for unknown ingredients
          riskLevel: 'unknown',
          regulatoryStatus: 'unknown',
          isBeneficial: false,
          isAllergen: false,
          category: 'unknown'
        }
      });
      
    } catch (error) {
      console.error(`Error looking up ingredient ${ing.canonical}:`, error);
      // Push fallback data on error so pipeline doesn't break
      enrichedIngredients.push({
        raw: ing.raw,
        canonical: ing.canonical,
        matchConfidence: ing.matchConfidence,
        foundInDb: false,
        dbData: {
          riskLevel: 'unknown',
          regulatoryStatus: 'unknown',
          isBeneficial: false,
          isAllergen: false,
          category: 'unknown'
        }
      });
    }
  }

  return enrichedIngredients;
}
