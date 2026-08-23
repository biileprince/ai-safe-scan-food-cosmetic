/**
 * SafeScan — History Tab (with real icons)
 */

import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useAuthStore } from '../../stores/useAuthStore';
import * as scanService from '../../services/scan.service';
import type { ScanReport } from '../../services/scan.service';
import { ASSESSMENTS } from '../../constants/assessments';
import type { AssessmentTier } from '../../constants/assessments';

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

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const onRefresh = () => {
    setRefreshing(true);
    loadReports();
  };

  const getAssessmentStyle = (assessment: string | null) => {
    const tier = assessment as AssessmentTier;
    const def = tier ? ASSESSMENTS[tier] : null;
    if (!def) return { bg: Colors.glass.background, color: Colors.text.tertiary, label: 'Processing…', icon: 'sync-outline' as const };

    const colorMap: Record<string, { bg: string; color: string; icon: React.ComponentProps<typeof Ionicons>['name'] }> = {
      favorable: { bg: Colors.status.favorableDim, color: Colors.status.favorable, icon: 'checkmark-circle' },
      caution: { bg: Colors.status.cautionDim, color: Colors.status.caution, icon: 'warning' },
      concern: { bg: Colors.status.concernDim, color: Colors.status.concern, icon: 'close-circle' },
      insufficient: { bg: Colors.status.insufficientDim, color: Colors.status.insufficient, icon: 'help-circle' },
    };

    const colors = colorMap[def.colorKey] || colorMap.insufficient;
    return { ...colors, label: def.shortLabel };
  };

  const renderReport = ({ item }: { item: ScanReport }) => {
    const style = getAssessmentStyle(item.overallAssessment);
    const date = new Date(item.createdAt);

    return (
      <Pressable
        style={({ pressed }) => [styles.reportCard, pressed && styles.reportCardPressed]}
        onPress={() => router.push(`/report/${item.$id}`)}
      >
        <View style={styles.reportHeader}>
          <View style={styles.reportInfo}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.productName || 'Unnamed Product'}
            </Text>
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={12} color={Colors.text.tertiary} />
              <Text style={styles.reportDate}>
                {date.toLocaleDateString()}
              </Text>
              <Ionicons name="pricetag-outline" size={12} color={Colors.text.tertiary} />
              <Text style={styles.reportDate}>
                {item.productCategory || 'Unknown'}
              </Text>
            </View>
          </View>
          <View style={[styles.badge, { backgroundColor: style.bg }]}>
            <Ionicons name={style.icon} size={14} color={style.color} />
            <Text style={[styles.badgeText, { color: style.color }]}>{style.label}</Text>
          </View>
        </View>

        {item.ocrConfidence != null && (
          <View style={styles.confidenceRow}>
            <View style={styles.confidenceBar}>
              <View
                style={[styles.confidenceFill, { width: `${item.ocrConfidence * 100}%` }]}
              />
            </View>
            <Text style={styles.confidenceText}>{Math.round(item.ocrConfidence * 100)}%</Text>
          </View>
        )}

        <View style={styles.chevronRow}>
          <Ionicons name="chevron-forward" size={16} color={Colors.text.tertiary} />
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan History</Text>
        <Text style={styles.subtitle}>{reports.length} scans completed</Text>
      </View>

      {reports.length === 0 && !isLoading ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="document-text-outline" size={48} color={Colors.text.tertiary} />
          </View>
          <Text style={styles.emptyTitle}>No Scans Yet</Text>
          <Text style={styles.emptySubtitle}>
            Scan your first product to see results here
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
              tintColor={Colors.accent.primary}
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
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['3xl'],
    gap: Spacing.md,
  },
  reportCard: {
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    gap: Spacing.md,
  },
  reportCardPressed: {
    backgroundColor: Colors.glass.backgroundHover,
    transform: [{ scale: 0.99 }],
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reportInfo: {
    flex: 1,
    marginRight: Spacing.md,
    gap: Spacing.xs,
  },
  productName: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reportDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginRight: Spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  confidenceBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border.default,
    borderRadius: 2,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: Colors.accent.primary,
    borderRadius: 2,
  },
  confidenceText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    width: 32,
    textAlign: 'right',
  },
  chevronRow: {
    alignItems: 'flex-end',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['3xl'],
    gap: Spacing.md,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  emptySubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
