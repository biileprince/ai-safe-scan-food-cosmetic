import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/useAuthStore';
import { useScanStore } from '../../stores/useScanStore';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

export default function HistoryScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { history, isHistoryLoading, fetchHistory } = useScanStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.$id && history.length === 0) {
      fetchHistory(user.$id);
    }
  }, [user?.$id]);

  const onRefresh = async () => {
    if (user?.$id) {
      setRefreshing(true);
      await fetchHistory(user.$id);
      setRefreshing(false);
    }
  };

  const getScoreColor = (score?: number) => {
    if (score === undefined) return Colors.gray[400];
    if (score >= 80) return Colors.status.favorable;
    if (score >= 40) return Colors.status.caution;
    return Colors.status.concern;
  };
  
  const getScoreBg = (score?: number) => {
    if (score === undefined) return Colors.gray[100];
    if (score >= 80) return Colors.status.favorableBg;
    if (score >= 40) return Colors.status.cautionBg;
    return Colors.status.concernBg;
  };

  const renderItem = ({ item }: { item: any }) => {
    const numericScore = item.overallAssessment === 'Safe' ? 95 : (item.overallAssessment ? 45 : undefined);
    
    return (
      <Pressable 
        style={styles.card}
        onPress={() => router.push(`/report/${item.$id}`)}
      >
        <View style={styles.imageWrap}>
          <Ionicons name="image-outline" size={24} color={Colors.gray[400]} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{item.productName || 'Unknown Product'}</Text>
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleDateString(undefined, { 
              month: 'short', day: 'numeric', year: 'numeric' 
            })}
          </Text>
        </View>
        <View style={[
          styles.scoreBadge, 
          { backgroundColor: getScoreBg(numericScore) }
        ]}>
          <Text style={[
            styles.scoreText,
            { color: getScoreColor(numericScore) }
          ]}>
            {item.status === 'processing' ? '...' : (numericScore || '-')}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Scan History</Text>
        </View>

        {isHistoryLoading && !refreshing ? (
          <View style={styles.center}>
            <ActivityIndicator color={Colors.primary[600]} />
          </View>
        ) : history.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="time-outline" size={48} color={Colors.gray[400]} />
            </View>
            <Text style={styles.emptyTitle}>No history yet</Text>
            <Text style={styles.emptyDesc}>
              Products you scan will appear here so you can refer back to them later.
            </Text>
            <Pressable 
              style={styles.scanBtn}
              onPress={() => router.push('/(tabs)/scan')}
            >
              <Text style={styles.scanBtnText}>Scan a product</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.$id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary[600]} />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background.primary },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.base, paddingTop: Spacing.xl, paddingBottom: Spacing.md },
  headerTitle: { fontSize: Typography.fontSize.xl, fontWeight: '800', color: Colors.text.primary },
  clearBtn: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: Colors.gray[100], borderRadius: BorderRadius.full },
  clearBtnText: { fontSize: 12, fontWeight: '600', color: Colors.text.secondary },
  listContent: { paddingHorizontal: Spacing.base, paddingBottom: Spacing['4xl'] },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border.default, borderRadius: BorderRadius.lg, padding: Spacing.sm, marginBottom: Spacing.sm, ...Shadows.sm },
  imageWrap: { width: 48, height: 48, borderRadius: BorderRadius.md, backgroundColor: Colors.gray[100], alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  content: { flex: 1, marginLeft: Spacing.md },
  title: { fontSize: 15, fontWeight: '700', color: Colors.text.primary, marginBottom: 2 },
  date: { fontSize: 12, color: Colors.text.tertiary },
  scoreBadge: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginLeft: Spacing.sm },
  scoreText: { fontSize: 13, fontWeight: '800' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing['2xl'] },
  emptyIconWrap: { width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.gray[50], alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl },
  emptyTitle: { fontSize: Typography.fontSize.lg, fontWeight: '700', color: Colors.text.primary, marginBottom: Spacing.sm },
  emptyDesc: { fontSize: Typography.fontSize.sm, color: Colors.text.secondary, textAlign: 'center', lineHeight: 20, marginBottom: Spacing.xl },
  scanBtn: { backgroundColor: Colors.primary[600], paddingHorizontal: Spacing['2xl'], paddingVertical: 14, borderRadius: BorderRadius.full, ...Shadows.md },
  scanBtnText: { color: '#FFF', fontSize: Typography.fontSize.base, fontWeight: '700' }
});
