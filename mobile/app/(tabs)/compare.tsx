/**
 * SafeScan — Compare Tab (with real icons)
 */

import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

export default function CompareScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Compare Products</Text>
        <Text style={styles.subtitle}>Select two products to compare side by side</Text>
      </View>

      <View style={styles.compareGrid}>
        {/* Product A slot */}
        <Pressable style={styles.productSlot}>
          <View style={styles.addIcon}>
            <Ionicons name="add" size={28} color={Colors.accent.primaryLight} />
          </View>
          <Text style={styles.slotLabel}>Select Product A</Text>
          <Text style={styles.slotHint}>Choose from scan history</Text>
        </Pressable>

        {/* VS divider */}
        <View style={styles.vsDivider}>
          <View style={styles.vsCircle}>
            <Ionicons name="git-compare-outline" size={20} color={Colors.text.tertiary} />
          </View>
        </View>

        {/* Product B slot */}
        <Pressable style={styles.productSlot}>
          <View style={styles.addIcon}>
            <Ionicons name="add" size={28} color={Colors.accent.primaryLight} />
          </View>
          <Text style={styles.slotLabel}>Select Product B</Text>
          <Text style={styles.slotHint}>Choose from scan history</Text>
        </Pressable>
      </View>

      <View style={styles.comingSoon}>
        <Ionicons name="sparkles-outline" size={22} color={Colors.accent.secondaryLight} />
        <Text style={styles.comingSoonText}>Full comparison available in Phase 4</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '700',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
  },
  compareGrid: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    justifyContent: 'center',
  },
  productSlot: {
    backgroundColor: Colors.glass.background,
    borderWidth: 2,
    borderColor: Colors.glass.border,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    alignItems: 'center',
    gap: Spacing.md,
  },
  addIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.glass.backgroundHover,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotLabel: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  slotHint: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  vsDivider: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  vsCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['2xl'],
    gap: Spacing.sm,
  },
  comingSoonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
});
