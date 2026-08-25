/**
 * SafeScan — CameraOverlay Component
 *
 * Semi-transparent overlay for the CameraView with viewfinder guides.
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

const { width } = Dimensions.get('window');
const VIEWFINDER_SIZE = width - 80;

export default function CameraOverlay() {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Corner guides */}
      <View style={[styles.corner, styles.cornerTL]} />
      <View style={[styles.corner, styles.cornerTR]} />
      <View style={[styles.corner, styles.cornerBL]} />
      <View style={[styles.corner, styles.cornerBR]} />

      {/* Center label guide */}
      <View style={styles.guideLabelWrap}>
        <Ionicons name="scan-outline" size={20} color={Colors.accent.primaryLight} />
        <Text style={styles.guideText}>Align ingredient list here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: Colors.accent.primary,
  },
  cornerTL: {
    top: 20,
    left: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: 20,
    right: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: 20,
    left: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: 20,
    right: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  guideLabelWrap: {
    position: 'absolute',
    top: '45%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(10, 14, 26, 0.7)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  guideText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
});
