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
  
  // Debug: Log available environment variables (keys only, not values)
  log('ENV check: APPWRITE_FUNCTION_PROJECT_ID = ' + (process.env.APPWRITE_FUNCTION_PROJECT_ID ? 'SET' : 'MISSING'));
  log('ENV check: APPWRITE_FUNCTION_API_KEY = ' + (process.env.APPWRITE_FUNCTION_API_KEY ? 'SET' : 'MISSING'));
  log('ENV check: APPWRITE_API_KEY = ' + (process.env.APPWRITE_API_KEY ? 'SET' : 'MISSING'));
  log('ENV check: GEMINI_API_KEY = ' + (process.env.GEMINI_API_KEY ? 'SET' : 'MISSING'));
  log('ENV check: AI_API_KEY = ' + (process.env.AI_API_KEY ? 'SET' : 'MISSING'));
  
  if (req.method !== 'POST') {
    return res.json({ success: false, error: 'Method not allowed' }, 405);
  }

  // Build Appwrite client directly here so we can log issues
  const projectId = process.env.APPWRITE_FUNCTION_PROJECT_ID || process.env.APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_FUNCTION_API_KEY || process.env.APPWRITE_API_KEY;
  const endpoint = 'https://cloud.appwrite.io/v1';

  log(`Using endpoint: ${endpoint}`);
  log(`Using projectId: ${projectId}`);
  log(`API key present: ${!!apiKey}`);

  if (!projectId || !apiKey) {
    error('Missing projectId or apiKey!');
    return res.json({ success: false, error: 'Server misconfiguration: missing projectId or apiKey' }, 500);
  }

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
    
    log(`Processing reportId: ${reportId}, userId: ${userId}, fileId: ${fileId}`);
    
    const DB_ID = 'safescan_db';
    const REPORTS_COLLECTION = 'scan_reports';
    const BUCKET_ID = 'scan_images';

    // Step 1: Test database connectivity first
    log('Step 1: Testing database connectivity...');
    try {
      await databases.getDocument(DB_ID, REPORTS_COLLECTION, reportId);
      log('Step 1: Database connection OK!');
    } catch (dbErr) {
      error('Step 1 FAILED - Cannot reach database: ' + dbErr.message);
      return res.json({ success: false, error: 'Database connection failed: ' + dbErr.message }, 500);
    }

    // Step 2: Download image
    log('Step 2: Downloading image from storage...');
    let fileBuffer;
    try {
      fileBuffer = await storage.getFileDownload(BUCKET_ID, fileId);
      log('Step 2: Image downloaded OK! Size: ' + (fileBuffer ? fileBuffer.length || 'unknown' : 'null'));
    } catch (storageErr) {
      error('Step 2 FAILED - Cannot download image: ' + storageErr.message);
      await databases.updateDocument(DB_ID, REPORTS_COLLECTION, reportId, {
        status: 'failed',
        explanationText: 'Failed to download image: ' + storageErr.message
      });
      return res.json({ success: false, error: 'Storage download failed: ' + storageErr.message }, 500);
    }

    // Step 3: OCR
    log('Step 3: Extracting text from image (OCR)...');
    const { text: rawOcrText, confidence: ocrConfidence } = await extractTextFromImage(fileBuffer, 'image/jpeg');
    log('Step 3: OCR done. Text length: ' + (rawOcrText ? rawOcrText.length : 0));
    
    // Step 4: Classification
    log('Step 4: Classifying product...');
    const productCategory = await classifyProduct(rawOcrText);
    log('Step 4: Category = ' + productCategory);
    
    // Step 5: Ingredient Extraction
    log('Step 5: Extracting ingredients...');
    const { productName, ingredients: rawIngredients } = await extractIngredients(rawOcrText);
    log('Step 5: Product = ' + productName + ', Ingredients count = ' + (rawIngredients ? rawIngredients.length : 0));
    
    // Step 6: Normalization
    log('Step 6: Normalizing ingredients...');
    const normalizedIngredients = await normalizeIngredients(rawIngredients, productCategory);
    
    const matchConfidence = normalizedIngredients.length > 0 
      ? normalizedIngredients.reduce((sum, ing) => sum + (ing.matchConfidence || 0), 0) / normalizedIngredients.length 
      : 0;

    // Step 7: Safety Lookup
    log('Step 7: Looking up safety data...');
    const enrichedIngredients = await lookupIngredients(normalizedIngredients, 'NG');
    
    // Step 8: Apply Rules
    log('Step 8: Applying safety rules...');
    let analysis;
    if (productCategory === 'food' || productCategory === 'beverage') {
      analysis = applyFoodRules(enrichedIngredients, {});
    } else {
      analysis = applyCosmeticRules(enrichedIngredients, {});
    }
    
    // Step 9: Score
    log('Step 9: Calculating overall assessment...');
    const overallAssessment = calculateOverallAssessment(analysis, ocrConfidence);
    
    // Step 10: Explanation
    log('Step 10: Generating explanation...');
    const explanationText = await generateExplanation(productCategory, overallAssessment, analysis);
    
    // Step 11: Update Report
    log('Step 11: Updating report in database...');
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
    error('Function failed at: ' + err.message);
    error('Stack: ' + err.stack);
    
    try {
      const payload = JSON.parse(req.body);
      if (payload.reportId) {
        await databases.updateDocument('safescan_db', 'scan_reports', payload.reportId, {
          status: 'failed',
          explanationText: 'Analysis error: ' + err.message
        });
        log('Updated report status to failed.');
      }
    } catch (updateErr) {
      error('Could not update report status: ' + updateErr.message);
    }

    return res.json({ success: false, error: err.message }, 500);
  }
};