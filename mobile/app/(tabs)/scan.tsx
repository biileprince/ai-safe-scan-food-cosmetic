import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Alert, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Animated, { useAnimatedStyle, withRepeat, withTiming, Easing, useSharedValue } from 'react-native-reanimated';
import { useAuthStore } from '../../stores/useAuthStore';
import { useScanStore } from '../../stores/useScanStore';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();
  const { startScan } = useScanStore();
  const scanLinePos = useSharedValue(0);

  useEffect(() => {
    scanLinePos.value = withRepeat(
      withTiming(height * 0.5, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLinePos.value }]
  }));

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.iconWrap}>
          <Ionicons name="camera" size={48} color={Colors.primary[600]} />
        </View>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionDesc}>
          SafeScan needs camera access to read ingredient labels and product barcodes.
        </Text>
        <Pressable style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Allow Access</Text>
        </Pressable>
      </View>
    );
  }

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

  const processImage = async (uri: string) => {
    if (!user?.$id) {
      Alert.alert("Authentication Required", "Please log in to scan products.");
      return;
    }

    setIsScanning(true);
    
    try {
      const fileName = `scan_${Date.now()}.jpg`;
      const reportId = await startScan(user.$id, uri, fileName);
      setIsScanning(false);
      router.push(`/report/${reportId}`);
    } catch (error) {
      setIsScanning(false);
      Alert.alert("Scan Failed", "There was an error uploading the scan. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={StyleSheet.absoluteFill} 
        facing="back"
        onBarcodeScanned={isScanning ? undefined : (res) => {
          // If we want barcode scanning later
          // console.log(res.data);
        }}
      />
      
      {/* Overlay */}
      <View style={styles.overlay}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="close" size={28} color="#FFF" />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="flash-outline" size={24} color="#FFF" />
          </Pressable>
        </View>

        {/* Scan Frame */}
        <View style={styles.frameContainer}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
            
            {isScanning && (
              <Animated.View style={[styles.scanLine, scanLineStyle]} />
            )}
          </View>
          <Text style={styles.instructionText}>
            {isScanning ? 'Analyzing ingredients...' : 'Align ingredients or barcode in frame'}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controlsRow}>
          <Pressable onPress={handlePickImage} style={styles.galleryBtn}>
            <Ionicons name="images" size={24} color="#FFF" />
          </Pressable>
          
          <Pressable 
            style={[styles.captureBtn, isScanning && styles.captureBtnDisabled]}
            disabled={isScanning}
            onPress={() => {
              // Usually we'd take a picture with the camera ref here.
              // We'll mock a generic image uri upload if they just press the button without picking image.
              Alert.alert("Hint", "Use the gallery icon to pick an image for now in this environment, or test on a physical device.");
            }}
          >
            <View style={styles.captureBtnInner} />
          </Pressable>
          
          <View style={styles.spacer} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  permissionContainer: { flex: 1, backgroundColor: Colors.background.primary, alignItems: 'center', justifyContent: 'center', padding: Spacing['2xl'] },
  iconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary[50], alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl },
  permissionTitle: { fontSize: Typography.fontSize.xl, fontWeight: '700', color: Colors.text.primary, marginBottom: Spacing.sm },
  permissionDesc: { fontSize: Typography.fontSize.base, color: Colors.text.secondary, textAlign: 'center', lineHeight: 24, marginBottom: Spacing['2xl'] },
  permissionBtn: { backgroundColor: Colors.primary[600], paddingHorizontal: 32, paddingVertical: 14, borderRadius: BorderRadius.full },
  permissionBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', padding: Spacing.xl, justifyContent: 'space-between' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: Platform.OS === 'ios' ? 40 : 20 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  frameContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scanFrame: { width: width * 0.75, height: height * 0.45, position: 'relative', overflow: 'hidden' },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: '#FFF', borderWidth: 4 },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 16 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 16 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 16 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 16 },
  scanLine: { width: '100%', height: 2, backgroundColor: Colors.primary[400], position: 'absolute', top: 0, shadowColor: Colors.primary[400], shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 10, elevation: 5 },
  instructionText: { color: '#FFF', fontSize: 16, fontWeight: '600', marginTop: Spacing['2xl'], textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  controlsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 40 },
  galleryBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  captureBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  captureBtnDisabled: { opacity: 0.5 },
  captureBtnInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFF' },
  spacer: { width: 56 }
});
