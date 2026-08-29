/**
 * SafeScan — Profile Tab (Account Settings)
 */

import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useAuthStore } from '../../stores/useAuthStore';
import { useProfileStore } from '../../stores/useProfileStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { profile, updateDietaryPrefs } = useProfileStore();

  const selectedDietary = profile?.dietaryPrefs || [];

  const handleToggle = (key: string) => {
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

  const isEnabled = (key: string) => selectedDietary.includes(key);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User card */}
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>PRO MEMBER</Text>
          </View>
        </View>

        {/* Dietary Restrictions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DIETARY RESTRICTIONS</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Vegan Diet Compliance</Text>
            <Switch
              trackColor={{ false: Colors.gray[200], true: Colors.primary[500] }}
              thumbColor={Colors.white}
              onValueChange={() => handleToggle('vegan')}
              value={isEnabled('vegan')}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Gluten-Free Standard</Text>
            <Switch
              trackColor={{ false: Colors.gray[200], true: Colors.primary[500] }}
              thumbColor={Colors.white}
              onValueChange={() => handleToggle('gluten_free')}
              value={isEnabled('gluten_free')}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Nut Allergy Severe Alert</Text>
            <Switch
              trackColor={{ false: Colors.gray[200], true: Colors.primary[500] }}
              thumbColor={Colors.white}
              onValueChange={() => handleToggle('nut_allergy')}
              value={isEnabled('nut_allergy')}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Halal Ingredient Match</Text>
            <Switch
              trackColor={{ false: Colors.gray[200], true: Colors.primary[500] }}
              thumbColor={Colors.white}
              onValueChange={() => handleToggle('halal')}
              value={isEnabled('halal')}
            />
          </View>
        </View>

        {/* Other Settings */}
        <View style={styles.section}>
          <Pressable style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={20} color={Colors.text.primary} style={styles.menuIcon} />
            <Text style={styles.menuText}>Notification Settings</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.menuItem}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.text.primary} style={styles.menuIcon} />
            <Text style={styles.menuText}>About SafeScan AI</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.menuItem}>
            <Ionicons name="mail-outline" size={20} color={Colors.text.primary} style={styles.menuIcon} />
            <Text style={styles.menuText}>Contact Scientific Board</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
          </Pressable>
        </View>

        {/* Sign out */}
        <View style={styles.logoutContainer}>
           <Pressable
             style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.8 }]}
             onPress={handleLogout}
           >
             <Ionicons name="log-out-outline" size={18} color={Colors.status.concern} />
             <Text style={styles.logoutText}>Sign Out</Text>
           </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerHint}>
            Assessments are powered by validated toxicological data and do not substitute for individual clinical advice.
          </Text>
          <Text style={styles.footerText}>SafeScan v3.1.2-clinical</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50], // Slightly lighter gray for native feel
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing['4xl'],
    gap: Spacing.xl,
  },
  userSection: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary[200],
  },
  avatarText: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[700],
  },
  userName: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  proBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primary[500],
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[600],
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.gray[100],
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.tertiary,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  settingText: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  menuIcon: {
    marginRight: Spacing.md,
  },
  menuText: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray[100],
    marginLeft: 36, // Align with text
  },
  logoutContainer: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
  logoutButton: {
    height: 48,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.status.concernBg,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  logoutText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.status.concern,
  },
  footer: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  footerHint: {
    fontSize: 12,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontWeight: Typography.fontWeight.medium,
  },
});
