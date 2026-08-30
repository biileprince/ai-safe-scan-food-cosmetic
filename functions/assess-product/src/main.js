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
  
  if (req.method !== 'POST') {
    return res.json({ success: false, error: 'Method not allowed' }, 405);
  }

  const projectId = process.env.APPWRITE_FUNCTION_PROJECT_ID;
  const apiKey = process.env.APPWRITE_FUNCTION_API_KEY || process.env.APPWRITE_API_KEY;
  const endpoint = process.env.APPWRITE_FUNCTION_API_ENDPOINT || 'https://cloud.appwrite.io/v1';

  log('Endpoint: ' + endpoint);
  log('ProjectId: ' + projectId);
  log('API key: ' + (apiKey ? apiKey.substring(0, 8) + '...' : 'MISSING'));

  try {
    const payload = JSON.parse(req.body);
    const { reportId, userId, fileId } = payload;
    
    if (!reportId || !userId || !fileId) {
      return res.json({ success: false, error: 'Missing required parameters' }, 400);
    }
    
    log('reportId: ' + reportId + ', fileId: ' + fileId);
    
    const DB_ID = 'safescan_db';
    const REPORTS_COLLECTION = 'scan_reports';
    const BUCKET_ID = 'scan_images';

    // TEST: Raw fetch to database to check if API key works
    log('TEST: Raw fetch to database...');
    const rawDbUrl = endpoint + '/databases/' + DB_ID + '/collections/' + REPORTS_COLLECTION + '/documents/' + reportId;
    log('URL: ' + rawDbUrl);
    
    const rawDbRes = await fetch(rawDbUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': projectId,
        'X-Appwrite-Key': apiKey
      }
    });
    const rawDbBody = await rawDbRes.text();
    log('Raw DB response status: ' + rawDbRes.status);
    log('Raw DB response body: ' + rawDbBody.substring(0, 300));

    if (rawDbRes.status !== 200) {
      error('Raw DB fetch failed with status ' + rawDbRes.status);
      return res.json({ success: false, error: 'DB access failed: ' + rawDbBody.substring(0, 200) }, 500);
    }

    // If raw fetch works, try the SDK
    log('Raw fetch worked! Now trying SDK...');
    const client = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey);
      
    const databases = new Databases(client);
    const storage = new Storage(client);

    // Step 1: DB test via SDK
    log('Step 1: SDK database test...');
    try {
      const doc = await databases.getDocument(DB_ID, REPORTS_COLLECTION, reportId);
      log('Step 1: SDK OK! Doc status: ' + doc.status);
    } catch (sdkErr) {
      error('Step 1: SDK failed: ' + sdkErr.message);
      error('SDK error type: ' + sdkErr.constructor.name);
      error('SDK error code: ' + sdkErr.code);
      
      // Fall back to raw fetch for everything
      log('Falling back to raw fetch mode...');
    }

    // Step 2: Download image
    log('Step 2: Downloading image...');
    const imgUrl = endpoint + '/storage/buckets/' + BUCKET_ID + '/files/' + fileId + '/download';
    const imgRes = await fetch(imgUrl, {
      headers: {
        'X-Appwrite-Project': projectId,
        'X-Appwrite-Key': apiKey
      }
    });
    
    if (imgRes.status !== 200) {
      const imgErrBody = await imgRes.text();
      error('Image download failed: ' + imgRes.status + ' ' + imgErrBody.substring(0, 200));
      return res.json({ success: false, error: 'Image download failed' }, 500);
    }
    
    const arrayBuffer = await imgRes.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    log('Step 2: OK! Image size: ' + fileBuffer.length + ' bytes');

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
    
    // Step 11: Save - use raw fetch since SDK might not work
    log('Step 11: Saving to database...');
    const updateUrl = endpoint + '/databases/' + DB_ID + '/collections/' + REPORTS_COLLECTION + '/documents/' + reportId;
    const updateRes = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': projectId,
        'X-Appwrite-Key': apiKey
      },
      body: JSON.stringify({
        data: {
          status: 'completed',
          productName,
          productCategory,
          ocrConfidence,
          matchConfidence,
          overallAssessment,
          benefits: JSON.stringify(analysis.benefits),
          concerns: JSON.stringify(analysis.concerns),
          allergenFlags: analysis.allergenFlags,
          explanationText
        }
      })
    });
    
    if (updateRes.status === 200) {
      log('Step 11: OK! Report saved.');
    } else {
      const updateBody = await updateRes.text();
      error('Step 11: Save failed: ' + updateRes.status + ' ' + updateBody.substring(0, 200));
    }
    
    log('Done!');
    return res.json({ success: true, reportId, assessment: overallAssessment });

  } catch (err) {
    error('Failed: ' + err.message);
    error('Stack: ' + err.stack);

    try {
      const payload = JSON.parse(req.body);
      if (payload.reportId) {
        const updateUrl = endpoint + '/databases/safescan_db/collections/scan_reports/documents/' + payload.reportId;
        await fetch(updateUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': projectId,
            'X-Appwrite-Key': apiKey
          },
          body: JSON.stringify({ data: { status: 'failed', explanationText: 'Error: ' + err.message } })
        });
      }
    } catch (ue) {
      error('Could not update status: ' + ue.message);
    }

    return res.json({ success: false, error: err.message }, 500);
  }
};