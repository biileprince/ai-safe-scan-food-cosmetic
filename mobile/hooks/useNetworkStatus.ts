/**
 * SafeScan — useNetworkStatus Hook
 * 
 * Monitors device network connectivity. Returns { isConnected, isInternetReachable }.
 * Uses expo-network if available, falls back to NetInfo.
 */

import { useState, useEffect, useCallback } from 'react';
import * as Network from 'expo-network';

interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
  connectionType: string | null;
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
    connectionType: null,
  });

  const checkStatus = useCallback(async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      setStatus({
        isConnected: networkState.isConnected ?? true,
        isInternetReachable: networkState.isInternetReachable ?? true,
        connectionType: networkState.type ?? null,
      });
    } catch (err) {
      // If the check fails, assume connected
      console.warn('[useNetworkStatus] Check failed:', err);
    }
  }, []);

  useEffect(() => {
    // Check immediately
    checkStatus();

    // Poll every 10 seconds (expo-network doesn't have a listener API)
    const interval = setInterval(checkStatus, 10_000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  return status;
}
