/**
 * SafeScan — Storage Service
 */

import { ID } from 'react-native-appwrite';
import { storage } from './appwrite';
import * as FileSystem from 'expo-file-system';

// Constants would ideally come from env/config
const BUCKET_ID = 'images_bucket'; // Replace with actual bucket ID later

export async function uploadImage(uri: string, fileName: string): Promise<string> {
  try {
    // Determine mime type from extension
    const extension = uri.split('.').pop()?.toLowerCase();
    let mimeType = 'image/jpeg';
    if (extension === 'png') mimeType = 'image/png';
    else if (extension === 'webp') mimeType = 'image/webp';

    // In React Native/Expo, we need to convert the file URI to a Blob or File object
    // Appwrite SDK for React Native expects a specific format
    const file = {
      name: fileName,
      type: mimeType,
      uri: uri,
    };

    const response = await storage.createFile(
      BUCKET_ID,
      ID.unique(),
      file as any
    );

    return response.$id;
  } catch (error) {
    console.error('Failed to upload image:', error);
    throw error;
  }
}

export function getImageUrl(fileId: string): string {
  // @ts-ignore - The SDK types might be wrong, getFilePreview returns a URL object.
  return storage.getFilePreview(BUCKET_ID, fileId).href || storage.getFilePreview(BUCKET_ID, fileId);
}
