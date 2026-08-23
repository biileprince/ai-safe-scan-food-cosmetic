/**
 * SafeScan — Welcome Screen
 * 
 * Onboarding screen with real vector icons, branding, and auth options.
 */

import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useAuthStore } from '../../stores/useAuthStore';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { loginWithGoogle, loginWithApple, isLoading } = useAuthStore();

  return (
    <View style={styles.container}>
      {/* Background gradient orbs */}
      <View style={styles.orbContainer}>
        <View style={[styles.orb, styles.orbPurple]} />
        <View style={[styles.orb, styles.orbTeal]} />
        <View style={[styles.orb, styles.orbIndigo]} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Logo & Brand */}
        <View style={styles.brandSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="shield-checkmark" size={40} color={Colors.accent.primaryLight} />
          </View>
          <Text style={styles.appName}>SafeScan</Text>
          <Text style={styles.tagline}>AI-Powered Product Safety Intelligence</Text>
        </View>

        {/* Value Props */}
        <View style={styles.valueProps}>
          <View style={styles.valueProp}>
            <View style={styles.valuePropIconWrap}>
              <Ionicons name="camera-outline" size={22} color={Colors.accent.tealLight} />
            </View>
            <Text style={styles.valuePropText}>Photograph any food or cosmetic product</Text>
          </View>
          <View style={styles.valueProp}>
            <View style={styles.valuePropIconWrap}>
              <MaterialCommunityIcons name="flask-outline" size={22} color={Colors.accent.secondaryLight} />
            </View>
            <Text style={styles.valuePropText}>AI analyzes every ingredient for safety</Text>
          </View>
          <View style={styles.valueProp}>
            <View style={styles.valuePropIconWrap}>
              <Ionicons name="checkmark-circle-outline" size={22} color={Colors.status.favorable} />
            </View>
            <Text style={styles.valuePropText}>Get a clear, evidence-based assessment</Text>
          </View>
        </View>

        {/* Auth Buttons */}
        <View style={styles.authSection}>
          <Pressable
            style={({ pressed }) => [styles.button, styles.buttonPrimary, pressed && styles.buttonPressed]}
            onPress={() => router.push('/(auth)/register')}
            disabled={isLoading}
          >
            <Ionicons name="arrow-forward" size={20} color={Colors.white} />
            <Text style={styles.buttonPrimaryText}>Get Started</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.button, styles.buttonGoogle, pressed && styles.buttonPressed]}
            onPress={loginWithGoogle}
            disabled={isLoading}
          >
            <Ionicons name="logo-google" size={20} color="#4285F4" />
            <Text style={styles.buttonSecondaryText}>Continue with Google</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.button, styles.buttonApple, pressed && styles.buttonPressed]}
            onPress={loginWithApple}
            disabled={isLoading}
          >
            <Ionicons name="logo-apple" size={20} color={Colors.white} />
            <Text style={styles.buttonSecondaryText}>Continue with Apple</Text>
          </Pressable>

          <Pressable
            style={styles.loginLink}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginLinkAccent}>Sign in</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  orbContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.15,
  },
  orbPurple: {
    width: 300,
    height: 300,
    backgroundColor: '#8B5CF6',
    top: -80,
    right: -60,
  },
  orbTeal: {
    width: 250,
    height: 250,
    backgroundColor: '#14B8A6',
    bottom: 100,
    left: -80,
  },
  orbIndigo: {
    width: 200,
    height: 200,
    backgroundColor: '#6366F1',
    top: '40%',
    right: -40,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 40,
  },
  brandSection: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius['2xl'],
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  appName: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: '700',
    color: Colors.text.primary,
    letterSpacing: Typography.letterSpacing.tight,
  },
  tagline: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  valueProps: {
    gap: Spacing.lg,
    paddingHorizontal: Spacing.base,
  },
  valueProp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
  },
  valuePropIconWrap: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.glass.backgroundHover,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valuePropText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  authSection: {
    gap: Spacing.md,
  },
  button: {
    height: 54,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonPrimary: {
    backgroundColor: Colors.accent.primary,
    ...Shadows.md,
  },
  buttonPrimaryText: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    color: Colors.white,
  },
  buttonGoogle: {
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.borderLight,
  },
  buttonApple: {
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.borderLight,
  },
  buttonSecondaryText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  loginLinkText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  loginLinkAccent: {
    color: Colors.accent.primaryLight,
    fontWeight: '600',
  },
});
