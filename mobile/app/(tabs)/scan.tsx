/**
 * SafeScan — Scan Tab (with real icons)
 */

import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useScanStore } from '../../stores/useScanStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ScanScreen() {
  const { user } = useAuthStore();
  const { phase, setCapturedImage, startScan } = useScanStore();
  const router = useRouter();

  const handleTakePhoto = () => {
    handlePickImage();
  };

  const handlePickImage = async () => {
    try {
      const ImagePicker = require('expo-image-picker');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setCapturedImage(asset.uri);

        if (user) {
          const fileName = asset.fileName || `scan_${Date.now()}.jpg`;
          const reportId = await startScan(user.$id, asset.uri, fileName);
          router.push(`/report/${reportId}`);
        }
      }
    } catch (err) {
      console.error('Image picker error:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greetingRow}>
          <Ionicons name="hand-right-outline" size={18} color={Colors.text.secondary} />
          <Text style={styles.greeting}>
            Hello, {user?.name?.split(' ')[0] || 'there'}
          </Text>
        </View>
        <Text style={styles.headerTitle}>Scan a Product</Text>
        <Text style={styles.headerSubtitle}>
          Photograph a food or cosmetic label to analyze its ingredients
        </Text>
      </View>

      {/* Camera viewport placeholder */}
      <View style={styles.viewfinderContainer}>
        <View style={styles.viewfinder}>
          {/* Corner guides */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />

          {/* Center content */}
          <View style={styles.viewfinderContent}>
            <View style={styles.scanIconWrapper}>
              <Ionicons name="scan-outline" size={48} color={Colors.accent.primaryLight} />
            </View>
            <Text style={styles.viewfinderText}>Position the ingredient list{'\n'}within the frame</Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsRow}>
          <View style={styles.tip}>
            <Ionicons name="bulb-outline" size={14} color={Colors.accent.tealLight} />
            <Text style={styles.tipText}>Good lighting</Text>
          </View>
          <View style={styles.tip}>
            <Ionicons name="resize-outline" size={14} color={Colors.accent.tealLight} />
            <Text style={styles.tipText}>Flat surface</Text>
          </View>
          <View style={styles.tip}>
            <Ionicons name="search-outline" size={14} color={Colors.accent.tealLight} />
            <Text style={styles.tipText}>Clear text</Text>
          </View>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.captureButton, pressed && styles.captureButtonPressed]}
          onPress={handleTakePhoto}
        >
          <View style={styles.captureButtonInner}>
            <Ionicons name="camera" size={28} color={Colors.white} />
          </View>
        </Pressable>

        <View style={styles.secondaryActions}>
          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && { opacity: 0.7 }]}
            onPress={handlePickImage}
          >
            <Ionicons name="images-outline" size={24} color={Colors.text.secondary} />
            <Text style={styles.secondaryLabel}>Gallery</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    paddingTop: Spacing.base,
    paddingBottom: Spacing.lg,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  greeting: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '700',
    color: Colors.text.primary,
    letterSpacing: Typography.letterSpacing.tight,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
  },
  viewfinderContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  viewfinder: {
    aspectRatio: 3 / 4,
    maxHeight: 400,
    backgroundColor: Colors.glass.background,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    borderColor: Colors.glass.border,
    alignSelf: 'center',
    width: width - 80,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: Colors.accent.primary,
  },
  cornerTL: {
    top: 16,
    left: 16,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: 16,
    right: 16,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: 16,
    left: 16,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: 16,
    right: 16,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  viewfinderContent: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  scanIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.glass.backgroundHover,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinderText: {
    textAlign: 'center',
    color: Colors.text.tertiary,
    fontSize: Typography.fontSize.sm,
    lineHeight: 20,
  },
  tipsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.base,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.glass.background,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  tipText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  actions: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
    gap: Spacing.lg,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  captureButtonPressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.9,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: Spacing.xl,
  },
  secondaryButton: {
    alignItems: 'center',
    gap: 4,
  },
  secondaryLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
});
