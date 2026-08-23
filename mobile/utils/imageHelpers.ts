/**
 * SafeScan — Image Helpers
 * 
 * Utilities for resizing, compressing, and validating images
 * before they are uploaded to Appwrite.
 */

import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export interface ImageQuality {
  uri: string;
  sizeMB: number;
  width: number;
  height: number;
  isBlurry?: boolean; // For future implementation
}

/**
 * Gets basic information about an image file
 */
export async function getImageInfo(uri: string): Promise<ImageQuality> {
  const fileInfo = await FileSystem.getInfoAsync(uri);
  
  if (!fileInfo.exists) {
    throw new Error('Image file does not exist');
  }

  // FileSystem.getInfoAsync doesn't always return size on some platforms,
  // but it usually does for local images.
  const sizeBytes = fileInfo.size || 0;
  const sizeMB = sizeBytes / (1024 * 1024);

  return {
    uri,
    sizeMB,
    // We would need Image.getSize to get actual dimensions, but for
    // this utility we mainly care about file size
    width: 0,
    height: 0,
  };
}

/**
 * Determines if an image needs compression
 * @param uri The image URI
 * @param maxMB The maximum allowed size in MB (default 3MB)
 * @returns True if the image is larger than maxMB
 */
export async function needsCompression(uri: string, maxMB: number = 3): Promise<boolean> {
  try {
    const info = await getImageInfo(uri);
    return info.sizeMB > maxMB;
  } catch (error) {
    console.error('Error checking image size:', error);
    return false;
  }
}

/**
 * Future hook for Expo Image Manipulator integration
 * Would compress large images before upload to save bandwidth
 */
export async function compressImage(uri: string): Promise<string> {
  // In a full implementation, we would use expo-image-manipulator:
  // import * as ImageManipulator from 'expo-image-manipulator';
  // const result = await ImageManipulator.manipulateAsync(
  //   uri,
  //   [{ resize: { width: 1200 } }], // Resize width, keep aspect ratio
  //   { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  // );
  // return result.uri;
  
  // For now, return the original URI
  return uri;
}
