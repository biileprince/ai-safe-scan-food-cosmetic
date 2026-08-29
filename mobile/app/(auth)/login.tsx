/**
 * SafeScan — Login Screen
 * 
 * Professional, clean auth screen with subtle animations.
 */

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useAuthStore } from '../../stores/useAuthStore';
import { Image } from 'expo-image';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    try {
      await login(email, password);
      // layout will auto-redirect on auth state change
    } catch (e) {
      // error is handled by store
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        
        {/* Header Image / Pattern */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.headerImageContainer}>
           <Image 
             source={{ uri: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80' }}
             style={styles.headerImage}
             contentFit="cover"
           />
           <View style={styles.headerOverlay} />
           
           <Pressable style={styles.backButton} onPress={() => { clearError(); router.back(); }}>
             <Ionicons name="arrow-back" size={24} color={Colors.white} />
           </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your safety journey.</Text>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color={Colors.status.concern} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={Colors.text.tertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="name@example.com"
                  placeholderTextColor={Colors.text.tertiary}
                  value={email}
                  onChangeText={(text) => { setEmail(text); clearError(); }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!isLoading}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={Colors.text.tertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.text.tertiary}
                  value={password}
                  onChangeText={(text) => { setPassword(text); clearError(); }}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={Colors.text.tertiary} />
                </Pressable>
              </View>
            </View>

            <Pressable style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && !isLoading && styles.buttonPressed,
                (!email || !password || isLoading) && styles.buttonDisabled
              ]}
              onPress={handleLogin}
              disabled={!email || !password || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.primaryButtonText}>Sign In</Text>
              )}
            </Pressable>
            
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialAuthContainer}>
              <Pressable 
                style={({ pressed }) => [styles.socialButton, pressed && styles.buttonPressed]}
                onPress={() => useAuthStore.getState().loginWithGoogle()}
              >
                <Ionicons name="logo-google" size={24} color={Colors.text.primary} />
                <Text style={styles.socialButtonText}>Google</Text>
              </Pressable>

              <Pressable 
                style={({ pressed }) => [styles.socialButton, pressed && styles.buttonPressed]}
                onPress={() => useAuthStore.getState().loginWithApple()}
              >
                <Ionicons name="logo-apple" size={24} color={Colors.text.primary} />
                <Text style={styles.socialButtonText}>Apple</Text>
              </Pressable>
            </View>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Pressable onPress={() => { clearError(); router.replace('/(auth)/register'); }}>
              <Text style={styles.footerLink}>Create one</Text>
            </Pressable>
          </View>
        </Animated.View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerImageContainer: {
    height: 220,
    width: '100%',
    position: 'relative',
  },
  headerImage: {
    ...StyleSheet.absoluteFill,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(22, 163, 74, 0.4)', // Colors.primary[600] with opacity
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['2xl'],
    paddingBottom: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.status.concernBg,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  errorText: {
    color: Colors.status.concern,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    flex: 1,
  },
  form: {
    gap: Spacing.lg,
  },
  inputGroup: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[50],
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.xl,
    height: 56,
    paddingHorizontal: Spacing.md,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    color: Colors.text.primary,
    fontSize: Typography.fontSize.base,
  },
  eyeIcon: {
    padding: Spacing.xs,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary[600],
    fontWeight: Typography.fontWeight.semibold,
  },
  primaryButton: {
    height: 56,
    backgroundColor: Colors.primary[600],
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    ...Shadows.md,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing['2xl'],
    marginBottom: Spacing.xl,
  },
  footerText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  footerLink: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary[600],
    fontWeight: Typography.fontWeight.bold,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.default,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    fontWeight: Typography.fontWeight.medium,
  },
  socialAuthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  socialButton: {
    flex: 1,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
  },
  socialButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
});
