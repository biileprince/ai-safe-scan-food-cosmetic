/**
 * SafeScan — Scan Store (Zustand)
 * 
 * State machine for the scan flow:
 * idle → capturing → uploading → processing → completed/failed
 */

import { create } from 'zustand';
import * as scanService from '../services/scan.service';
import type { ScanReport } from '../services/scan.service';

// ─── Types ──────────────────────────────────────────────────────

type ScanPhase = 'idle' | 'capturing' | 'previewing' | 'uploading' | 'processing' | 'completed' | 'failed';

interface ScanState {
  // State
  phase: ScanPhase;
  currentReportId: string | null;
  currentReport: ScanReport | null;
  capturedImageUri: string | null;
  error: string | null;
  progress: number;               // 0–100 for progress animation

  // Actions
  setCapturedImage: (uri: string) => void;
  clearCapturedImage: () => void;
  startScan: (userId: string, imageUri: string, fileName: string) => Promise<string>;
  pollReport: (reportId: string) => Promise<ScanReport>;
  setPhase: (phase: ScanPhase) => void;
  reset: () => void;
}

// ─── Store ──────────────────────────────────────────────────────

export const useScanStore = create<ScanState>((set, get) => ({
  phase: 'idle',
  currentReportId: null,
  currentReport: null,
  capturedImageUri: null,
  error: null,
  progress: 0,

  setCapturedImage: (uri: string) => {
    set({ capturedImageUri: uri, phase: 'previewing' });
  },

  clearCapturedImage: () => {
    set({ capturedImageUri: null, phase: 'idle' });
  },

  startScan: async (userId: string, imageUri: string, fileName: string) => {
    set({ phase: 'uploading', error: null, progress: 10 });

    try {
      // Upload + create report + trigger function
      set({ progress: 30 });
      const reportId = await scanService.startScan(userId, imageUri, fileName);
      set({ currentReportId: reportId, phase: 'processing', progress: 50 });
      return reportId;
    } catch (err: any) {
      set({
        phase: 'failed',
        error: err?.message || 'Failed to start scan.',
        progress: 0,
      });
      throw err;
    }
  },

  pollReport: async (reportId: string) => {
    try {
      const report = await scanService.getReport(reportId);

      if (report.status === 'completed' || report.status === 'needs_review') {
        set({ currentReport: report, phase: 'completed', progress: 100 });
      } else if (report.status === 'failed') {
        set({ phase: 'failed', error: 'Analysis failed. Please try again.', progress: 0 });
      } else {
        // Still processing — increment progress for visual feedback
        const currentProgress = get().progress;
        set({ progress: Math.min(currentProgress + 5, 90) });
      }

      return report;
    } catch (err: any) {
      set({
        phase: 'failed',
        error: err?.message || 'Failed to retrieve results.',
        progress: 0,
      });
      throw err;
    }
  },

  setPhase: (phase: ScanPhase) => set({ phase }),

  reset: () => set({
    phase: 'idle',
    currentReportId: null,
    currentReport: null,
    capturedImageUri: null,
    error: null,
    progress: 0,
  }),
}));
