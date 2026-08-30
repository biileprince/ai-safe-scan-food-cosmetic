import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator, SafeAreaView, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getReport, ScanReport, parseBenefits, parseConcerns, ParsedConcern } from '../../services/scan.service';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import DisclaimerBanner from '../../components/report/DisclaimerBanner';

export default function ReportScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [report, setReport] = useState<ScanReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchReportData(id as string);
    }
  }, [id]);

  const fetchReportData = async (reportId: string) => {
    try {
      const data = await getReport(reportId);
      setReport(data);
      
      // If still processing, poll every 3 seconds
      if (data.status === 'processing') {
        setTimeout(() => fetchReportData(reportId), 3000);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load report.');
      setLoading(false);
    }
  };

  if (loading || !report) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary[600]} />
        <Text style={styles.loadingText}>
          {report?.status === 'processing' ? 'Analyzing formulation...' : 'Loading report...'}
        </Text>
      </View>
    );
  }
  
  if (report.status === 'failed') {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.status.concern} />
        <Text style={styles.loadingText}>Scan failed to process.</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: Colors.primary[600] }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const numericScore = report.overallAssessment === 'Safe' ? 95 : (report.overallAssessment ? 45 : 70); // Map AI text to score (schema uses string)
  const isFavorable = numericScore >= 80;
  const isCaution = numericScore >= 40 && numericScore < 80;
  
  const scoreColor = isFavorable ? Colors.status.favorable : isCaution ? Colors.status.caution : Colors.status.concern;
  const scoreBg = isFavorable ? Colors.status.favorableBg : isCaution ? Colors.status.cautionBg : Colors.status.concernBg;

  const parsedConcerns = parseConcerns(report.concerns);
  const parsedBenefits = parseBenefits(report.benefits);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Scan Report</Text>
          <Pressable style={styles.actionBtn}>
            <Ionicons name="share-outline" size={22} color={Colors.text.primary} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.heroSection}>
            <View style={styles.heroContent}>
              <Text style={styles.productCategory}>{report.productCategory || 'Product'}</Text>
              <Text style={styles.productName}>{report.productName || 'Unknown Product'}</Text>
              <Text style={[styles.verdictText, { color: scoreColor }]}>
                {report.overallAssessment || 'Moderate Risk'}
              </Text>
            </View>
            <View style={[styles.scoreCircle, { backgroundColor: scoreBg, borderColor: scoreColor }]}>
              <Text style={[styles.scoreText, { color: scoreColor }]}>{numericScore}</Text>
              <Text style={[styles.scoreSub, { color: scoreColor }]}>/100</Text>
            </View>
          </View>

          {parsedConcerns.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Regulatory & Health Flags</Text>
              {parsedConcerns.map((concern, idx) => (
                <View key={`concern-${idx}`} style={styles.regCard}>
                  <View style={styles.regIcon}>
                    <Ionicons name="warning" size={20} color={Colors.status.concern} />
                  </View>
                  <View style={styles.regContent}>
                    <Text style={styles.regAgency}>{concern.source} • {concern.severity}</Text>
                    <Text style={styles.regIngredient}>{concern.ingredient}</Text>
                    <Text style={styles.regDetails}>{concern.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Beneficial Ingredients ({parsedBenefits.length})</Text>
            <View style={styles.ingredientsList}>
              {parsedBenefits.length === 0 ? (
                <View style={{ padding: Spacing.md }}>
                  <Text style={{ color: Colors.text.secondary }}>No notable benefits detected.</Text>
                </View>
              ) : (
                parsedBenefits.map((benefit, idx) => {
                  const isExpanded = expandedRow === benefit.ingredient;
                  
                  return (
                    <View key={`benefit-${idx}`} style={styles.ingItemWrap}>
                      <Pressable 
                        style={styles.ingRow}
                        onPress={() => setExpandedRow(isExpanded ? null : benefit.ingredient)}
                      >
                        <View style={[styles.statusDot, { backgroundColor: Colors.status.favorable }]} />
                        <Text style={styles.ingName}>{benefit.ingredient}</Text>
                        <Text style={[styles.ingScore, { color: Colors.status.favorable }]}>Safe</Text>
                        <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.gray[400]} style={{ marginLeft: 8 }} />
                      </Pressable>
                      
                      {isExpanded && (
                        <View style={styles.ingDetails}>
                          <Text style={styles.ingDetailsText}>
                            {benefit.description} (Evidence: {benefit.evidenceLevel})
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })
              )}
            </View>
          </View>
          
          <DisclaimerBanner />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background.primary },
  container: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background.primary },
  loadingText: { marginTop: Spacing.md, fontSize: Typography.fontSize.base, color: Colors.text.secondary, fontWeight: '500' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.base, paddingTop: Platform.OS === 'android' ? Spacing.xl : Spacing.md, paddingBottom: Spacing.sm, backgroundColor: Colors.background.primary, borderBottomWidth: 1, borderBottomColor: Colors.border.subtle },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.text.primary },
  backBtn: { padding: 4 },
  actionBtn: { padding: 4 },
  scrollContent: { paddingBottom: Spacing['4xl'] },
  heroSection: { flexDirection: 'row', alignItems: 'center', padding: Spacing.xl, backgroundColor: Colors.background.primary, borderBottomWidth: 1, borderBottomColor: Colors.border.default },
  heroContent: { flex: 1, paddingRight: Spacing.md },
  productCategory: { fontSize: 12, fontWeight: '600', color: Colors.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  productName: { fontSize: Typography.fontSize['2xl'], fontWeight: '800', color: Colors.text.primary, lineHeight: 32 },
  verdictText: { fontSize: 16, fontWeight: '700', marginTop: 8 },
  scoreCircle: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 4, ...Shadows.md },
  scoreText: { fontSize: 32, fontWeight: '900', lineHeight: 36 },
  scoreSub: { fontSize: 12, fontWeight: '700', opacity: 0.8 },
  section: { paddingHorizontal: Spacing.base, paddingTop: Spacing.xl },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.text.primary, marginBottom: Spacing.md },
  regCard: { flexDirection: 'row', backgroundColor: Colors.status.concernBg, padding: Spacing.md, borderRadius: BorderRadius.lg, marginBottom: Spacing.sm, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' },
  regIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  regContent: { flex: 1 },
  regAgency: { fontSize: 12, fontWeight: '700', color: Colors.status.concern, marginBottom: 2 },
  regIngredient: { fontSize: 14, fontWeight: '600', color: Colors.text.primary, marginBottom: 4 },
  regDetails: { fontSize: 12, color: Colors.text.secondary, lineHeight: 16 },
  ingredientsList: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border.default, overflow: 'hidden', ...Shadows.sm },
  ingItemWrap: { borderBottomWidth: 1, borderBottomColor: Colors.border.subtle },
  ingRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, backgroundColor: Colors.white },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: Spacing.md },
  ingName: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.text.primary },
  ingScore: { fontSize: 14, fontWeight: '700' },
  ingDetails: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, paddingTop: 4, paddingLeft: 42, backgroundColor: Colors.gray[50] },
  ingDetailsText: { fontSize: 13, color: Colors.text.secondary, lineHeight: 20 }
});