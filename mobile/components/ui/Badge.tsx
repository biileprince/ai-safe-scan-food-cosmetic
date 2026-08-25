/**
 * SafeScan — Badge Component
 * 
 * Animated assessment badge that visually represents
 * the overall safety tier of a product scan.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { ASSESSMENTS, getAssessmentColor } from '../../constants/assessments';
import type { AssessmentTier } from '../../constants/assessments';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const TIER_ICONS: Record<string, IoniconsName> = {
  favorable: 'checkmark-circle',
  caution: 'warning',
  concern: 'close-circle',
  insufficient: 'help-circle',
};

interface BadgeProps {
  assessment: AssessmentTier;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export default function Badge({ assessment, size = 'md', animated = true }: BadgeProps) {
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const def = ASSESSMENTS[assessment];
  const color = getAssessmentColor(assessment);
  const icon = TIER_ICONS[def?.colorKey || 'insufficient'];

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(1);
      opacityAnim.setValue(1);
    }
  }, [assessment]);

  const sizeStyles = {
    sm: { iconSize: 14, fontSize: Typography.fontSize.xs, px: Spacing.sm, py: 4 },
    md: { iconSize: 18, fontSize: Typography.fontSize.sm, px: Spacing.md, py: Spacing.xs },
    lg: { iconSize: 22, fontSize: Typography.fontSize.md, px: Spacing.lg, py: Spacing.sm },
  };

  const s = sizeStyles[size];

  return (
    <Animated.View
      style={[
        styles.badge,
        {
          backgroundColor: color + '20',
          paddingHorizontal: s.px,
          paddingVertical: s.py,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Ionicons name={icon} size={s.iconSize} color={color} />
      <Text style={[styles.label, { color, fontSize: s.fontSize }]}>
        {def?.shortLabel || 'Unknown'}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '700',
  },
});
