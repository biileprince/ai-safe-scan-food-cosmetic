/**
 * SafeScan — Report Detail Screen (with real icons)
 * 
 * Dynamic route: /report/[id]
 */

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import * as scanService from '../../services/scan.service';
import type { ScanReport, ParsedBenefit, ParsedConcern } from '../../services/scan.service';
import { ASSESSMENTS, getAssessmentColor } from '../../constants/assessments';
import type { AssessmentTier } from '../../constants/assessments';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const ASSESSMENT_ICONS: Record<string, IoniconsName> = {
  favorable: 'checkmark-circle',
  caution: 'warning',
  concern: 'close-circle',
  insufficient: 'help-circle',
};

export default function ReportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [report, setReport] = useState<ScanReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let interval: ReturnType<typeof setInterval>;

    const loadReport = async () => {
      try {
        const data = await scanService.getReport(id);
        setReport(data);

        if (data.status === 'processing') {
          interval = setInterval(async () => {
            try {
              const updated = await scanService.getReport(id);
              setReport(updated);
              if (updated.status !== 'processing') {
                clearInterval(interval);
              }
            } catch {
              clearInterval(interval);
            }
          }, 3000);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load report.');
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
    return () => { if (interval) clearInterval(interval); };
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent.primary} />
        <Text style={styles.loadingText}>Loading report…</Text>
      </View>
    );
  }

  if (error || !report) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.status.caution} />
        <Text style={styles.errorText}>{error || 'Report not found.'}</Text>
        <Pressable style={styles.backButtonSmall} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color={Colors.text.primary} />
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  if (report.status === 'processing') {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.processingAnimation}>
          <MaterialCommunityIcons name="flask-round-bottom" size={36} color={Colors.accent.primaryLight} />
        </View>
        <Text style={styles.processingTitle}>Analyzing Product…</Text>
        <Text style={styles.processingSubtitle}>
          Extracting ingredients and checking safety databases
        </Text>
        <View style={styles.processingSteps}>
          <View style={styles.stepRow}>
            <Ionicons name="checkmark-circle" size={18} color={Colors.status.favorable} />
            <Text style={styles.processingStep}>Image uploaded</Text>
          </View>
          <View style={styles.stepRow}>
            <ActivityIndicator size="small" color={Colors.accent.primary} />
            <Text style={styles.processingStep}>Extracting text…</Text>
          </View>
          <View style={[styles.stepRow, { opacity: 0.4 }]}>
            <Ionicons name="ellipse-outline" size={18} color={Colors.text.tertiary} />
            <Text style={styles.processingStep}>Analyzing ingredients</Text>
          </View>
          <View style={[styles.stepRow, { opacity: 0.3 }]}>
            <Ionicons name="ellipse-outline" size={18} color={Colors.text.tertiary} />
            <Text style={styles.processingStep}>Generating report</Text>
          </View>
        </View>
      </View>
    );
  }

  const assessment = report.overallAssessment as AssessmentTier;
  const assessmentDef = assessment ? ASSESSMENTS[assessment] : null;
  const assessmentColor = assessment ? getAssessmentColor(assessment) : Colors.text.tertiary;
  const assessmentIcon = assessmentDef ? ASSESSMENT_ICONS[assessmentDef.colorKey] : 'help-circle';
  const benefits = scanService.parseBenefits(report.benefits);
  const concerns = scanService.parseConcerns(report.concerns);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={Colors.text.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Safety Report</Text>
          <Pressable style={styles.shareButton}>
            <Ionicons name="share-outline" size={20} color={Colors.text.secondary} />
          </Pressable>
        </View>

        {/* Product info */}
        <View style={styles.productCard}>
          <View style={styles.productIconWrap}>
            <Ionicons name="cube-outline" size={24} color={Colors.accent.primaryLight} />
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{report.productName || 'Unknown Product'}</Text>
            <View style={styles.categoryRow}>
              <Ionicons name="pricetag-outline" size={14} color={Colors.text.tertiary} />
              <Text style={styles.productCategory}>{report.productCategory || 'Unclassified'}</Text>
            </View>
          </View>
        </View>

        {/* Assessment badge */}
        {assessmentDef && (
          <View style={[styles.assessmentCard, { borderColor: assessmentColor }]}>
            <View style={[styles.assessmentBadge, { backgroundColor: assessmentColor + '20' }]}>
              <Ionicons name={assessmentIcon} size={22} color={assessmentColor} />
              <Text style={[styles.assessmentLabel, { color: assessmentColor }]}>
                {assessmentDef.label}
              </Text>
            </View>
            <Text style={styles.assessmentDescription}>{assessmentDef.description}</Text>
            <View style={styles.actionRow}>
              <Ionicons name="bulb-outline" size={16} color={Colors.text.tertiary} />
              <Text style={styles.assessmentAction}>{assessmentDef.userAction}</Text>
            </View>
          </View>
        )}

        {/* Confidence scores */}
        <View style={styles.confidenceCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="analytics-outline" size={18} color={Colors.accent.primaryLight} />
            <Text style={styles.sectionTitle}>Confidence</Text>
          </View>
          <View style={styles.confidenceRow}>
            <Ionicons name="text-outline" size={16} color={Colors.text.tertiary} />
            <Text style={styles.confidenceLabel}>Label Extraction</Text>
            <Text style={styles.confidenceValue}>
              {report.ocrConfidence != null ? `${Math.round(report.ocrConfidence * 100)}%` : '—'}
            </Text>
          </View>
          <View style={styles.confidenceRow}>
            <MaterialCommunityIcons name="molecule" size={16} color={Colors.text.tertiary} />
            <Text style={styles.confidenceLabel}>Ingredient Matching</Text>
            <Text style={styles.confidenceValue}>
              {report.matchConfidence != null ? `${Math.round(report.matchConfidence * 100)}%` : '—'}
            </Text>
          </View>
        </View>

        {/* Benefits section */}
        {benefits.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.status.favorable} />
              <Text style={styles.sectionTitle}>Potential Benefits</Text>
            </View>
            {benefits.map((b, i) => (
              <View key={i} style={[styles.findingCard, { borderLeftColor: Colors.status.favorable }]}>
                <Text style={styles.findingIngredient}>{b.ingredient}</Text>
                <Text style={styles.findingDescription}>{b.description}</Text>
                <View style={styles.evidenceRow}>
                  <Ionicons name="document-text-outline" size={12} color={Colors.text.tertiary} />
                  <Text style={styles.findingEvidence}>Evidence: {b.evidenceLevel}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Concerns section */}
        {concerns.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="warning" size={20} color={Colors.status.caution} />
              <Text style={styles.sectionTitle}>Potential Concerns</Text>
            </View>
            {concerns.map((c, i) => {
              const severityColor = c.severity === 'critical' || c.severity === 'high'
                ? Colors.status.concern
                : c.severity === 'moderate'
                  ? Colors.status.caution
                  : Colors.text.secondary;

              return (
                <View key={i} style={[styles.findingCard, { borderLeftColor: severityColor }]}>
                  <View style={styles.findingHeaderRow}>
                    <Text style={styles.findingIngredient}>{c.ingredient}</Text>
                    <View style={[styles.severityBadge, { backgroundColor: severityColor + '20' }]}>
                      <Text style={[styles.severityText, { color: severityColor }]}>
                        {c.severity.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.findingDescription}>{c.description}</Text>
                  <View style={styles.evidenceRow}>
                    <Ionicons name="link-outline" size={12} color={Colors.text.tertiary} />
                    <Text style={styles.findingSource}>Source: {c.source}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Allergen flags */}
        {report.allergenFlags && report.allergenFlags.length > 0 && (
          <View style={styles.allergenBanner}>
            <View style={styles.allergenTitleRow}>
              <Ionicons name="warning" size={20} color={Colors.status.caution} />
              <Text style={styles.allergenTitle}>Allergen Alert</Text>
            </View>
            <Text style={styles.allergenList}>
              {report.allergenFlags.join(', ')}
            </Text>
          </View>
        )}

        {/* Explanation text */}
        {report.explanationText && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="reader-outline" size={18} color={Colors.accent.primaryLight} />
              <Text style={styles.sectionTitle}>Analysis Summary</Text>
            </View>
            <Text style={styles.explanationText}>{report.explanationText}</Text>
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.text.tertiary} />
          <Text style={styles.disclaimerText}>
            This assessment is based on the declared ingredient list and referenced evidence. The photograph does not establish the actual concentration or laboratory purity of the ingredients. This is not a substitute for professional medical or regulatory advice.
          </Text>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing['2xl'],
  },
  loadingText: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.base,
  },
  errorText: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
  },
  backButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    marginTop: Spacing.md,
  },
  backButtonText: {
    color: Colors.text.primary,
    fontWeight: '500',
  },
  processingAnimation: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  processingSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  processingSteps: {
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  processingStep: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['4xl'],
    gap: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.base,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  productIconWrap: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.glass.backgroundHover,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  productName: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  productCategory: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    textTransform: 'capitalize',
  },
  assessmentCard: {
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  assessmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  assessmentLabel: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
  },
  assessmentDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  assessmentAction: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
    flex: 1,
  },
  confidenceCard: {
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  confidenceLabel: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  confidenceValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  section: {
    gap: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  findingCard: {
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 3,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  findingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  findingIngredient: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  findingDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  evidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  findingEvidence: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  findingSource: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
  },
  severityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  allergenBanner: {
    backgroundColor: Colors.semantic.allergenBg,
    borderWidth: 1,
    borderColor: Colors.semantic.allergen,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  allergenTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  allergenTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.status.caution,
  },
  allergenList: {
    fontSize: Typography.fontSize.sm,
    color: Colors.status.cautionLight,
    textTransform: 'capitalize',
  },
  explanationText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.glass.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    marginTop: Spacing.md,
  },
  disclaimerText: {
    flex: 1,
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    lineHeight: 18,
  },
});
