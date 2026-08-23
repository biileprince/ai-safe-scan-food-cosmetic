/**
 * SafeScan — Report Service
 * 
 * Higher-level service for report display, comparison, and sharing.
 * Built on top of scan.service.ts.
 */

import { databases, DB, ID, Query } from './appwrite';

const { DATABASE_ID, COLLECTIONS } = DB;

// ─── Ingredient Corrections ────────────────────────────────────

export interface IngredientCorrection {
  $id?: string;
  reportId: string;
  userId: string;
  originalIngredient: string;
  correctedIngredient: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

/**
 * Submit a correction for an incorrectly detected ingredient.
 */
export async function submitCorrection(
  reportId: string,
  userId: string,
  originalIngredient: string,
  correctedIngredient: string,
): Promise<IngredientCorrection> {
  const doc = await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.INGREDIENT_CORRECTIONS,
    ID.unique(),
    {
      reportId,
      userId,
      originalIngredient,
      correctedIngredient,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
  );
  return doc as unknown as IngredientCorrection;
}

/**
 * Get all corrections submitted by a user.
 */
export async function getUserCorrections(
  userId: string,
  limit: number = 50,
): Promise<IngredientCorrection[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.INGREDIENT_CORRECTIONS,
    [
      Query.equal('userId', userId),
      Query.orderDesc('createdAt'),
      Query.limit(limit),
    ]
  );
  return response.documents as unknown as IngredientCorrection[];
}
