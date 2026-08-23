/**
 * SafeScan — Authentication Service
 * 
 * Handles email/password, Google OAuth, and Apple Sign-In via Appwrite Auth.
 * All auth state changes flow through useAuthStore.
 */

import { account, ID } from './appwrite';
import { OAuthProvider } from 'react-native-appwrite';

// ─── Types ──────────────────────────────────────────────────────

export interface AuthUser {
  $id: string;
  email: string;
  name: string;
  emailVerification: boolean;
}

// ─── Email/Password Auth ────────────────────────────────────────

/**
 * Register a new user with email and password.
 */
export async function register(email: string, password: string, name: string): Promise<AuthUser> {
  await account.create(ID.unique(), email, password, name);
  // Auto-login after registration
  await login(email, password);
  return getCurrentUser();
}

/**
 * Login with email and password.
 */
export async function login(email: string, password: string): Promise<void> {
  await account.createEmailPasswordSession(email, password);
}

/**
 * Get the currently logged-in user.
 * Throws if no session exists.
 */
export async function getCurrentUser(): Promise<AuthUser> {
  const user = await account.get();
  return {
    $id: user.$id,
    email: user.email,
    name: user.name,
    emailVerification: user.emailVerification,
  };
}

/**
 * Check if a session exists (user is logged in).
 */
export async function checkSession(): Promise<AuthUser | null> {
  try {
    return await getCurrentUser();
  } catch {
    return null;
  }
}

/**
 * Logout — delete current session.
 */
export async function logout(): Promise<void> {
  await account.deleteSession('current');
}

// ─── OAuth — Google ─────────────────────────────────────────────

/**
 * Initiate Google OAuth login.
 * Appwrite handles the redirect flow on mobile.
 */
export async function loginWithGoogle(): Promise<void> {
  await account.createOAuth2Session(
    OAuthProvider.Google,
    'safescan://auth/callback',    // Success redirect
    'safescan://auth/failure',     // Failure redirect
  );
}

// ─── OAuth — Apple ──────────────────────────────────────────────

/**
 * Initiate Apple Sign-In.
 * Appwrite handles the native Apple auth flow.
 */
export async function loginWithApple(): Promise<void> {
  await account.createOAuth2Session(
    OAuthProvider.Apple,
    'safescan://auth/callback',
    'safescan://auth/failure',
  );
}

// ─── Account Management ─────────────────────────────────────────

/**
 * Update user name.
 */
export async function updateName(name: string): Promise<void> {
  await account.updateName(name);
}

/**
 * Request email verification.
 */
export async function requestVerification(): Promise<void> {
  await account.createVerification('safescan://auth/verify');
}

/**
 * Delete the user account and all associated data.
 */
export async function deleteAccount(): Promise<void> {
  // Note: Appwrite cascades session deletion.
  // Report/image cleanup should be handled server-side via a function trigger.
  await account.updateStatus();
}
