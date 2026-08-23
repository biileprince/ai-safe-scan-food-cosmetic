/**
 * SafeScan — Register Screen (with real icons)
 */

import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useAuthStore } from '../../stores/useAuthStore';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, loginWithGoogle, loginWithApple, isLoading, error, clearError } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleRegister = async () => {
    setLocalError('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setLocalError('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    try {
      await register(email.trim(), password, name.trim());
    } catch {
      // Error handled in store
    }
  };

  const displayError = localError || error;

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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start scanning products for safety insights</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {displayError ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={Colors.status.concernLight} />
              <Text style={styles.errorText}>{displayError}</Text>
              <Pressable onPress={() => { clearError(); setLocalError(''); }}>
                <Ionicons name="close" size={18} color={Colors.status.concernLight} />
              </Pressable>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color={Colors.text.tertiary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={Colors.text.tertiary}
                autoCapitalize="words"
              />
            </View>
          </View>

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
                placeholder="Min. 8 characters"
                placeholderTextColor={Colors.text.tertiary}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.text.tertiary} />
              </Pressable>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.text.tertiary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter your password"
                placeholderTextColor={Colors.text.tertiary}
                secureTextEntry={!showPassword}
              />
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [styles.button, styles.buttonPrimary, pressed && styles.buttonPressed]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <Ionicons name="sync" size={20} color={Colors.white} />
            ) : (
              <Ionicons name="person-add-outline" size={20} color={Colors.white} />
            )}
            <Text style={styles.buttonText}>{isLoading ? 'Creating account…' : 'Create Account'}</Text>
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
        <Pressable onPress={() => router.push('/(auth)/login')} style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.footerAccent}>Sign in</Text>
          </Text>
        </Pressable>

        {/* Disclaimer */}
        <View style={styles.disclaimerRow}>
          <Ionicons name="information-circle-outline" size={14} color={Colors.text.tertiary} />
          <Text style={styles.disclaimer}>
            By creating an account, you agree that SafeScan provides informational assessments, not laboratory certification.
          </Text>
        </View>
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
  },
  header: {
    gap: Spacing.sm,
    marginBottom: Spacing['2xl'],
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
    gap: Spacing.md,
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
    marginVertical: Spacing.xs,
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
    marginTop: Spacing.xl,
  },
  footerText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  footerAccent: {
    color: Colors.accent.primaryLight,
    fontWeight: '600',
  },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
  },
  disclaimer: {
    flex: 1,
    textAlign: 'left',
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    lineHeight: 16,
  },
});
