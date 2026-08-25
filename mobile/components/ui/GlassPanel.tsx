/**
 * SafeScan — GlassPanel Component
 * 
 * Reusable glassmorphism container with consistent styling.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../../constants/theme';

interface GlassPanelProps {
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
}

export default function GlassPanel({ children, style, noPadding }: GlassPanelProps) {
  return (
    <View style={[styles.panel, noPadding ? null : styles.padding, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  padding: {
    padding: Spacing.lg,
  },
});
