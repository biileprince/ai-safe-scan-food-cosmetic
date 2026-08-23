/**
 * SafeScan — useCamera Hook
 * 
 * Manages camera permissions and state.
 */

import { useState, useEffect } from 'react';
import { useCameraPermissions } from 'expo-camera';

export function useCamera() {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (permission) {
      setHasPermission(permission.granted);
    }
  }, [permission]);

  const checkAndRequestPermission = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      return result.granted;
    }
    return true;
  };

  return {
    hasPermission,
    checkAndRequestPermission,
    isPending: permission === null,
  };
}
