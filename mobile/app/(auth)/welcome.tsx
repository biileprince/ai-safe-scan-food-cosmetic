/**
 * SafeScan — Welcome Screen
 * 
 * Clean, professional onboarding with green+white design.
 */

import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Dark green header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Ionicons name="shield-checkmark" size={22} color={Colors.white} />
          </View>
          <Text style={styles.logoText}>SafeScan</Text>
        </View>
        <Text style={styles.heroTitle}>
          Know what's in{'\n'}your products.
        </Text>
        <Text style={styles.heroSubtitle}>
          Scan any food or cosmetic label and get instant, evidence-based safety insights.
        </Text>
      </View>

      {/* White card content */}
      <View style={styles.content}>
        {/* Feature list */}
        <View style={styles.featureList}>
          <FeatureItem
            icon="scan-outline"
            title="Scan product labels"
            description="Point your camera at any ingredient list"
          />
          <FeatureItem
            icon="shield-checkmark-outline"
            title="Safety assessment"
            description="Check ingredients against regulatory databases"
          />
          <FeatureItem
            icon="person-outline"
            title="Personalized alerts"
            description="Get flagged for your specific allergens"
          />
        </View>

        {/* CTA buttons */}
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.secondaryButtonText}>I already have an account</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({ icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon} size={20} color={Colors.primary[600]} />
      </View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['2xl'],
    paddingBottom: Spacing['3xl'],
    gap: Spacing.base,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    letterSpacing: Typography.letterSpacing.wide,
  },
  heroTitle: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.heavy,
    color: Colors.white,
    lineHeight: 42,
  },
  heroSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary[300],
    lineHeight: 22,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius['3xl'],
    borderTopRightRadius: BorderRadius['3xl'],
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['2xl'],
    justifyContent: 'space-between',
  },
  featureList: {
    gap: Spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.base,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  featureDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  actions: {
    gap: Spacing.md,
    paddingBottom: Spacing['2xl'],
  },
  primaryButton: {
    height: 52,
    backgroundColor: Colors.primary[600],
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  primaryButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
  },
  secondaryButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
