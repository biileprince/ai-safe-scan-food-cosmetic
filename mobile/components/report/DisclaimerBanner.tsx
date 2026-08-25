/**
 * SafeScan — DisclaimerBanner Component
 * 
 * Legal/informational disclaimer shown at the bottom of reports.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

interface DisclaimerBannerProps {
  compact?: boolean;
}

export default function DisclaimerBanner({ compact = false }: DisclaimerBannerProps) {
  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <View style={styles.iconRow}>
        <Ionicons name="information-circle-outline" size={16} color={Colors.text.tertiary} />
        {!compact && <Text style={styles.title}>Important Disclaimer</Text>}
      </View>
      <Text style={[styles.text, compact && styles.textCompact]}>
        This assessment is based on the declared ingredient list and referenced evidence.
        The photograph does not establish the actual concentration or laboratory purity of
        the ingredients. This is not a substitute for professional medical, dietary, or
        regulatory advice.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray[100],
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  containerCompact: {
    padding: Spacing.md,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  text: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    lineHeight: 18,
  },
  textCompact: {
    fontSize: 10,
    lineHeight: 14,
  },
});
