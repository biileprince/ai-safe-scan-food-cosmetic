/**
 * Looks up normalized ingredients in the Appwrite 'ingredients' collection using raw fetch.
 * 
 * @param {Array<{canonical: string, raw: string, matchConfidence: number}>} ingredients
 * @param {string} jurisdiction - e.g., 'US', 'EU', 'NG'
 * @returns {Promise<Array<any>>} - Array of enriched ingredient objects with regulatory data
 */
export async function lookupIngredients(ingredients, jurisdiction = 'NG') {
  if (!ingredients || ingredients.length === 0) return [];
  
  const projectId = process.env.APPWRITE_FUNCTION_PROJECT_ID;
  const apiKey = process.env.APPWRITE_FUNCTION_API_KEY || process.env.APPWRITE_API_KEY;
  const endpoint = process.env.APPWRITE_FUNCTION_API_ENDPOINT || 'https://cloud.appwrite.io/v1';
  
  const DB_ID = 'safescan_db';
  const COLLECTION_ID = 'ingredients';
  
  const enrichedIngredients = [];

  for (const ing of ingredients) {
    try {
      // Query the database for the canonical name using raw fetch
      const queryParam = encodeURIComponent(`{"method":"equal","attribute":"canonicalName","values":["${ing.canonical}"]}`);
      const limitParam = encodeURIComponent(`{"method":"limit","values":[1]}`);
      
      const url = `${endpoint}/databases/${DB_ID}/collections/${COLLECTION_ID}/documents?queries[0]=${queryParam}&queries[1]=${limitParam}`;
      
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': projectId,
          'X-Appwrite-Key': apiKey
        }
      });
      
      let dbData = null;
      if (res.status === 200) {
        const result = await res.json();
        if (result.documents && result.documents.length > 0) {
          dbData = result.documents[0];
        }
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