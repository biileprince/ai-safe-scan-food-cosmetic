/**
 * SafeScan — History Tab
 */

import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useAuthStore } from '../../stores/useAuthStore';
import * as scanService from '../../services/scan.service';
import type { ScanReport } from '../../services/scan.service';
import { ASSESSMENTS, getAssessmentColor, getAssessmentBgColor } from '../../constants/assessments';
import type { AssessmentTier } from '../../constants/assessments';
import { formatDate, formatCategory } from '../../utils/formatters';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const ASSESSMENT_ICONS: Record<string, IoniconsName> = {
  favorable: 'checkmark-circle',
  caution: 'alert-circle',
  concern: 'close-circle',
  insufficient: 'help-circle',
};

export default function HistoryScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [reports, setReports] = useState<ScanReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReports = useCallback(async () => {
    if (!user) return;
    try {
      const data = await scanService.getUserReports(user.$id);
      setReports(data);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => { loadReports(); }, [loadReports]);

  const onRefresh = () => { setRefreshing(true); loadReports(); };

  const renderReport = ({ item }: { item: ScanReport }) => {
    const assessment = item.overallAssessment as AssessmentTier;
    const def = assessment ? ASSESSMENTS[assessment] : null;
    const color = assessment ? getAssessmentColor(assessment) : Colors.gray[400];
    const bgColor = assessment ? getAssessmentBgColor(assessment) : Colors.gray[50];
    const icon = def ? ASSESSMENT_ICONS[def.colorKey] : 'sync-outline';

    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => router.push(`/report/${item.$id}`)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.productName || 'Unnamed Product'}
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{formatDate(item.createdAt)}</Text>
              <View style={styles.metaDot} />
              <Text style={styles.metaText}>{formatCategory(item.productCategory || 'unknown')}</Text>
            </View>
          </View>
          <View style={[styles.badge, { backgroundColor: bgColor }]}>
            <Ionicons name={icon as IoniconsName} size={14} color={color} />
            <Text style={[styles.badgeText, { color }]}>
              {def?.shortLabel || 'Processing'}
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={16} color={Colors.gray[300]} style={styles.chevron} />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan History</Text>
        <Text style={styles.subtitle}>
          {reports.length} {reports.length === 1 ? 'scan' : 'scans'} completed
        </Text>
      </View>

      {reports.length === 0 && !isLoading ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="document-text-outline" size={36} color={Colors.gray[300]} />
          </View>
          <Text style={styles.emptyTitle}>No Scans Yet</Text>
          <Text style={styles.emptySubtitle}>
            Scan your first product to see results here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          renderItem={renderReport}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary[600]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
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
  },
  listContent: {
    padding: Spacing.base,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.card,
  },
  cardPressed: {
    backgroundColor: Colors.gray[50],
  },
  cardHeader: {
    flex: 1,
    gap: Spacing.sm,
  },
  cardInfo: {
    gap: 2,
  },
  productName: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metaText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.gray[300],
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
  chevron: {
    marginLeft: Spacing.sm,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['3xl'],
    gap: Spacing.md,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  emptySubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
