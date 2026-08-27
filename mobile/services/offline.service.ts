/**
 * SafeScan — Offline Cache Service
 * 
 * Uses AsyncStorage to cache scan reports for offline viewing.
 * Also queues failed scan attempts for retry when connectivity returns.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ScanReport } from './scan.service';

const CACHE_PREFIX = '@safescan:';
const REPORT_CACHE_KEY = `${CACHE_PREFIX}cached_reports`;
const PENDING_SCANS_KEY = `${CACHE_PREFIX}pending_scans`;
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CachedData<T> {
  data: T;
  timestamp: number;
}

interface PendingScan {
  id: string;
  imageUri: string;
  fileName: string;
  userId: string;
  createdAt: string;
}

// ─── Report Cache ───────────────────────────────────────────────────

/**
 * Cache a single report locally.
 */
export async function cacheReport(report: ScanReport): Promise<void> {
  try {
    const existing = await getCachedReports();
    const filtered = existing.filter(r => r.$id !== report.$id);
    filtered.unshift(report); // newest first

    // Keep at most 50 cached reports
    const trimmed = filtered.slice(0, 50);

    const payload: CachedData<ScanReport[]> = {
      data: trimmed,
      timestamp: Date.now(),
    };

    await AsyncStorage.setItem(REPORT_CACHE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('[OfflineCache] Failed to cache report:', err);
  }
}

/**
 * Retrieve all cached reports. Returns empty array if expired or missing.
 */
export async function getCachedReports(): Promise<ScanReport[]> {
  try {
    const raw = await AsyncStorage.getItem(REPORT_CACHE_KEY);
    if (!raw) return [];

    const parsed: CachedData<ScanReport[]> = JSON.parse(raw);

    // Check TTL
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) {
      await AsyncStorage.removeItem(REPORT_CACHE_KEY);
      return [];
    }

    return parsed.data;
  } catch {
    return [];
  }
}

/**
 * Get a single cached report by ID.
 */
export async function getCachedReport(reportId: string): Promise<ScanReport | null> {
  const reports = await getCachedReports();
  return reports.find(r => r.$id === reportId) || null;
}

/**
 * Clear all cached reports.
 */
export async function clearReportCache(): Promise<void> {
  await AsyncStorage.removeItem(REPORT_CACHE_KEY);
}

// ─── Pending Scan Queue ─────────────────────────────────────────────

/**
 * Queue a scan that failed due to no connectivity, for retry later.
 */
export async function queuePendingScan(scan: PendingScan): Promise<void> {
  try {
    const existing = await getPendingScans();
    existing.push(scan);
    await AsyncStorage.setItem(PENDING_SCANS_KEY, JSON.stringify(existing));
  } catch (err) {
    console.warn('[OfflineCache] Failed to queue pending scan:', err);
  }
}

/**
 * Get all pending scans.
 */
export async function getPendingScans(): Promise<PendingScan[]> {
  try {
    const raw = await AsyncStorage.getItem(PENDING_SCANS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Remove a pending scan after successful upload.
 */
export async function removePendingScan(scanId: string): Promise<void> {
  try {
    const existing = await getPendingScans();
    const filtered = existing.filter(s => s.id !== scanId);
    await AsyncStorage.setItem(PENDING_SCANS_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('[OfflineCache] Failed to remove pending scan:', err);
  }
}

/**
 * Clear all pending scans.
 */
export async function clearPendingScans(): Promise<void> {
  await AsyncStorage.removeItem(PENDING_SCANS_KEY);
}
