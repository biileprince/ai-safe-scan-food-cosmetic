/**
 * SafeScan — Storage Service
 * 
 * Handles image upload/download to Appwrite Storage.
 * Includes compression helpers for mobile optimization.
 */

import { storage, BUCKETS, ID } from './appwrite';

// ─── Types ──────────────────────────────────────────────────────

export interface UploadResult {
  fileId: string;
  fileName: string;
  sizeBytes: number;
}

// ─── Upload ─────────────────────────────────────────────────────

/**
 * Upload a product image to Appwrite Storage.
 * 
 * @param fileUri - Local file URI from camera/image picker
 * @param fileName - Original filename
 * @param mimeType - MIME type (e.g., 'image/jpeg')
 * @returns Upload result with the Appwrite file ID
 */
export async function uploadScanImage(
  fileUri: string,
  fileName: string,
  mimeType: string = 'image/jpeg'
): Promise<UploadResult> {
  // Create a file object compatible with Appwrite SDK
  const file = {
    uri: fileUri,
    name: fileName,
    type: mimeType,
  };

  const response = await storage.createFile(
    BUCKETS.SCAN_IMAGES,
    ID.unique(),
    file as any, // Appwrite RN SDK accepts this format
  );

  return {
    fileId: response.$id,
    fileName: response.name,
    sizeBytes: response.sizeOriginal,
  };
}

// ─── Download / Preview ─────────────────────────────────────────

/**
 * Get a preview URL for a stored image.
 * Useful for rendering thumbnails in scan history.
 */
export function getImagePreviewUrl(
  fileId: string,
  width: number = 400,
  height: number = 400,
): string {
  // Appwrite provides server-side image resizing
  return storage.getFilePreview(
    BUCKETS.SCAN_IMAGES,
    fileId,
    width,
    height,
  ).toString();
}

/**
 * Get the full download URL for an image.
 */
export function getImageDownloadUrl(fileId: string): string {
  return storage.getFileDownload(
    BUCKETS.SCAN_IMAGES,
    fileId,
  ).toString();
}

// ─── Delete ─────────────────────────────────────────────────────

/**
 * Delete a scan image from storage.
 */
export async function deleteScanImage(fileId: string): Promise<void> {
  await storage.deleteFile(BUCKETS.SCAN_IMAGES, fileId);
}
