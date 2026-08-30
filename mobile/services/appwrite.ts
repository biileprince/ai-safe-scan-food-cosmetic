/**
 * SafeScan — Appwrite Client Singleton
 * 
 * Central configuration for the Appwrite React Native SDK.
 * All other services import from here.
 */

import 'react-native-url-polyfill/auto';
import { Client, Account, Databases, Storage, Functions, ID, Query } from 'react-native-appwrite';

// ─── Configuration ──────────────────────────────────────────────
// TODO: Replace with your actual Appwrite Project ID
const APPWRITE_CONFIG = {
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: '6a8b501c000c7f0210e6',
  platform: 'com.safescan.app',                // Must match app.json bundle/package ID
};

// ─── Database & Collection IDs ──────────────────────────────────
export const DB = {
  DATABASE_ID: 'safescan_db',
  COLLECTIONS: {
    USERS_PROFILES: 'users_profiles',
    INGREDIENTS: 'ingredients',
    SCAN_REPORTS: 'scan_reports',
    INGREDIENT_CORRECTIONS: 'ingredient_corrections',
  },
} as const;

// ─── Storage Bucket IDs ─────────────────────────────────────────
export const BUCKETS = {
  SCAN_IMAGES: 'scan_images',
} as const;

// ─── Function IDs ───────────────────────────────────────────────
export const FUNCTIONS = {
  ASSESS_PRODUCT: 'assess-product',
  USER_PROFILE: 'user-profile',
} as const;

// ─── Client Singleton ───────────────────────────────────────────
const client = new Client()
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId)
  .setPlatform(APPWRITE_CONFIG.platform);

// ─── Service Instances ──────────────────────────────────────────
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// ─── Re-exports ─────────────────────────────────────────────────
export { client, ID, Query };
export default client;

export const functions = new Functions(client);
