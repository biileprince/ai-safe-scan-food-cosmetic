import { getAppwriteClient } from './utils/appwriteClient.js';
import { extractTextFromImage } from './ocr/extractText.js';
import { classifyProduct } from './classification/classifyProduct.js';
import { extractIngredients } from './extraction/extractIngredients.js';
import { normalizeIngredients } from './normalization/normalizeIngredients.js';
import { lookupIngredients } from './safety/lookupIngredients.js';
import { applyFoodRules } from './safety/foodRules.js';
import { applyCosmeticRules } from './safety/cosmeticRules.js';
import { calculateOverallAssessment } from './assessment/scoreEngine.js';
import { generateExplanation } from './assessment/explanationGenerator.js';

export default async ({ req, res, log, error }) => {
  log('Function started.');
  
  if (req.method !== 'POST') {
    return res.json({ success: false, error: 'Method not allowed' }, 405);
  }

  try {
    const payload = JSON.parse(req.body);
    const { reportId, userId, fileId } = payload;
    
    if (!reportId || !userId || !fileId) {
      return res.json({ success: false, error: 'Missing required parameters' }, 400);
    }
    
    log(`Processing reportId: ${reportId}, fileId: ${fileId}`);
    
    const { client, databases, storage } = getAppwriteClient();
    const DB_ID = 'safescan_db';
    const REPORTS_COLLECTION = 'scan_reports';
    const BUCKET_ID = 'images_bucket'; // Must match mobile side

    // 1. Fetch user profile for personalization
    let userProfile = {};
    try {
      const profileDocs = await databases.listDocuments(DB_ID, 'users_profiles', [
        require('node-appwrite').Query.equal('userId', userId)
      ]);
      if (profileDocs.documents.length > 0) {
        userProfile = profileDocs.documents[0];
      }
    } catch (err) {
      log('Could not fetch user profile, proceeding with default rules.');
    }

    // 2. Download image buffer
    const fileBuffer = await storage.getFileDownload(BUCKET_ID, fileId);
    
    // 3. OCR Extraction
    log('Extracting text from image...');
    const { text: rawOcrText, confidence: ocrConfidence } = await extractTextFromImage(fileBuffer, 'image/jpeg');
    
    // 4. Classification
    log('Classifying product...');
    const productCategory = await classifyProduct(rawOcrText);
    
    // 5. Ingredient Extraction
    log('Extracting ingredients...');
    const { productName, ingredients: rawIngredients } = await extractIngredients(rawOcrText);
    
    // 6. Normalization
    log('Normalizing ingredients...');
    const normalizedIngredients = await normalizeIngredients(rawIngredients, productCategory);
    
    // Calculate average match confidence
    const matchConfidence = normalizedIngredients.length > 0 
      ? normalizedIngredients.reduce((sum, ing) => sum + (ing.matchConfidence || 0), 0) / normalizedIngredients.length 
      : 0;

    // 7. Safety Database Lookup
    log('Looking up safety data...');
    const enrichedIngredients = await lookupIngredients(normalizedIngredients, userProfile.jurisdiction || 'NG');
    
    // 8. Apply Rules based on category
    log('Applying safety rules...');
    let analysis;
    if (productCategory === 'food' || productCategory === 'beverage') {
      analysis = applyFoodRules(enrichedIngredients, userProfile);
    } else {
      // Skincare, haircare, makeup, soap, body_lotion, unknown
      analysis = applyCosmeticRules(enrichedIngredients, userProfile);
    }
    
    // 9. Score Engine
    log('Calculating overall assessment...');
    const overallAssessment = calculateOverallAssessment(analysis, ocrConfidence);
    
    // 10. Generate Explanation
    log('Generating explanation...');
    const explanationText = await generateExplanation(productCategory, overallAssessment, analysis);
    
    // 11. Update Report in DB
    log('Updating report in database...');
    await databases.updateDocument(DB_ID, REPORTS_COLLECTION, reportId, {
      status: 'completed',
      productName,
      productCategory,
      rawOcrText,
      ocrConfidence,
      matchConfidence,
      overallAssessment,
      benefits: JSON.stringify(analysis.benefits),
      concerns: JSON.stringify(analysis.concerns),
      allergenFlags: analysis.allergenFlags,
      explanationText
    });
    
    log('Assessment complete!');
    return res.json({ success: true, reportId, assessment: overallAssessment });

  } catch (err) {
    error('Function failed: ' + err.message);
    
    // Try to update report status to failed
    try {
      const payload = JSON.parse(req.body);
      if (payload.reportId) {
        const { databases } = getAppwriteClient();
        await databases.updateDocument('safescan_db', 'scan_reports', payload.reportId, {
          status: 'failed',
          explanationText: 'An error occurred during analysis: ' + err.message
        });
      }
    } catch (updateErr) {
      error('Could not update report status to failed.');
    }

    return res.json({ success: false, error: err.message }, 500);
  }
};
