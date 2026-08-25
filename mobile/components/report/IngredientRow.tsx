/**
 * SafeScan — IngredientRow Component
 * 
 * Single ingredient row showing status icon, name, and category.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface IngredientRowProps {
  name: string;
  canonical?: string;
  riskLevel?: string;
  category?: string;
  isBeneficial?: boolean;
  isAllergen?: boolean;
  matchConfidence?: number;
  onPress?: () => void;
}

const RISK_CONFIG: Record<string, { color: string; icon: IoniconsName }> = {
  none: { color: Colors.status.favorable, icon: 'checkmark-circle-outline' },
  low: { color: Colors.status.favorable, icon: 'checkmark-circle-outline' },
  moderate: { color: Colors.status.caution, icon: 'warning-outline' },
  high: { color: Colors.status.concern, icon: 'close-circle-outline' },
  prohibited: { color: Colors.status.concern, icon: 'ban-outline' },
  unknown: { color: Colors.text.tertiary, icon: 'help-circle-outline' },
};

export default function IngredientRow({
  name,
  canonical,
  riskLevel = 'unknown',
  category,
  isBeneficial,
  isAllergen,
  matchConfidence,
  onPress,
}: IngredientRowProps) {
  const risk = RISK_CONFIG[riskLevel] || RISK_CONFIG.unknown;

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && onPress ? styles.rowPressed : null]}
      onPress={onPress}
      disabled={!onPress}
    >
      {/* Status icon */}
      <View style={[styles.statusDot, { backgroundColor: risk.color + '20' }]}>
        <Ionicons name={risk.icon} size={16} color={risk.color} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        {canonical && canonical !== name && (
          <Text style={styles.canonical} numberOfLines={1}>{canonical}</Text>
        )}
        <View style={styles.metaRow}>
          {category && (
            <View style={styles.metaChip}>
              <Text style={styles.metaText}>{category}</Text>
            </View>
          )}
          {isBeneficial && (
            <View style={[styles.metaChip, styles.benefitChip]}>
              <Ionicons name="sparkles-outline" size={10} color={Colors.status.favorable} />
              <Text style={[styles.metaText, { color: Colors.status.favorable }]}>Beneficial</Text>
            </View>
          )}
          {isAllergen && (
            <View style={[styles.metaChip, styles.allergenChip]}>
              <Ionicons name="warning-outline" size={10} color={Colors.status.caution} />
              <Text style={[styles.metaText, { color: Colors.status.caution }]}>Allergen</Text>
            </View>
          )}
        </View>
      </View>

      {/* Confidence indicator */}
      {matchConfidence != null && (
        <Text style={[
          styles.confidence,
          { color: matchConfidence > 0.7 ? Colors.text.tertiary : Colors.status.caution }
        ]}>
          {Math.round(matchConfidence * 100)}%
        </Text>
      )}

      {onPress && <Ionicons name="chevron-forward" size={14} color={Colors.text.tertiary} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border.subtle,
  },
  rowPressed: {
    backgroundColor: Colors.gray[50],
  },
  statusDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  canonical: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: 2,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  benefitChip: {
    backgroundColor: Colors.status.favorableBg,
  },
  allergenChip: {
    backgroundColor: Colors.semantic.allergenBg,
  },
  metaText: {
    fontSize: 10,
    color: Colors.text.tertiary,
    textTransform: 'capitalize',
  },
  confidence: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
  },
});
