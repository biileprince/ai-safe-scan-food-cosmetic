/**
 * SafeScan ?" useScanStore
 */

import { create } from 'zustand';
import { startScanSession, getUserReports, ScanReport } from '../services/scan.service';

interface ScanState {
  capturedImage: string | null;
  phase: 'idle' | 'capturing' | 'processing' | 'completed';
  history: ScanReport[];
  isHistoryLoading: boolean;
  
  setCapturedImage: (uri: string | null) => void;
  setPhase: (phase: 'idle' | 'capturing' | 'processing' | 'completed') => void;
  startScan: (userId: string, imageUri: string, fileName: string) => Promise<string>;
  fetchHistory: (userId: string) => Promise<void>;
  reset: () => void;
}

export const useScanStore = create<ScanState>((set) => ({
  capturedImage: null,
  phase: 'idle',
  history: [],
  isHistoryLoading: false,

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

  fetchHistory: async (userId: string) => {
    set({ isHistoryLoading: true });
    try {
      const reports = await getUserReports(userId);
      set({ history: reports, isHistoryLoading: false });
    } catch (error) {
      console.error('Store error fetching history:', error);
      set({ isHistoryLoading: false });
    }
  },

  reset: () => set({ capturedImage: null, phase: 'idle' }),
}));
