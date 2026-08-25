/**
 * SafeScan — Scan Tab
 */

import { useState, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CameraView } from 'expo-camera';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useScanStore } from '../../stores/useScanStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useRouter } from 'expo-router';
import { useCamera } from '../../hooks/useCamera';
import { useImagePicker } from '../../hooks/useImagePicker';

const { width } = Dimensions.get('window');

export default function ScanScreen() {
  const { user } = useAuthStore();
  const { setCapturedImage, startScan } = useScanStore();
  const router = useRouter();

  const cameraRef = useRef<CameraView>(null);
  const { hasPermission, checkAndRequestPermission, isPending } = useCamera();
  const { pickImage, isPicking } = useImagePicker();

  const [isCapturing, setIsCapturing] = useState(false);

  const processAndUpload = async (uri: string) => {
    if (!user) return;
    try {
      setCapturedImage(uri);
      const fileName = `scan_${Date.now()}.jpg`;
      const reportId = await startScan(user.$id, uri, fileName);
      router.push(`/report/${reportId}`);
    } catch (err) {
      console.error('Failed to process image:', err);
    }
  };

  const handleTakePhoto = async () => {
    if (!cameraRef.current || isCapturing) return;
    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (photo?.uri) await processAndUpload(photo.uri);
    } catch (err) {
      console.error('Failed to take photo:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const handlePickImage = async () => {
    if (isPicking) return;
    const uri = await pickImage();
    if (uri) await processAndUpload(uri);
  };

  // Permission pending
  if (isPending) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.primary[600]} />
          <Text style={styles.loadingText}>Initializing camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Permission denied
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centerContent}>
          <View style={styles.permDeniedIcon}>
            <Ionicons name="camera-outline" size={32} color={Colors.gray[400]} />
          </View>
          <Text style={styles.permTitle}>Camera Access Required</Text>
          <Text style={styles.permSubtitle}>
            We need camera access to scan product labels. You can also upload from your gallery.
          </Text>
          <Pressable style={styles.greenButton} onPress={checkAndRequestPermission}>
            <Text style={styles.greenButtonText}>Grant Permission</Text>
          </Pressable>
          <Pressable style={styles.outlineButton} onPress={handlePickImage}>
            <Ionicons name="images-outline" size={18} color={Colors.primary[600]} />
            <Text style={styles.outlineButtonText}>Choose from Gallery</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scan Product</Text>
        <Text style={styles.headerSubtitle}>
          Point your camera at the ingredient list on any food or cosmetic product.
        </Text>
      </View>

      {/* Camera */}
      <View style={styles.cameraContainer}>
        <View style={styles.cameraView}>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing="back"
          />
          {/* Corner guides */}
          <View style={[styles.corner, styles.cTL]} />
          <View style={[styles.corner, styles.cTR]} />
          <View style={[styles.corner, styles.cBL]} />
          <View style={[styles.corner, styles.cBR]} />
        </View>

        {/* Tips */}
        <View style={styles.tipsRow}>
          <Tip icon="sunny-outline" text="Good lighting" />
          <Tip icon="resize-outline" text="Flat surface" />
          <Tip icon="text-outline" text="Clear text" />
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable style={styles.galleryButton} onPress={handlePickImage} disabled={isCapturing}>
          <Ionicons name="images-outline" size={22} color={Colors.gray[600]} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.captureButton, (pressed || isCapturing) && styles.capturePressed]}
          onPress={handleTakePhoto}
          disabled={isCapturing}
        >
          {isCapturing ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <View style={styles.captureInner} />
          )}
        </Pressable>

        <View style={{ width: 48 }} />
      </View>
    </SafeAreaView>
  );
}

function Tip({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.tip}>
      <Ionicons name={icon} size={14} color={Colors.primary[600]} />
      <Text style={styles.tipText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing['2xl'],
  },
  loadingText: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.base,
  },
  permDeniedIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  permTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  permSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  greenButton: {
    height: 48,
    paddingHorizontal: Spacing['2xl'],
    backgroundColor: Colors.primary[600],
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.base,
  },
  greenButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    height: 44,
    paddingHorizontal: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.primary[600],
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.sm,
  },
  outlineButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary[600],
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.base,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.heavy,
    color: Colors.text.primary,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
    lineHeight: 18,
  },
  cameraContainer: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.base,
    justifyContent: 'center',
  },
  cameraView: {
    aspectRatio: 3 / 4,
    maxHeight: 420,
    alignSelf: 'center',
    width: width - 48,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    backgroundColor: Colors.gray[900],
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: Colors.primary[500],
  },
  cTL: { top: 16, left: 16, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 6 },
  cTR: { top: 16, right: 16, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 6 },
  cBL: { bottom: 16, left: 16, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 6 },
  cBR: { bottom: 16, right: 16, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 6 },
  tipsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  tipText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary[700],
    fontWeight: Typography.fontWeight.medium,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing['2xl'],
    paddingVertical: Spacing.xl,
  },
  galleryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  capturePressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.9,
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'transparent',
  },
});
