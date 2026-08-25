/**
 * SafeScan — ConfidenceMeter Component
 * 
 * Animated arc/ring that visualizes OCR or match confidence.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { formatConfidence, getConfidenceLabel } from '../../utils/formatters';

interface ConfidenceMeterProps {
  value: number; // 0.0 – 1.0
  label?: string;
  size?: number;
}

export default function ConfidenceMeter({ value, label = 'Confidence', size = 80 }: ConfidenceMeterProps) {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: value,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const getColor = (v: number) => {
    if (v >= 0.8) return Colors.status.favorable;
    if (v >= 0.5) return Colors.status.caution;
    return Colors.status.concern;
  };

  const color = getColor(value);
  const percentage = Math.round(value * 100);

  // We'll represent this as a simple bar meter since SVG arcs
  // require react-native-svg. The bar is still animated and visually clear.
  return (
    <View style={[styles.container, { width: size * 1.5 }]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.barTrack}>
        <Animated.View
          style={[
            styles.barFill,
            {
              backgroundColor: color,
              width: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color }]}>{formatConfidence(value)}</Text>
        <Text style={styles.qualityLabel}>{getConfidenceLabel(value)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  barTrack: {
    height: 6,
    backgroundColor: Colors.border.default,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
  },
  qualityLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
});
