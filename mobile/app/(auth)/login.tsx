/**
 * SafeScan — Login Screen (with real icons)
 */

import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useAuthStore } from '../../stores/useAuthStore';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loginWithGoogle, loginWithApple, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    try {
      await login(email.trim(), password);
    } catch {
      // Error handled in store
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={Colors.text.primary} />
          </Pressable>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to access your scan history</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {error && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={Colors.status.concernLight} />
              <Text style={styles.errorText}>{error}</Text>
              <Pressable onPress={clearError}>
                <Ionicons name="close" size={18} color={Colors.status.concernLight} />
              </Pressable>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={18} color={Colors.text.tertiary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={Colors.text.tertiary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.text.tertiary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={Colors.text.tertiary}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.text.tertiary} />
              </Pressable>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [styles.button, styles.buttonPrimary, pressed && styles.buttonPressed]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Ionicons name="sync" size={20} color={Colors.white} />
            ) : (
              <Ionicons name="log-in-outline" size={20} color={Colors.white} />
            )}
            <Text style={styles.buttonText}>{isLoading ? 'Signing in…' : 'Sign In'}</Text>
          </Pressable>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Auth */}
          <Pressable
            style={({ pressed }) => [styles.button, styles.buttonSocial, pressed && styles.buttonPressed]}
            onPress={loginWithGoogle}
            disabled={isLoading}
          >
            <Ionicons name="logo-google" size={20} color="#4285F4" />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.button, styles.buttonSocial, pressed && styles.buttonPressed]}
            onPress={loginWithApple}
            disabled={isLoading}
          >
            <Ionicons name="logo-apple" size={20} color={Colors.white} />
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </Pressable>
        </View>

        {/* Footer */}
        <Pressable onPress={() => router.push('/(auth)/register')} style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account? <Text style={styles.footerAccent}>Create one</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    gap: Spacing.sm,
    marginBottom: Spacing['3xl'],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: '700',
    color: Colors.text.primary,
    letterSpacing: Typography.letterSpacing.tight,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  form: {
    gap: Spacing.base,
  },
  errorBanner: {
    backgroundColor: Colors.semantic.riskBg,
    borderWidth: 1,
    borderColor: Colors.semantic.risk,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  errorText: {
    flex: 1,
    color: Colors.status.concernLight,
    fontSize: Typography.fontSize.sm,
  },
  inputGroup: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: Typography.letterSpacing.wider,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    color: Colors.text.primary,
    fontSize: Typography.fontSize.base,
    height: '100%',
  },
  eyeButton: {
    padding: Spacing.xs,
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
    marginTop: Spacing.sm,
    ...Shadows.md,
  },
  buttonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    color: Colors.white,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginVertical: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.default,
  },
  dividerText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
  buttonSocial: {
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.borderLight,
  },
  socialButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginTop: Spacing['2xl'],
  },
  footerText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  footerAccent: {
    color: Colors.accent.primaryLight,
    fontWeight: '600',
  },
});
