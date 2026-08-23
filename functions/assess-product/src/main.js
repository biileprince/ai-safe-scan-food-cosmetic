/**
 * SafeScan — Assess Product Function (Entry Point)
 * 
 * Appwrite Function: receives an image, runs the full AI pipeline,
 * and writes results back to the scan_report document.
 * 
 * Pipeline: OCR → Classify → Extract → Normalize → Lookup → Rules → Score → Explain
 */

import { Client, Databases, Storage } from 'node-appwrite';
import { getAIProvider } from './providers/providerFactory.js';
import { extractText } from './ocr/extractText.js';
import { classifyProduct } from './classification/classifyProduct.js';
import { extractIngredients } from './extraction/extractIngredients.js';
import { normalizeIngredients } from './normalization/normalizeIngredients.js';
import { lookupIngredients } from './safety/lookupIngredients.js';
import { applyFoodRules } from './safety/foodRules.js';
import { applyCosmeticRules } from './safety/cosmeticRules.js';
import { calculateScore } from './assessment/scoreEngine.js';
import { generateExplanation } from './assessment/explanationGenerator.js';

// ─── Constants ──────────────────────────────────────────────────
const DATABASE_ID = 'safescan_db';
const REPORTS_COLLECTION = 'scan_reports';
const IMAGES_BUCKET = 'scan_images';

// ─── Main Handler ───────────────────────────────────────────────
export default async ({ req, res, log, error }) => {
  try {
    // 1. Parse input
    const { reportId, fileId, userId } = JSON.parse(req.body || '{}');
    if (!reportId || !fileId) {
      return res.json({ error: 'Missing reportId or fileId' }, 400);
    }

    log(`Starting assessment for report: ${reportId}`);

    // 2. Initialize Appwrite client (server-side)
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(req.headers['x-appwrite-key']);

    const databases = new Databases(client);
    const storage = new Storage(client);

    // 3. Initialize AI provider (multi-provider abstraction)
    const ai = getAIProvider();

    // 4. Download the image from Storage
    const imageBuffer = await storage.getFileDownload(IMAGES_BUCKET, fileId);
    log('Image downloaded from storage');

    // 5. OCR — Extract text from image
    const ocrResult = await extractText(ai, imageBuffer);
    log(`OCR complete. Confidence: ${ocrResult.confidence}`);

    // Check if OCR quality is sufficient
    if (ocrResult.confidence < 0.3) {
      await databases.updateDocument(DATABASE_ID, REPORTS_COLLECTION, reportId, {
        status: 'needs_review',
        rawOcrText: ocrResult.rawText,
        ocrConfidence: ocrResult.confidence,
        overallAssessment: 'insufficient_evidence',
        explanationText: 'The image quality was too low to extract a reliable ingredient list. Please retake the photo with better lighting and a clearer view of the label.',
      });
      return res.json({ status: 'needs_review', reportId });
    }

    // 6. Classify product
    const classification = await classifyProduct(ai, ocrResult.rawText);
    log(`Product classified as: ${classification.category}`);

    // 7. Extract ingredients
    const ingredients = await extractIngredients(ai, ocrResult.rawText);
    log(`Extracted ${ingredients.length} ingredients`);

    // 8. Normalize ingredients
    const normalized = await normalizeIngredients(ai, ingredients, databases);
    log(`Normalized ${normalized.length} ingredients`);

    // 9. Lookup ingredients in safety database
    const lookupResults = await lookupIngredients(databases, normalized);
    log(`Looked up ${lookupResults.length} ingredients in safety DB`);

    // 10. Apply safety rules based on product type
    let safetyFindings;
    if (classification.ruleEngine === 'food') {
      safetyFindings = applyFoodRules(lookupResults, ocrResult);
    } else {
      safetyFindings = applyCosmeticRules(lookupResults, classification);
    }

    // 11. Score and assess
    const assessment = calculateScore(safetyFindings);
    log(`Overall assessment: ${assessment.overallAssessment}`);

    // 12. Generate plain-language explanation
    const explanation = await generateExplanation(ai, {
      productName: classification.productName,
      category: classification.category,
      assessment,
      safetyFindings,
    });

    // 13. Write results back to Appwrite
    await databases.updateDocument(DATABASE_ID, REPORTS_COLLECTION, reportId, {
      status: 'completed',
      productName: classification.productName,
      productCategory: classification.category,
      rawOcrText: ocrResult.rawText,
      ocrConfidence: ocrResult.confidence,
      extractedIngredients: ingredients,
      normalizedIngredients: JSON.stringify(normalized),
      matchConfidence: assessment.matchConfidence,
      overallAssessment: assessment.overallAssessment,
      benefits: JSON.stringify(assessment.benefits),
      concerns: JSON.stringify(assessment.concerns),
      nutritionFlags: JSON.stringify(assessment.nutritionFlags || {}),
      allergenFlags: assessment.allergenFlags || [],
      fullReport: JSON.stringify(assessment),
      explanationText: explanation,
    });

    log(`Report ${reportId} completed successfully`);
    return res.json({ status: 'completed', reportId });

  } catch (err) {
    error(`Assessment failed: ${err.message}`);

    // Try to mark the report as failed
    try {
      const { reportId } = JSON.parse(req.body || '{}');
      if (reportId) {
        const client = new Client()
          .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
          .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
          .setKey(req.headers['x-appwrite-key']);

        const databases = new Databases(client);
        await databases.updateDocument(DATABASE_ID, REPORTS_COLLECTION, reportId, {
          status: 'failed',
          explanationText: 'An error occurred during analysis. Please try again.',
        });
      }
    } catch {
      // Ignore cleanup errors
    }

    return res.json({ error: err.message }, 500);
  }
};
