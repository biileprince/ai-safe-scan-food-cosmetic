/**
 * SafeScan — ScanProgress Component
 * 
 * Multi-step processing animation shown while the AI pipeline is running.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface ProcessingStep {
  id: string;
  label: string;
  icon: IoniconsName;
  status: 'completed' | 'active' | 'pending';
}

interface ScanProgressProps {
  currentStep: number; // 0-based index
}

const STEPS: Omit<ProcessingStep, 'status'>[] = [
  { id: 'upload', label: 'Image uploaded', icon: 'cloud-upload-outline' },
  { id: 'ocr', label: 'Extracting text from label', icon: 'text-outline' },
  { id: 'classify', label: 'Classifying product', icon: 'pricetag-outline' },
  { id: 'extract', label: 'Identifying ingredients', icon: 'list-outline' },
  { id: 'safety', label: 'Checking safety databases', icon: 'shield-checkmark-outline' },
  { id: 'report', label: 'Generating report', icon: 'document-text-outline' },
];

export default function ScanProgress({ currentStep }: ScanProgressProps) {
  const pulseAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.6, duration: 600, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const steps: ProcessingStep[] = STEPS.map((step, i) => ({
    ...step,
    status: i < currentStep ? 'completed' : i === currentStep ? 'active' : 'pending',
  }));

  return (
    <View style={styles.container}>
      {/* Animated icon */}
      <View style={styles.heroIcon}>
        <MaterialCommunityIcons
          name="flask-round-bottom"
          size={40}
          color={Colors.primary[300]}
        />
      </View>

      <Text style={styles.title}>Analyzing Product…</Text>
      <Text style={styles.subtitle}>
        Extracting ingredients and checking safety databases
      </Text>

      {/* Step list */}
      <View style={styles.stepList}>
        {steps.map((step, i) => (
          <Animated.View
            key={step.id}
            style={[
              styles.stepRow,
              step.status === 'pending' && { opacity: 0.4 },
              step.status === 'active' && { opacity: pulseAnim },
            ]}
          >
            {step.status === 'completed' ? (
              <Ionicons name="checkmark-circle" size={20} color={Colors.status.favorable} />
            ) : step.status === 'active' ? (
              <ActivityIndicator size="small" color={Colors.primary[500]} />
            ) : (
              <Ionicons name="ellipse-outline" size={20} color={Colors.text.tertiary} />
            )}
            <Text style={[
              styles.stepLabel,
              step.status === 'completed' && { color: Colors.text.secondary },
            ]}>
              {step.label}
            </Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing['2xl'],
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.gray[50],
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  stepList: {
    gap: Spacing.md,
    marginTop: Spacing.lg,
    width: '100%',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  stepLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
});
