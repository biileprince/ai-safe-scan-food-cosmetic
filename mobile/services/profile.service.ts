/**
 * SafeScan — Profile Service
 * 
 * CRUD operations for user dietary/allergy preferences.
 * Maps to the `users_profiles` Appwrite collection.
 */

import { databases, DB, ID, Query } from './appwrite';

// ─── Types ──────────────────────────────────────────────────────

export interface UserProfile {
  $id?: string;
  userId: string;
  displayName: string;
  allergens: string[];
  dietaryPrefs: string[];
  jurisdiction: string;
  sensitiveIngredients: string[];
  createdAt?: string;
  updatedAt?: string;
}

const { DATABASE_ID, COLLECTIONS } = DB;

// ─── CRUD Operations ────────────────────────────────────────────

/**
 * Get the current user's profile.
 * Returns null if no profile exists yet.
 */
export async function getProfile(userId: string): Promise<UserProfile | null> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS_PROFILES,
      [Query.equal('userId', userId), Query.limit(1)]
    );
    if (response.documents.length === 0) return null;
    return response.documents[0] as unknown as UserProfile;
  } catch {
    return null;
  }
}

/**
 * Create a new user profile.
 */
export async function createProfile(profile: Omit<UserProfile, '$id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
  const now = new Date().toISOString();
  const doc = await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.USERS_PROFILES,
    ID.unique(),
    {
      ...profile,
      createdAt: now,
      updatedAt: now,
    }
  );
  return doc as unknown as UserProfile;
}

/**
 * Update an existing user profile.
 */
export async function updateProfile(
  documentId: string,
  updates: Partial<Pick<UserProfile, 'displayName' | 'allergens' | 'dietaryPrefs' | 'jurisdiction' | 'sensitiveIngredients'>>
): Promise<UserProfile> {
  const doc = await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.USERS_PROFILES,
    documentId,
    {
      ...updates,
      updatedAt: new Date().toISOString(),
    }
  );
  return doc as unknown as UserProfile;
}

/**
 * Delete the user's profile.
 */
export async function deleteProfile(documentId: string): Promise<void> {
  await databases.deleteDocument(
    DATABASE_ID,
    COLLECTIONS.USERS_PROFILES,
    documentId,
  );
}

// ─── Helpers ────────────────────────────────────────────────────

/**
 * Ensure a profile exists for the user — create a default one if not.
 */
export async function ensureProfile(userId: string, displayName: string): Promise<UserProfile> {
  const existing = await getProfile(userId);
  if (existing) return existing;

  return createProfile({
    userId,
    displayName,
    allergens: [],
    dietaryPrefs: [],
    jurisdiction: 'NG',          // Default to Nigeria for Africa-focused MVP
    sensitiveIngredients: [],
  });
}
