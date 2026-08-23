/**
 * SafeScan — Root Layout
 * 
 * Global providers: fonts, theme, auth initialization.
 * Routes unauthenticated users to (auth) group, authenticated to (tabs).
 */

import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../stores/useAuthStore';
import { useProfileStore } from '../stores/useProfileStore';
import { Colors } from '../constants/theme';

export default function RootLayout() {
  const { user, isAuthenticated, isLoading, initialize } = useAuthStore();
  const { ensureProfile } = useProfileStore();
  const router = useRouter();
  const segments = useSegments();

  // Initialize auth on app launch
  useEffect(() => {
    initialize();
  }, []);

  // Route guard: redirect based on auth state
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated && user) {
      // Ensure profile exists, then redirect to main app
      ensureProfile(user.$id, user.name);
      if (inAuthGroup || segments.length === 0) {
        router.replace('/(tabs)/scan');
      }
    } else {
      // Not authenticated — redirect to welcome
      if (!inAuthGroup) {
        router.replace('/(auth)/welcome');
      }
    }
  }, [isAuthenticated, isLoading, segments]);

  // Show loading spinner while checking session
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent.primary} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Slot />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
