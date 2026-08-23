/**
 * SafeScan — Tab Layout
 * 
 * Bottom tab navigation for the main authenticated experience.
 * Uses Ionicons vector icons instead of emojis.
 */

import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ icon, iconFocused, label, focused }: { icon: IoniconsName; iconFocused: IoniconsName; label: string; focused: boolean }) {
  return (
    <View style={styles.tabIconContainer}>
      <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
        <Ionicons
          name={focused ? iconFocused : icon}
          size={22}
          color={focused ? Colors.accent.primaryLight : Colors.text.tertiary}
        />
      </View>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.accent.primary,
        tabBarInactiveTintColor: Colors.text.tertiary,
      }}
    >
      <Tabs.Screen
        name="scan"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="scan-outline" iconFocused="scan" label="Scan" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="time-outline" iconFocused="time" label="History" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="compare"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="git-compare-outline" iconFocused="git-compare" label="Compare" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="person-outline" iconFocused="person" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.default,
    height: Platform.OS === 'ios' ? 88 : 70,
    paddingTop: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 28 : Spacing.sm,
    elevation: 0,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconWrapper: {
    width: 40,
    height: 32,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.text.tertiary,
  },
  tabLabelActive: {
    color: Colors.accent.primaryLight,
    fontWeight: '600',
  },
});
