/**
 * SafeScan — Scan Service
 * 
 * Orchestrates the full scan flow:
 * 1. Upload image to Storage
 * 2. Create a scan_report document (status: processing)
 * 3. Execute the assess-product Appwrite Function
 * 4. Poll / subscribe for completion
 */

import { databases, functions, DB, FUNCTIONS, ID, Query } from './appwrite';
import { uploadScanImage, deleteScanImage } from './storage.service';

// ─── Types ──────────────────────────────────────────────────────

export type ScanStatus = 'processing' | 'completed' | 'failed' | 'needs_review';

export interface ScanReport {
  $id: string;
  userId: string;
  imageFileId: string;
  status: ScanStatus;
  productName: string | null;
  productCategory: string | null;
  rawOcrText: string | null;
  ocrConfidence: number | null;
  extractedIngredients: string[];
  normalizedIngredients: string | null;     // JSON string
  matchConfidence: number | null;
  overallAssessment: string | null;
  benefits: string | null;                  // JSON string
  concerns: string | null;                  // JSON string
  nutritionFlags: string | null;            // JSON string
  allergenFlags: string[];
  userSpecificWarnings: string | null;      // JSON string
  fullReport: string | null;                // JSON string
  explanationText: string | null;
  createdAt: string;
}

// Parsed versions of JSON fields
export interface ParsedBenefit {
  ingredient: string;
  description: string;
  evidenceLevel: string;
}

export interface ParsedConcern {
  ingredient: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  description: string;
  source: string;
}

const { DATABASE_ID, COLLECTIONS } = DB;

// ─── Core Scan Flow ─────────────────────────────────────────────

/**
 * Start a new product scan.
 * 
 * @param userId - Current user's ID
 * @param imageUri - Local file URI from camera/picker
 * @param fileName - Original filename
 * @returns The report document ID to track progress
 */
export async function startScan(
  userId: string,
  imageUri: string,
  fileName: string,
): Promise<string> {
  // Step 1: Upload image
  const upload = await uploadScanImage(imageUri, fileName);

  // Step 2: Create report document in "processing" state
  const report = await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.SCAN_REPORTS,
    ID.unique(),
    {
      userId,
      imageFileId: upload.fileId,
      status: 'processing',
      extractedIngredients: [],
      allergenFlags: [],
      createdAt: new Date().toISOString(),
    }
  );

  // Step 3: Trigger the Appwrite Function
  await functions.createExecution(
    FUNCTIONS.ASSESS_PRODUCT,
    JSON.stringify({
      reportId: report.$id,
      fileId: upload.fileId,
      userId,
    }),
    true, // async execution
  );

  return report.$id;
}

// ─── Report Retrieval ───────────────────────────────────────────

/**
 * Get a single scan report by ID.
 */
export async function getReport(reportId: string): Promise<ScanReport> {
  const doc = await databases.getDocument(
    DATABASE_ID,
    COLLECTIONS.SCAN_REPORTS,
    reportId,
  );
  return doc as unknown as ScanReport;
}

/**
 * Get all scan reports for a user, newest first.
 */
export async function getUserReports(
  userId: string,
  limit: number = 25,
  offset: number = 0,
): Promise<ScanReport[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.SCAN_REPORTS,
    [
      Query.equal('userId', userId),
      Query.orderDesc('createdAt'),
      Query.limit(limit),
      Query.offset(offset),
    ]
  );
  return response.documents as unknown as ScanReport[];
}

/**
 * Delete a scan report and its associated image.
 */
export async function deleteReport(reportId: string, imageFileId: string): Promise<void> {
  await Promise.all([
    databases.deleteDocument(DATABASE_ID, COLLECTIONS.SCAN_REPORTS, reportId),
    deleteScanImage(imageFileId),
  ]);
}

// ─── JSON Parsing Helpers ───────────────────────────────────────

export function parseBenefits(json: string | null): ParsedBenefit[] {
  if (!json) return [];
  try { return JSON.parse(json); } catch { return []; }
}

export function parseConcerns(json: string | null): ParsedConcern[] {
  if (!json) return [];
  try { return JSON.parse(json); } catch { return []; }
}

export function parseNutritionFlags(json: string | null): Record<string, boolean> {
  if (!json) return {};
  try { return JSON.parse(json); } catch { return {}; }
}
