/**
 * SafeScan — Scan Tab
 * 
 * Main scan screen — live camera capture with overlay + gallery upload option.
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
import { needsCompression, compressImage } from '../../utils/imageHelpers';

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
      
      // Check if compression is needed (mock for now, returns original URI)
      const needsComp = await needsCompression(uri);
      const processedUri = needsComp ? await compressImage(uri) : uri;
      
      const fileName = `scan_${Date.now()}.jpg`;
      const reportId = await startScan(user.$id, processedUri, fileName);
      router.push(`/report/${reportId}`);
    } catch (err) {
      console.error('Failed to process image:', err);
    }
  };

  const handleTakePhoto = async () => {
    if (!cameraRef.current || isCapturing) return;
    
    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });
      
      if (photo?.uri) {
        await processAndUpload(photo.uri);
      }
    } catch (err) {
      console.error('Failed to take photo:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const handlePickImage = async () => {
    if (isPicking) return;
    const uri = await pickImage();
    if (uri) {
      await processAndUpload(uri);
    }
  };

  // If permissions are pending
  if (isPending) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.accent.primary} />
          <Text style={styles.loadingText}>Initializing camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // If permission denied
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centerContent}>
          <Ionicons name="camera-outline" size={48} color={Colors.status.concern} />
          <Text style={styles.errorTitle}>Camera Access Denied</Text>
          <Text style={styles.errorSubtitle}>
            We need camera access to scan product labels.
          </Text>
          <Pressable style={styles.permissionButton} onPress={checkAndRequestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </Pressable>
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <Pressable style={styles.secondaryButton} onPress={handlePickImage}>
            <Ionicons name="images-outline" size={24} color={Colors.text.secondary} />
            <Text style={styles.secondaryLabel}>Choose from Gallery instead</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

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

      {/* Camera viewport */}
      <View style={styles.viewfinderContainer}>
        <View style={styles.viewfinder}>
          <CameraView 
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            facing="back"
          />
          
          {/* Overlay mask */}
          <View style={styles.overlayMask}>
            {/* Corner guides */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
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
          style={({ pressed }) => [
            styles.captureButton, 
            (pressed || isCapturing) && styles.captureButtonPressed
          ]}
          onPress={handleTakePhoto}
          disabled={isCapturing}
        >
          <View style={styles.captureButtonInner}>
            {isCapturing ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Ionicons name="camera" size={28} color={Colors.white} />
            )}
          </View>
        </Pressable>

        <View style={styles.secondaryActions}>
          <Pressable
            style={({ pressed }) => [styles.secondaryButtonAction, pressed && { opacity: 0.7 }]}
            onPress={handlePickImage}
            disabled={isCapturing || isPicking}
          >
            <Ionicons name="images-outline" size={24} color={Colors.text.secondary} />
            <Text style={styles.secondaryLabelAction}>Gallery</Text>
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
  errorTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  errorSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: Colors.accent.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
  },
  permissionButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginVertical: Spacing.xl,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.default,
  },
  dividerText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.glass.background,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  secondaryLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    fontWeight: '500',
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
  overlayMask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    borderWidth: 40,
    borderColor: 'rgba(10, 14, 26, 0.4)', // Dark overlay around the edges
    borderRadius: BorderRadius['2xl'],
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
  secondaryButtonAction: {
    alignItems: 'center',
    gap: 4,
  },
  secondaryLabelAction: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
});
