/**
 * SafeScan — Profile Tab
 */

import { View, Text, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useAuthStore } from '../../stores/useAuthStore';
import { useProfileStore } from '../../stores/useProfileStore';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const JURISDICTIONS = [
  { code: 'NG', label: 'Nigeria', flag: '🇳🇬' },
  { code: 'KE', label: 'Kenya', flag: '🇰🇪' },
  { code: 'ZA', label: 'South Africa', flag: '🇿🇦' },
  { code: 'GH', label: 'Ghana', flag: '🇬🇭' },
  { code: 'US', label: 'United States', flag: '🇺🇸' },
  { code: 'EU', label: 'European Union', flag: '🇪🇺' },
];

const ALLERGENS = [
  { key: 'milk', label: 'Milk / Dairy' },
  { key: 'eggs', label: 'Eggs' },
  { key: 'peanuts', label: 'Peanuts' },
  { key: 'tree_nuts', label: 'Tree Nuts' },
  { key: 'wheat_gluten', label: 'Wheat / Gluten' },
  { key: 'soy', label: 'Soy' },
  { key: 'fish', label: 'Fish' },
  { key: 'shellfish', label: 'Shellfish' },
  { key: 'sesame', label: 'Sesame' },
];

const DIETARY = [
  { key: 'vegan', label: 'Vegan' },
  { key: 'vegetarian', label: 'Vegetarian' },
  { key: 'halal', label: 'Halal' },
  { key: 'kosher', label: 'Kosher' },
  { key: 'keto', label: 'Keto' },
  { key: 'gluten_free', label: 'Gluten Free' },
  { key: 'dairy_free', label: 'Dairy Free' },
  { key: 'organic', label: 'Organic Only' },
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || ''}</Text>
          </View>
        </View>

        {/* Jurisdiction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Regulatory Region</Text>
          <Text style={styles.sectionSubtitle}>Safety standards used for assessments</Text>
          <View style={styles.chipGrid}>
            {JURISDICTIONS.map(j => (
              <Pressable
                key={j.code}
                style={[styles.chip, selectedJurisdiction === j.code && styles.chipActive]}
                onPress={() => updateJurisdiction(j.code)}
              >
                <Text style={styles.chipFlag}>{j.flag}</Text>
                <Text style={[styles.chipText, selectedJurisdiction === j.code && styles.chipTextActive]}>
                  {j.label}
                </Text>
                {selectedJurisdiction === j.code && (
                  <Ionicons name="checkmark" size={14} color={Colors.primary[600]} />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Allergens */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allergen Alerts</Text>
          <Text style={styles.sectionSubtitle}>Get warnings when these are detected</Text>
          <View style={styles.chipGrid}>
            {ALLERGENS.map(a => {
              const selected = selectedAllergens.includes(a.key);
              return (
                <Pressable
                  key={a.key}
                  style={[styles.chip, selected && styles.chipDanger]}
                  onPress={() => toggleAllergen(a.key)}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextDanger]}>{a.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Dietary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dietary Preferences</Text>
          <Text style={styles.sectionSubtitle}>Filter products by diet</Text>
          <View style={styles.chipGrid}>
            {DIETARY.map(d => {
              const selected = selectedDietary.includes(d.key);
              return (
                <Pressable
                  key={d.key}
                  style={[styles.chip, selected && styles.chipActive]}
                  onPress={() => toggleDietary(d.key)}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextActive]}>{d.label}</Text>
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
          <Ionicons name="log-out-outline" size={18} color={Colors.status.concern} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>SafeScan v1.0.0</Text>
          <Text style={styles.footerHint}>
            Assessments are informational and not a substitute for professional advice.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing['4xl'],
    gap: Spacing.base,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  userEmail: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.card,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
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
    backgroundColor: Colors.gray[50],
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  chipActive: {
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[600],
  },
  chipDanger: {
    backgroundColor: Colors.status.cautionBg,
    borderColor: Colors.status.caution,
  },
  chipFlag: {
    fontSize: 16,
  },
  chipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  chipTextActive: {
    color: Colors.primary[700],
  },
  chipTextDanger: {
    color: Colors.status.caution,
  },
  logoutButton: {
    height: 48,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.status.concern,
    backgroundColor: Colors.status.concernBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  logoutText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.status.concern,
  },
  footer: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingTop: Spacing.base,
  },
  footerText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    fontWeight: Typography.fontWeight.medium,
  },
  footerHint: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: Spacing.xl,
  },
});
