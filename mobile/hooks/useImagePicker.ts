/**
 * SafeScan — useImagePicker Hook
 * 
 * Manages selecting images from the device gallery.
 */

import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export function useImagePicker() {
  const [isPicking, setIsPicking] = useState(false);

  const pickImage = async () => {
    setIsPicking(true);
    try {
      // Request permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        throw new Error('Gallery permissions are required to pick images.');
      }

      // Launch picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true, // Allow cropping
        quality: 0.8, // Slightly compress immediately
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      throw error;
    } finally {
      setIsPicking(false);
    }
  };

  return {
    pickImage,
    isPicking,
  };
}
