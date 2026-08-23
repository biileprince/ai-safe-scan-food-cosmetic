/**
 * SafeScan — Scan Service
 */

import { ID } from 'react-native-appwrite';
import { databases, functions } from './appwrite';
import { uploadImage } from './storage.service';

const DB_ID = 'safescan_db';
const REPORTS_COLLECTION = 'scan_reports';
const ASSESS_FUNCTION_ID = 'assess-product'; // Appwrite function ID

export interface ScanReport {
  $id: string;
  userId: string;
  imageFileId: string;
  status: 'processing' | 'completed' | 'failed' | 'needs_review';
  productName?: string;
  productCategory?: string;
  ocrConfidence?: number;
  matchConfidence?: number;
  overallAssessment?: string;
  benefits?: string;
  concerns?: string;
  allergenFlags?: string[];
  explanationText?: string;
  createdAt: string;
}

export interface ParsedBenefit {
  ingredient: string;
  description: string;
  evidenceLevel: string;
}

export interface ParsedConcern {
  ingredient: string;
  severity: string;
  description: string;
  source: string;
}

export const parseBenefits = (benefitsStr?: string): ParsedBenefit[] => {
  if (!benefitsStr) return [];
  try {
    return JSON.parse(benefitsStr);
  } catch {
    return [];
  }
};

export const parseConcerns = (concernsStr?: string): ParsedConcern[] => {
  if (!concernsStr) return [];
  try {
    return JSON.parse(concernsStr);
  } catch {
    return [];
  }
};

/**
 * Triggers a new scan workflow:
 * 1. Upload image to Storage
 * 2. Create initial report doc (processing)
 * 3. Trigger Appwrite Cloud Function
 */
export async function startScanSession(userId: string, imageUri: string, fileName: string): Promise<string> {
  try {
    // 1. Upload image
    const fileId = await uploadImage(imageUri, fileName);

    // 2. Create pending report document
    const reportId = ID.unique();
    await databases.createDocument(
      DB_ID,
      REPORTS_COLLECTION,
      reportId,
      {
        userId,
        imageFileId: fileId,
        status: 'processing',
        createdAt: new Date().toISOString(),
      }
    );

    // 3. Trigger analysis function asynchronously
    // We send an async execution request to Appwrite Functions
    // The mobile app will poll or use real-time to wait for completion
    try {
      await functions.createExecution(
        ASSESS_FUNCTION_ID,
        JSON.stringify({
          reportId,
          userId,
          fileId
        }),
        true // async = true
      );
    } catch (funcError) {
      console.error('Failed to trigger function:', funcError);
      // We don't fail the whole scan here, the UI will just show processing
      // and eventually timeout if the function doesn't complete.
    }

    return reportId;
  } catch (error) {
    console.error('Failed to start scan session:', error);
    throw error;
  }
}

export async function getReport(reportId: string): Promise<ScanReport> {
  try {
    const doc = await databases.getDocument(
      DB_ID,
      REPORTS_COLLECTION,
      reportId
    );
    return doc as unknown as ScanReport;
  } catch (error) {
    console.error('Failed to fetch report:', error);
    throw error;
  }
}

export async function getUserReports(userId: string): Promise<ScanReport[]> {
  try {
    const { Query } = require('react-native-appwrite');
    const response = await databases.listDocuments(
      DB_ID,
      REPORTS_COLLECTION,
      [
        Query.equal('userId', userId),
        Query.orderDesc('createdAt'),
      ]
    );
    return response.documents as unknown as ScanReport[];
  } catch (error) {
    console.error('Failed to fetch user reports:', error);
    throw error;
  }
}
