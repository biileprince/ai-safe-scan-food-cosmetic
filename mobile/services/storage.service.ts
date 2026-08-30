/**
 * SafeScan ?" Storage Service
 */

import { ID } from 'react-native-appwrite';
import { storage } from './appwrite';
import { Platform } from 'react-native';

const BUCKET_ID = 'scan_images'; // Replace with actual bucket ID later

export async function uploadImage(uri: string, fileName: string): Promise<string> {
  try {
    const extension = uri.split('.').pop()?.toLowerCase();
    let mimeType = 'image/jpeg';
    if (extension === 'png') mimeType = 'image/png';
    else if (extension === 'webp') mimeType = 'image/webp';

    let fileToUpload: any;

    if (Platform.OS === 'web') {
      // On web, React Native Appwrite SDK fails if we pass { uri }
      // We must fetch the blob and construct a File object manually
      const response = await fetch(uri);
      const blob = await response.blob();
      fileToUpload = new File([blob], fileName, { type: mimeType });
    } else {
      // On mobile, the Appwrite SDK expects this exact object format
      fileToUpload = {
        name: fileName,
        type: mimeType,
        uri: uri,
      };
    }

    const response = await storage.createFile(
      BUCKET_ID,
      ID.unique(),
      fileToUpload
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
