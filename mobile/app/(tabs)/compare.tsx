/**
 * SafeScan — Compare Tab
 * 
 * Clean, card-based interface for selecting and comparing two scanned products.
 */

import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useRouter } from 'expo-router';
// Import dummy history hook or fetch from Appwrite for selection
import { useAuthStore } from '../../stores/useAuthStore';

export default function CompareScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  // In a real implementation, these would open a modal to select from history
  const [productA, setProductA] = useState<any>(null);
  const [productB, setProductB] = useState<any>(null);

  const handleSelectProduct = (slot: 'A' | 'B') => {
    // Navigate to a selection screen or open modal
    // For now, we'll just show an alert or placeholder
    alert('This would open your scan history to select a product.');
  };

  const canCompare = productA && productB;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Compare</Text>
        <Text style={styles.subtitle}>Select two products to compare their safety profiles side-by-side.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Selection Slots */}
        <View style={styles.slotsContainer}>
          <ProductSlot 
            label="Product 1" 
            product={productA} 
            onPress={() => handleSelectProduct('A')} 
          />
          
          <View style={styles.vsCircle}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          
          <ProductSlot 
            label="Product 2" 
            product={productB} 
            onPress={() => handleSelectProduct('B')} 
          />
        </View>

        {/* Action Button */}
        <Pressable 
          style={[styles.compareButton, !canCompare && styles.compareButtonDisabled]}
          disabled={!canCompare}
        >
          <Text style={styles.compareButtonText}>Compare Products</Text>
        </Pressable>

        {/* Placeholder state */}
        {!canCompare && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="git-compare-outline" size={48} color={Colors.gray[300]} />
            </View>
            <Text style={styles.emptyTitle}>Ready to compare</Text>
            <Text style={styles.emptySubtitle}>
              Select two products from your scan history to see a detailed comparison of their ingredients and safety profiles.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ProductSlot({ label, product, onPress }: { label: string, product: any, onPress: () => void }) {
  if (product) {
    return (
      <Pressable style={styles.slotFilled} onPress={onPress}>
        <View style={styles.slotContent}>
          <Text style={styles.slotLabel}>{label}</Text>
          <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.productMeta}>{product.category}</Text>
        </View>
        <Ionicons name="swap-horizontal" size={20} color={Colors.primary[600]} />
      </Pressable>
    );
  }

  return (
    <Pressable style={styles.slotEmpty} onPress={onPress}>
      <View style={styles.addIconWrap}>
        <Ionicons name="add" size={24} color={Colors.primary[600]} />
      </View>
      <View>
        <Text style={styles.emptySlotLabel}>Select {label}</Text>
        <Text style={styles.emptySlotSub}>Tap to choose from history</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.base,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.heavy,
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginTop: 2,
    lineHeight: 18,
  },
  content: {
    padding: Spacing.xl,
    gap: Spacing.xl,
  },
  slotsContainer: {
    position: 'relative',
    gap: Spacing.md,
  },
  vsCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    marginTop: -18,
    marginLeft: -18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...Shadows.md,
  },
  vsText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[700],
  },
  slotEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    height: 100,
  },
  addIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySlotLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  emptySlotSub: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  slotFilled: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    height: 100,
    ...Shadows.card,
  },
  slotContent: {
    flex: 1,
  },
  slotLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  productName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  productMeta: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  compareButton: {
    height: 52,
    backgroundColor: Colors.primary[600],
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  compareButtonDisabled: {
    backgroundColor: Colors.gray[200],
    shadowOpacity: 0,
    elevation: 0,
  },
  compareButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing['3xl'],
    gap: Spacing.md,
  },
  emptyIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  emptySubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
    lineHeight: 22,
  },
});
