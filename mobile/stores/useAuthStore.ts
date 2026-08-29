/**
 * SafeScan — Auth Store (Zustand)
 * 
 * Manages authentication state across the app.
 * Persists session check on app launch.
 */

import { create } from 'zustand';
import type { AuthUser } from '../services/auth.service';
import * as authService from '../services/auth.service';

// ─── Types ──────────────────────────────────────────────────────

interface AuthState {
  // State
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// ─── Store ──────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  /**
   * Check for an existing session on app launch.
   */
  initialize: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.checkSession();
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  /**
   * Email/password login.
   */
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.login(email, password);
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({
        error: err?.message || 'Login failed. Please check your credentials.',
        isLoading: false,
      });
      throw err;
    }
  },

  /**
   * Register a new account.
   */
  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.register(email, password, name);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({
        error: err?.message || 'Registration failed. Please try again.',
        isLoading: false,
      });
      throw err;
    }
  },

  /**
   * Google OAuth.
   */
  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.loginWithGoogle();
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({
        error: err?.message || 'Google sign-in failed.',
        isLoading: false,
      });
    }
  },

  /**
   * Apple Sign-In.
   */
  loginWithApple: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.loginWithApple();
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({
        error: err?.message || 'Apple sign-in failed.',
        isLoading: false,
      });
    }
  },

  /**
   * Logout.
   */
  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } catch (err) {
      // Ignore network or missing session errors. We just want to clear local state.
      console.warn('Logout warning:', err);
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  },

  clearError: () => set({ error: null }),
}));
