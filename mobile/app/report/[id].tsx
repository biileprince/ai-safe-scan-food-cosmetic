/**
 * SafeScan — Report Detail Screen
 * 
 * Clean, card-based interface displaying the final safety assessment.
 */

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import * as scanService from '../../services/scan.service';
import type { ScanReport, ParsedConcern, ParsedBenefit } from '../../services/scan.service';
import { getImageUrl } from '../../services/storage.service';

import Badge from '../../components/ui/Badge';
import ConfidenceMeter from '../../components/ui/ConfidenceMeter';
import IngredientRow from '../../components/report/IngredientRow';
import DisclaimerBanner from '../../components/report/DisclaimerBanner';
import ScanProgress from '../../components/scan/ScanProgress';
import type { AssessmentTier } from '../../constants/assessments';

export default function ReportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [report, setReport] = useState<ScanReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const fetchReport = async () => {
      try {
        if (!id) return;
        const data = await scanService.getReport(id);
        setReport(data);
        
        // If it's done, stop polling
        if (data.status !== 'processing') {
          setLoading(false);
          if (interval) clearInterval(interval);
        }
      } catch (err) {
        console.error('Fetch report error:', err);
        setError('Failed to load report.');
        setLoading(false);
        if (interval) clearInterval(interval);
      }
    };

    fetchReport();
    interval = setInterval(fetchReport, 3000);

    return () => clearInterval(interval);
  }, [id]);

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </Pressable>
        </View>
        <View style={styles.errorContent}>
          <Ionicons name="alert-circle-outline" size={64} color={Colors.status.concern} />
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={() => router.replace('/(tabs)/scan')}>
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (loading || report?.status === 'processing') {
    return <ScanProgress currentStep={3} />; // Simplified for now
  }

  if (!report) return null;

  const concerns = scanService.parseConcerns(report.concerns);
  const benefits = scanService.parseBenefits(report.benefits);
  const imageUrl = getImageUrl(report.imageFileId);
  const assessment = (report.overallAssessment || 'insufficient_evidence') as AssessmentTier;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Custom Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color={Colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Scan Results</Text>
        <Pressable style={styles.shareButton}>
          <Ionicons name="share-outline" size={22} color={Colors.primary[600]} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Product Overview Card */}
        <View style={styles.card}>
          <View style={styles.productRow}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.productImage} />
            ) : (
              <View style={styles.productImagePlaceholder}>
                <Ionicons name="image-outline" size={24} color={Colors.gray[400]} />
              </View>
            )}
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{report.productName || 'Unknown Product'}</Text>
              <Text style={styles.productCategory}>{report.productCategory || 'Uncategorized'}</Text>
              <View style={styles.badgeWrap}>
                <Badge assessment={assessment} size="md" />
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.explanationText}>
            {report.explanationText || 'Analysis complete. See details below.'}
          </Text>
          
          <View style={styles.divider} />
          
          <View style={styles.confidenceRow}>
            <View style={styles.confidenceItem}>
              <Text style={styles.confidenceLabel}>Label Clarity</Text>
              <ConfidenceMeter value={report.ocrConfidence || 0} size={100} />
            </View>
            <View style={styles.confidenceItem}>
              <Text style={styles.confidenceLabel}>Data Match</Text>
              <ConfidenceMeter value={report.matchConfidence || 0} size={100} />
            </View>
          </View>
        </View>

        {/* Flagged Allergens (if any) */}
        {report.allergenFlags && report.allergenFlags.length > 0 && (
          <View style={[styles.card, styles.alertCard]}>
            <View style={styles.alertHeader}>
              <Ionicons name="warning" size={20} color={Colors.status.concern} />
              <Text style={styles.alertTitle}>Allergen Warning</Text>
            </View>
            <Text style={styles.alertText}>
              This product contains: <Text style={styles.alertHighlight}>{report.allergenFlags.join(', ')}</Text>.
            </Text>
          </View>
        )}

        {/* Concerns */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Concerns & Alerts</Text>
          {concerns.length === 0 ? (
            <View style={styles.emptyList}>
              <Ionicons name="checkmark-circle-outline" size={24} color={Colors.status.favorable} />
              <Text style={styles.emptyListText}>No specific concerns found.</Text>
            </View>
          ) : (
            <View style={styles.ingredientList}>
              {concerns.map((c, i) => (
                <View key={`concern-${i}`} style={styles.ingredientItem}>
                  <View style={styles.ingredientHeader}>
                    <Text style={styles.ingredientName}>{c.ingredient}</Text>
                    <View style={[styles.severityPill, c.severity === 'critical' ? styles.sevCritical : c.severity === 'high' ? styles.sevHigh : styles.sevMod]}>
                      <Text style={styles.severityText}>{c.severity}</Text>
                    </View>
                  </View>
                  <Text style={styles.ingredientDesc}>{c.description}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Benefits */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Beneficial Ingredients</Text>
          {benefits.length === 0 ? (
            <View style={styles.emptyList}>
              <Text style={styles.emptyListText}>No notable benefits identified.</Text>
            </View>
          ) : (
            <View style={styles.ingredientList}>
              {benefits.map((b, i) => (
                <View key={`benefit-${i}`} style={styles.ingredientItem}>
                  <Text style={styles.ingredientName}>{b.ingredient}</Text>
                  <Text style={styles.ingredientDesc}>{b.description}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <DisclaimerBanner />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  shareButton: {
    width: 40,
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing.base,
    gap: Spacing.base,
    paddingBottom: Spacing['4xl'],
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  productRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.gray[100],
  },
  productImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  productCategory: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    textTransform: 'capitalize',
  },
  badgeWrap: {
    marginTop: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.default,
    marginVertical: Spacing.lg,
  },
  explanationText: {
    fontSize: Typography.fontSize.base,
    lineHeight: 24,
    color: Colors.text.primary,
  },
  confidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  confidenceItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  confidenceLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  alertCard: {
    backgroundColor: Colors.status.concernBg,
    borderColor: Colors.status.concern,
    borderWidth: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  alertTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.status.concern,
  },
  alertText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.status.concern,
    lineHeight: 20,
  },
  alertHighlight: {
    fontWeight: Typography.fontWeight.bold,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  emptyList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  emptyListText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  ingredientList: {
    gap: Spacing.lg,
  },
  ingredientItem: {
    gap: 4,
  },
  ingredientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ingredientName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  ingredientDesc: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  severityPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  sevCritical: { backgroundColor: Colors.status.concernBg },
  sevHigh: { backgroundColor: Colors.status.concernBg },
  sevMod: { backgroundColor: Colors.status.cautionBg },
  severityText: {
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  errorContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  errorTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  errorText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary[600],
    borderRadius: BorderRadius.md,
  },
  retryText: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.semibold,
  },
});
