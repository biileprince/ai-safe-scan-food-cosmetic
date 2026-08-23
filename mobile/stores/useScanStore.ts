/**
 * SafeScan — useScanStore
 */

import { create } from 'zustand';
import { startScanSession } from '../services/scan.service';

interface ScanState {
  capturedImage: string | null;
  phase: 'idle' | 'capturing' | 'processing' | 'completed';
  setCapturedImage: (uri: string | null) => void;
  setPhase: (phase: 'idle' | 'capturing' | 'processing' | 'completed') => void;
  startScan: (userId: string, imageUri: string, fileName: string) => Promise<string>;
  reset: () => void;
}

export const useScanStore = create<ScanState>((set) => ({
  capturedImage: null,
  phase: 'idle',
  setCapturedImage: (uri) => set({ capturedImage: uri }),
  setPhase: (phase) => set({ phase }),
  startScan: async (userId: string, imageUri: string, fileName: string) => {
    set({ phase: 'processing', capturedImage: imageUri });
    try {
      const reportId = await startScanSession(userId, imageUri, fileName);
      return reportId;
    } catch (error) {
      set({ phase: 'idle' });
      throw error;
    }
  },
  reset: () => set({ capturedImage: null, phase: 'idle' }),
}));
