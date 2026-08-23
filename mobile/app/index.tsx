/**
 * SafeScan — Index redirect
 * Redirects to the appropriate screen based on auth state.
 */

import { Redirect } from 'expo-router';
import { useAuthStore } from '../stores/useAuthStore';

export default function Index() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/scan" />;
  }
  return <Redirect href="/(auth)/welcome" />;
}
