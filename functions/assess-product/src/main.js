import { Client, Databases, Storage, Query } from 'node-appwrite';
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
  
  // Log ALL Appwrite env vars
  const envKeys = Object.keys(process.env).filter(k => k.startsWith('APPWRITE'));
  log('All APPWRITE_* env vars: ' + JSON.stringify(envKeys));
  
  log('ENV: APPWRITE_FUNCTION_API_KEY = ' + (process.env.APPWRITE_FUNCTION_API_KEY ? 'SET' : 'MISSING'));
  log('ENV: APPWRITE_API_KEY = ' + (process.env.APPWRITE_API_KEY ? 'SET' : 'MISSING'));
  log('ENV: GEMINI_API_KEY = ' + (process.env.GEMINI_API_KEY ? 'SET' : 'MISSING'));
  
  if (req.method !== 'POST') {
    return res.json({ success: false, error: 'Method not allowed' }, 405);
  }

  const projectId = process.env.APPWRITE_FUNCTION_PROJECT_ID || process.env.APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_FUNCTION_API_KEY || process.env.APPWRITE_API_KEY;
  const endpoint = process.env.APPWRITE_FUNCTION_API_ENDPOINT || 'https://cloud.appwrite.io/v1';

  // RAW FETCH TEST: Check if we can even reach the Appwrite API
  log('RAW FETCH TEST: Trying to reach ' + endpoint + '/health...');
  try {
    const healthRes = await fetch(endpoint + '/health', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    log('RAW FETCH TEST: Status = ' + healthRes.status + ' OK!');
  } catch (fetchErr) {
    error('RAW FETCH TEST FAILED: ' + fetchErr.message);
    error('This means the function container CANNOT reach cloud.appwrite.io');
    
    // Try internal endpoint as fallback
    const internalEndpoint = 'http://appwrite/v1';
    log('Trying internal endpoint: ' + internalEndpoint + '/health...');
    try {
      const intRes = await fetch(internalEndpoint + '/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      log('INTERNAL ENDPOINT WORKS! Status = ' + intRes.status);
      // If this works, we should use this endpoint instead
    } catch (intErr) {
      error('Internal endpoint also failed: ' + intErr.message);
    }
    
    return res.json({ success: false, error: 'Network: cannot reach Appwrite API from function container' }, 500);
  }

  log('Using projectId: ' + projectId);

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);
    
  const databases = new Databases(client);
  const storage = new Storage(client);

  try {
    const payload = JSON.parse(req.body);
    const { reportId, userId, fileId } = payload;
    
    if (!reportId || !userId || !fileId) {
      return res.json({ success: false, error: 'Missing required parameters' }, 400);
    }
    
    log('Processing reportId: ' + reportId + ', fileId: ' + fileId);
    
    const DB_ID = 'safescan_db';
    const REPORTS_COLLECTION = 'scan_reports';
    const BUCKET_ID = 'scan_images';

    // Step 1: Test DB
    log('Step 1: Testing database...');
    await databases.getDocument(DB_ID, REPORTS_COLLECTION, reportId);
    log('Step 1: OK');

    // Step 2: Download image
    log('Step 2: Downloading image...');
    const fileBuffer = await storage.getFileDownload(BUCKET_ID, fileId);
    log('Step 2: OK');

    // Step 3: OCR
    log('Step 3: OCR...');
    const { text: rawOcrText, confidence: ocrConfidence } = await extractTextFromImage(fileBuffer, 'image/jpeg');
    log('Step 3: OK, text length = ' + (rawOcrText ? rawOcrText.length : 0));
    
    // Step 4: Classification
    log('Step 4: Classifying...');
    const productCategory = await classifyProduct(rawOcrText);
    log('Step 4: ' + productCategory);
    
    // Step 5: Extraction
    log('Step 5: Extracting ingredients...');
    const { productName, ingredients: rawIngredients } = await extractIngredients(rawOcrText);
    log('Step 5: ' + productName);
    
    // Step 6: Normalization
    log('Step 6: Normalizing...');
    const normalizedIngredients = await normalizeIngredients(rawIngredients, productCategory);
    
    const matchConfidence = normalizedIngredients.length > 0 
      ? normalizedIngredients.reduce((sum, ing) => sum + (ing.matchConfidence || 0), 0) / normalizedIngredients.length 
      : 0;

    // Step 7: Safety
    log('Step 7: Safety lookup...');
    const enrichedIngredients = await lookupIngredients(normalizedIngredients, 'NG');
    
    // Step 8: Rules
    log('Step 8: Applying rules...');
    let analysis;
    if (productCategory === 'food' || productCategory === 'beverage') {
      analysis = applyFoodRules(enrichedIngredients, {});
    } else {
      analysis = applyCosmeticRules(enrichedIngredients, {});
    }
    
    // Step 9: Score
    log('Step 9: Scoring...');
    const overallAssessment = calculateOverallAssessment(analysis, ocrConfidence);
    
    // Step 10: Explanation
    log('Step 10: Generating explanation...');
    const explanationText = await generateExplanation(productCategory, overallAssessment, analysis);
    
    // Step 11: Save
    log('Step 11: Saving to database...');
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
    
    log('Done!');
    return res.json({ success: true, reportId, assessment: overallAssessment });

  } catch (err) {
    error('Failed: ' + err.message);
    error('Stack: ' + err.stack);
    
    try {
      const payload = JSON.parse(req.body);
      if (payload.reportId) {
        await databases.updateDocument('safescan_db', 'scan_reports', payload.reportId, {
          status: 'failed',
          explanationText: 'Error: ' + err.message
        });
      }
    } catch (updateErr) {
      error('Could not update status: ' + updateErr.message);
    }

    return res.json({ success: false, error: err.message }, 500);
  }
};