/**
 * SafeScan — App Entry
 * 
 * Redirects to the root layout.
 */

import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(auth)/welcome" />;
}
