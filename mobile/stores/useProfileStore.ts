/**
 * SafeScan — Profile Store (Zustand)
 * 
 * Manages user dietary preferences, allergen selections, and jurisdiction.
 */

import { create } from 'zustand';
import * as profileService from '../services/profile.service';
import type { UserProfile } from '../services/profile.service';

// ─── Types ──────────────────────────────────────────────────────

interface ProfileState {
  // State
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadProfile: (userId: string) => Promise<void>;
  ensureProfile: (userId: string, displayName: string) => Promise<void>;
  updateAllergens: (allergens: string[]) => Promise<void>;
  updateDietaryPrefs: (prefs: string[]) => Promise<void>;
  updateJurisdiction: (jurisdiction: string) => Promise<void>;
  updateSensitiveIngredients: (ingredients: string[]) => Promise<void>;
  reset: () => void;
}

// ─── Store ──────────────────────────────────────────────────────

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  loadProfile: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profileService.getProfile(userId);
      set({ profile, isLoading: false });
    } catch (err: any) {
      set({ error: err?.message || 'Failed to load profile.', isLoading: false });
    }
  },

  ensureProfile: async (userId: string, displayName: string) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profileService.ensureProfile(userId, displayName);
      set({ profile, isLoading: false });
    } catch (err: any) {
      set({ error: err?.message || 'Failed to create profile.', isLoading: false });
    }
  },

  updateAllergens: async (allergens: string[]) => {
    const { profile } = get();
    if (!profile?.$id) return;
    try {
      const updated = await profileService.updateProfile(profile.$id, { allergens });
      set({ profile: updated });
    } catch (err: any) {
      set({ error: err?.message || 'Failed to update allergens.' });
    }
  },

  updateDietaryPrefs: async (prefs: string[]) => {
    const { profile } = get();
    if (!profile?.$id) return;
    try {
      const updated = await profileService.updateProfile(profile.$id, { dietaryPrefs: prefs });
      set({ profile: updated });
    } catch (err: any) {
      set({ error: err?.message || 'Failed to update dietary preferences.' });
    }
  },

  updateJurisdiction: async (jurisdiction: string) => {
    const { profile } = get();
    if (!profile?.$id) return;
    try {
      const updated = await profileService.updateProfile(profile.$id, { jurisdiction });
      set({ profile: updated });
    } catch (err: any) {
      set({ error: err?.message || 'Failed to update jurisdiction.' });
    }
  },

  updateSensitiveIngredients: async (ingredients: string[]) => {
    const { profile } = get();
    if (!profile?.$id) return;
    try {
      const updated = await profileService.updateProfile(profile.$id, { sensitiveIngredients: ingredients });
      set({ profile: updated });
    } catch (err: any) {
      set({ error: err?.message || 'Failed to update sensitive ingredients.' });
    }
  },

  reset: () => set({ profile: null, isLoading: false, error: null }),
}));
