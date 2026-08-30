import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../stores/useAuthStore';
import { useScanStore } from '../../stores/useScanStore';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { history, isHistoryLoading, fetchHistory } = useScanStore();
  const [activeFilter, setActiveFilter] = useState('For you');

  useEffect(() => {
    if (user?.$id) {
      fetchHistory(user.$id);
    }
  }, [user?.$id]);

  const filters = ['For you', 'Food', 'Cosmetic', 'Household'];
  
  const recentScans = history.slice(0, 3);
  
  const getScoreColor = (score?: number) => {
    if (score === undefined) return Colors.gray[400];
    if (score >= 80) return Colors.status.favorable;
    if (score >= 40) return Colors.status.caution;
    return Colors.status.concern;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color={Colors.gray[400]} />
            <TextInput 
              placeholder="Search products or ingredients..."
              placeholderTextColor={Colors.gray[400]}
              style={styles.searchInput}
            />
          </View>
          <Pressable onPress={() => router.push('/(tabs)/profile')} style={styles.profileAvatar}>
            <Text style={styles.profileInitials}>{user?.name?.substring(0, 2).toUpperCase() || 'US'}</Text>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
            {filters.map(f => (
              <Pressable 
                key={f} 
                onPress={() => setActiveFilter(f)}
                style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
              >
                <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.section}>
            <LinearGradient
              colors={[Colors.primary[900], Colors.primary[700]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.banner}
            >
              <View style={styles.bannerHeader}>
                <View style={styles.bannerIconWrap}>
                  <Ionicons name="warning" size={14} color="#FFF" />
                </View>
                <Text style={styles.bannerTitle}>Safety watch</Text>
              </View>
              <Text style={styles.bannerHeading}>European Union bans Lilial in all cosmetics</Text>
              <Text style={styles.bannerSub}>Check your fragrances and lotions for 'Butylphenyl Methylpropional'</Text>
              
              <Pressable style={styles.bannerAction}>
                <Text style={styles.bannerActionText}>Read alert</Text>
                <Ionicons name="arrow-forward" size={12} color={Colors.primary[600]} />
              </Pressable>
            </LinearGradient>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recently scanned</Text>
              <Pressable onPress={() => router.push('/(tabs)/history')}>
                <Text style={styles.seeAllText}>See all</Text>
              </Pressable>
            </View>

            {isHistoryLoading ? (
              <View style={styles.loadingState}>
                <ActivityIndicator color={Colors.primary[600]} />
              </View>
            ) : recentScans.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconWrap}>
                  <Ionicons name="scan-outline" size={32} color={Colors.gray[400]} />
                </View>
                <Text style={styles.emptyText}>You haven't scanned anything yet</Text>
                <Pressable onPress={() => router.push('/(tabs)/scan')} style={styles.emptyButton}>
                  <Text style={styles.emptyButtonText}>Start scanning</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.recentGrid}>
                {recentScans.map((scan) => {
                  const scoreColor = getScoreColor(scan.overallAssessment ? 85 : 30); // Placeholder score mapping since schema uses overallAssessment mostly right now
                  
                  return (
                    <Pressable 
                      key={scan.$id} 
                      style={styles.recentCard}
                      onPress={() => router.push(`/report/${scan.$id}`)}
                    >
                      <View style={styles.recentImageWrap}>
                        <Ionicons name="image-outline" size={24} color={Colors.gray[400]} />
                        <View style={[
                          styles.scoreBadge,
                          { backgroundColor: scoreColor }
                        ]}>
                          <Text style={styles.scoreText}>
                            {scan.status === 'processing' ? '...' : (scan.overallAssessment === 'Safe' ? 95 : 45)}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.recentTitle} numberOfLines={2}>
                        {scan.productName || 'Unknown Product'}
                      </Text>
                      <Text style={styles.recentDate}>
                        {new Date(scan.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background.primary },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingTop: Spacing.xl, paddingBottom: Spacing.md, gap: Spacing.md },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.gray[100], borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, height: 44, gap: Spacing.sm },
  searchInput: { flex: 1, fontSize: Typography.fontSize.sm, color: Colors.text.primary },
  profileAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary[100], alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.primary[200] },
  profileInitials: { fontSize: 14, fontWeight: '700', color: Colors.primary[700] },
  scrollContent: { paddingBottom: Spacing['4xl'] },
  filterScroll: { marginBottom: Spacing.lg },
  filterContent: { paddingHorizontal: Spacing.base, gap: Spacing.sm },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: BorderRadius.full, backgroundColor: Colors.gray[100], borderWidth: 1, borderColor: 'transparent' },
  filterPillActive: { backgroundColor: Colors.text.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: Colors.text.secondary },
  filterTextActive: { color: Colors.white },
  section: { paddingHorizontal: Spacing.base, marginBottom: Spacing.xl },
  banner: { borderRadius: BorderRadius.xl, padding: Spacing.lg, ...Shadows.md },
  bannerHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  bannerIconWrap: { width: 24, height: 24, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  bannerTitle: { color: Colors.white, fontSize: 12, fontWeight: '700', opacity: 0.9 },
  bannerHeading: { color: Colors.white, fontSize: 17, fontWeight: '800', marginBottom: 6, lineHeight: 22 },
  bannerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 18, marginBottom: 16 },
  bannerAction: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full, gap: 4 },
  bannerActionText: { color: Colors.primary[700], fontSize: 12, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: Spacing.md },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.text.primary },
  seeAllText: { fontSize: 13, fontWeight: '600', color: Colors.primary[600], marginBottom: 2 },
  loadingState: { alignItems: 'center', paddingVertical: 40 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, backgroundColor: Colors.background.secondary, borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.border.default, borderStyle: 'dashed' },
  emptyIconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.gray[100], alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyText: { fontSize: 14, color: Colors.text.secondary, fontWeight: '500', marginBottom: 16 },
  emptyButton: { backgroundColor: Colors.primary[600], paddingHorizontal: 20, paddingVertical: 10, borderRadius: BorderRadius.full },
  emptyButtonText: { color: Colors.white, fontSize: 13, fontWeight: '600' },
  recentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  recentCard: { width: '31%', marginBottom: Spacing.sm },
  recentImageWrap: { width: '100%', aspectRatio: 1, backgroundColor: Colors.gray[100], borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: 8, position: 'relative', overflow: 'hidden', borderWidth: 1, borderColor: Colors.border.subtle },
  scoreBadge: { position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', ...Shadows.sm },
  scoreText: { color: Colors.white, fontSize: 9, fontWeight: '800' },
  recentTitle: { fontSize: 12, fontWeight: '600', color: Colors.text.primary, lineHeight: 16, marginBottom: 2 },
  recentDate: { fontSize: 10, color: Colors.text.tertiary },
});
