/**
 * SafeScan — Profile Tab (with real icons)
 */

import { View, Text, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useAuthStore } from '../../stores/useAuthStore';
import { useProfileStore } from '../../stores/useProfileStore';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];
type MCIName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface AllergenItem {
  key: string;
  label: string;
  icon: IoniconsName | MCIName;
  iconSet: 'ion' | 'mci';
}

const ALLERGEN_OPTIONS: AllergenItem[] = [
  { key: 'milk', label: 'Milk / Dairy', icon: 'water-outline', iconSet: 'ion' },
  { key: 'eggs', label: 'Eggs', icon: 'egg-outline', iconSet: 'mci' },
  { key: 'peanuts', label: 'Peanuts', icon: 'peanut-outline', iconSet: 'mci' },
  { key: 'tree_nuts', label: 'Tree Nuts', icon: 'tree-outline', iconSet: 'mci' },
  { key: 'wheat_gluten', label: 'Wheat / Gluten', icon: 'barley', iconSet: 'mci' },
  { key: 'soy', label: 'Soy', icon: 'leaf-outline', iconSet: 'ion' },
  { key: 'fish', label: 'Fish', icon: 'fish-outline', iconSet: 'ion' },
  { key: 'shellfish', label: 'Shellfish', icon: 'fish-outline', iconSet: 'mci' },
  { key: 'sesame', label: 'Sesame', icon: 'grain', iconSet: 'mci' },
  { key: 'celery', label: 'Celery', icon: 'leaf-outline', iconSet: 'ion' },
  { key: 'mustard', label: 'Mustard', icon: 'circle-small', iconSet: 'mci' },
  { key: 'sulfites', label: 'Sulfites', icon: 'flask-outline', iconSet: 'ion' },
];

const JURISDICTIONS = [
  { code: 'NG', label: 'Nigeria (NAFDAC)', flag: '🇳🇬' },
  { code: 'KE', label: 'Kenya (KEBS)', flag: '🇰🇪' },
  { code: 'ZA', label: 'South Africa (SAHPRA)', flag: '🇿🇦' },
  { code: 'GH', label: 'Ghana (FDA-Ghana)', flag: '🇬🇭' },
  { code: 'US', label: 'United States (FDA)', flag: '🇺🇸' },
  { code: 'EU', label: 'European Union (EC)', flag: '🇪🇺' },
];

interface DietaryItem {
  key: string;
  label: string;
  icon: IoniconsName;
}

const DIETARY_OPTIONS: DietaryItem[] = [
  { key: 'vegan', label: 'Vegan', icon: 'leaf-outline' },
  { key: 'vegetarian', label: 'Vegetarian', icon: 'nutrition-outline' },
  { key: 'halal', label: 'Halal', icon: 'checkmark-done-outline' },
  { key: 'kosher', label: 'Kosher', icon: 'star-outline' },
  { key: 'keto', label: 'Keto', icon: 'flame-outline' },
  { key: 'gluten_free', label: 'Gluten Free', icon: 'close-circle-outline' },
  { key: 'dairy_free', label: 'Dairy Free', icon: 'water-outline' },
  { key: 'organic', label: 'Organic Only', icon: 'flower-outline' },
];

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { profile, updateAllergens, updateDietaryPrefs, updateJurisdiction } = useProfileStore();

  const selectedAllergens = profile?.allergens || [];
  const selectedDietary = profile?.dietaryPrefs || [];
  const selectedJurisdiction = profile?.jurisdiction || 'NG';

  const toggleAllergen = (key: string) => {
    const updated = selectedAllergens.includes(key)
      ? selectedAllergens.filter(a => a !== key)
      : [...selectedAllergens, key];
    updateAllergens(updated);
  };

  const toggleDietary = (key: string) => {
    const updated = selectedDietary.includes(key)
      ? selectedDietary.filter(d => d !== key)
      : [...selectedDietary, key];
    updateDietaryPrefs(updated);
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User info card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color={Colors.white} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || ''}</Text>
          </View>
          <Ionicons name="create-outline" size={20} color={Colors.text.tertiary} />
        </View>

        {/* Jurisdiction section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="globe-outline" size={20} color={Colors.accent.tealLight} />
            <Text style={styles.sectionTitle}>Jurisdiction</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Regulatory framework for safety assessments</Text>
          <View style={styles.chipGrid}>
            {JURISDICTIONS.map(j => (
              <Pressable
                key={j.code}
                style={[
                  styles.chip,
                  selectedJurisdiction === j.code && styles.chipActive,
                ]}
                onPress={() => updateJurisdiction(j.code)}
              >
                <Text style={styles.flagText}>{j.flag}</Text>
                <Text style={[
                  styles.chipText,
                  selectedJurisdiction === j.code && styles.chipTextActive,
                ]}>
                  {j.label}
                </Text>
                {selectedJurisdiction === j.code && (
                  <Ionicons name="checkmark" size={16} color={Colors.accent.primaryLight} />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Allergens section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="warning-outline" size={20} color={Colors.status.caution} />
            <Text style={styles.sectionTitle}>Allergen Alerts</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Get flagged when these allergens are detected</Text>
          <View style={styles.chipGrid}>
            {ALLERGEN_OPTIONS.map(a => {
              const isSelected = selectedAllergens.includes(a.key);
              return (
                <Pressable
                  key={a.key}
                  style={[styles.chip, isSelected && styles.chipDanger]}
                  onPress={() => toggleAllergen(a.key)}
                >
                  {a.iconSet === 'ion' ? (
                    <Ionicons name={a.icon as IoniconsName} size={16} color={isSelected ? Colors.status.caution : Colors.text.tertiary} />
                  ) : (
                    <MaterialCommunityIcons name={a.icon as MCIName} size={16} color={isSelected ? Colors.status.caution : Colors.text.tertiary} />
                  )}
                  <Text style={[styles.chipText, isSelected && styles.chipTextDanger]}>
                    {a.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Dietary preferences */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="restaurant-outline" size={20} color={Colors.accent.primaryLight} />
            <Text style={styles.sectionTitle}>Dietary Preferences</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Filter products by dietary requirements</Text>
          <View style={styles.chipGrid}>
            {DIETARY_OPTIONS.map(d => {
              const isSelected = selectedDietary.includes(d.key);
              return (
                <Pressable
                  key={d.key}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  onPress={() => toggleDietary(d.key)}
                >
                  <Ionicons name={d.icon} size={16} color={isSelected ? Colors.accent.primaryLight : Colors.text.tertiary} />
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                    {d.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Sign out */}
        <Pressable
          style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.8 }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.status.concern} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>

        {/* App info */}
        <View style={styles.appInfo}>
          <Ionicons name="shield-checkmark-outline" size={20} color={Colors.text.tertiary} />
          <Text style={styles.appInfoText}>SafeScan v1.0.0</Text>
          <Text style={styles.appInfoText}>AI-Powered Product Safety Intelligence</Text>
          <View style={styles.disclaimerRow}>
            <Ionicons name="information-circle-outline" size={14} color={Colors.text.tertiary} />
            <Text style={styles.disclaimer}>
              This app provides informational assessments based on ingredient labels and available evidence.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.base,
    paddingBottom: Spacing['4xl'],
    gap: Spacing.xl,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  userEmail: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginTop: -4,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  chipActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderColor: Colors.accent.primary,
  },
  chipDanger: {
    backgroundColor: Colors.semantic.allergenBg,
    borderColor: Colors.semantic.allergen,
  },
  flagText: {
    fontSize: 16,
  },
  chipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: Colors.accent.primaryLight,
  },
  chipTextDanger: {
    color: Colors.status.caution,
  },
  logoutButton: {
    height: 48,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.status.concern,
    backgroundColor: Colors.semantic.riskBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  logoutText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.status.concern,
  },
  appInfo: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingTop: Spacing.lg,
  },
  appInfoText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.sm,
  },
  disclaimer: {
    flex: 1,
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    lineHeight: 16,
  },
});
