import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useFeedStore } from '../../stores/useFeedStore';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { FeedItem, FeedFilter } from '../../services/feed/types';

export default function FeedScreen() {
  const { items, isLoading, filter, setFilter, loadFeed } = useFeedStore();

  useEffect(() => {
    loadFeed();
  }, []);

  const categories: FeedFilter['category'][] = ['All', 'Recalls', 'Tips', 'Community'];

  const renderItem = (item: FeedItem, index: number) => {
    let icon = 'newspaper';
    let iconColor: string = Colors.primary[600];
    let iconBg: string = Colors.primary[50];
    let typeLabel = '';

    switch (item.type) {
      case 'recall':
        icon = 'warning';
        iconColor = Colors.status.concern;
        iconBg = Colors.status.concernBg;
        typeLabel = `Recall · ${item.jurisdiction}`;
        break;
      case 'community':
        icon = 'person';
        iconColor = Colors.primary[600];
        iconBg = Colors.primary[50];
        typeLabel = `Community flag`;
        break;
      case 'spotlight':
        icon = 'beaker';
        iconColor = Colors.primary[600];
        iconBg = Colors.primary[50];
        typeLabel = 'Ingredient spotlight';
        break;
      case 'tip':
        icon = 'bulb';
        iconColor = Colors.status.caution;
        iconBg = Colors.status.cautionBg;
        typeLabel = 'Safety Tip';
        break;
      case 'regulatory_update':
        icon = 'shield-checkmark';
        iconColor = Colors.primary[600];
        iconBg = Colors.primary[50];
        typeLabel = `Regulatory update · ${item.jurisdiction}`;
        break;
    }

    return (
      <Animated.View entering={FadeInUp.delay(index * 100)} key={item.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
            {item.type === 'community' ? (
              <Text style={styles.initialsText}>{item.authorInitials}</Text>
            ) : (
              <Ionicons name={icon as any} size={16} color={iconColor} />
            )}
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.typeLabel}>{typeLabel}</Text>
            <Text style={styles.dateLabel}>{item.publishedAt}</Text>
          </View>
        </View>

        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardBody}>{item.body}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.footerAction}>
            <Ionicons name="thumbs-up-outline" size={14} color={Colors.text.secondary} />
            <Text style={styles.footerText}>{item.helpfulCount} helpful</Text>
          </View>
          
          {item.type === 'spotlight' || item.type === 'regulatory_update' ? (
            <View style={styles.footerAction}>
              <Ionicons name="time-outline" size={14} color={Colors.text.secondary} />
              <Text style={styles.footerText}>{item.readMinutes} min read</Text>
            </View>
          ) : (
            <View style={styles.footerAction}>
              <Ionicons name="share-social-outline" size={14} color={Colors.text.secondary} />
              <Text style={styles.footerText}>Share</Text>
            </View>
          )}

          {item.type === 'community' && (
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreText}>{item.score}</Text>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Feed</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
          {categories.map((c) => {
            const isActive = filter.category === c;
            return (
              <Pressable 
                key={c} 
                onPress={() => setFilter(c)}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{c}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          {isLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={Colors.primary[600]} />
            </View>
          ) : (
            items.map((item, index) => renderItem(item, index))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background.primary },
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.base, paddingTop: Spacing.xl, paddingBottom: Spacing.sm },
  headerTitle: { fontSize: Typography.fontSize.xl, fontWeight: '800', color: Colors.text.primary },
  filterScroll: { flexGrow: 0, marginBottom: Spacing.md },
  filterContent: { paddingHorizontal: Spacing.base, gap: Spacing.sm },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: BorderRadius.full, backgroundColor: Colors.gray[100], borderWidth: 1, borderColor: 'transparent' },
  filterPillActive: { backgroundColor: Colors.text.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: Colors.text.secondary },
  filterTextActive: { color: Colors.white },
  list: { flex: 1 },
  listContent: { paddingHorizontal: Spacing.base, paddingBottom: Spacing['3xl'] },
  loadingWrap: { paddingTop: 40, alignItems: 'center' },
  card: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border.default, borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md, ...Shadows.sm },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  iconWrap: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  initialsText: { fontSize: 12, fontWeight: '700', color: Colors.primary[700] },
  headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  typeLabel: { fontSize: 11, fontWeight: '700', color: Colors.text.secondary },
  dateLabel: { fontSize: 10, color: Colors.text.tertiary },
  cardTitle: { fontSize: 14.5, fontWeight: '700', color: Colors.text.primary, marginBottom: Spacing.xs, lineHeight: 20 },
  cardBody: { fontSize: 12.5, color: Colors.text.secondary, lineHeight: 18, marginBottom: Spacing.md },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border.subtle },
  footerAction: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerText: { fontSize: 12, fontWeight: '600', color: Colors.text.secondary },
  scoreBadge: { marginLeft: 'auto', backgroundColor: Colors.status.concernBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  scoreText: { fontSize: 11, fontWeight: '700', color: Colors.status.concern }
});
