/**
 * SafeScan — Welcome Screen
 * 
 * Clean, professional onboarding with smooth animations and imagery.
 */

import React, { useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeInUp,
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { Image } from 'expo-image';

const { width, height } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    id: '1',
    title: "Know what's in your products.",
    subtitle: "Scan any food or cosmetic label and get instant, evidence-based safety insights.",
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80',
    icon: 'scan-outline'
  },
  {
    id: '2',
    title: "Backed by Science.",
    subtitle: "Cross-references ingredients against FDA, EU, NAFDAC, and SAHPRA regulations.",
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80',
    icon: 'shield-checkmark-outline'
  },
  {
    id: '3',
    title: "Personalized Alerts.",
    subtitle: "Set up your health profile to get flagged for your specific allergies and dietary restrictions.",
    image: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=800&q=80',
    icon: 'person-outline'
  }
];

export default function WelcomeScreen() {
  const router = useRouter();
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setCurrentIndex(Math.round(index));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Animated.View entering={FadeIn.duration(800)} style={styles.carouselContainer}>
        <Animated.ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleScroll}
          bounces={false}
        >
          {ONBOARDING_DATA.map((item, index) => {
            return (
              <View key={item.id} style={styles.slide}>
                <View style={styles.imageContainer}>
                  <Image 
                    source={{ uri: item.image }} 
                    style={styles.image} 
                    contentFit="cover"
                    transition={500}
                  />
                  <View style={styles.overlay} />
                </View>
                
                <View style={styles.slideContent}>
                  <View style={styles.iconWrap}>
                    <Ionicons name={item.icon as any} size={28} color={Colors.primary[600]} />
                  </View>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.subtitle}>{item.subtitle}</Text>
                </View>
              </View>
            );
          })}
        </Animated.ScrollView>
      </Animated.View>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {ONBOARDING_DATA.map((_, i) => {
          const animatedDotStyle = useAnimatedStyle(() => {
            const dotWidth = interpolate(
              scrollX.value,
              [(i - 1) * width, i * width, (i + 1) * width],
              [8, 24, 8],
              Extrapolate.CLAMP
            );
            const opacity = interpolate(
              scrollX.value,
              [(i - 1) * width, i * width, (i + 1) * width],
              [0.3, 1, 0.3],
              Extrapolate.CLAMP
            );
            return { width: dotWidth, opacity };
          });

          return (
            <Animated.View key={i} style={[styles.dot, animatedDotStyle]} />
          );
        })}
      </View>

      {/* Bottom Action Area */}
      <Animated.View entering={FadeInUp.delay(500).duration(600)} style={styles.bottomContainer}>
        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.secondaryButtonText}>I already have an account</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  carouselContainer: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'flex-start',
  },
  imageContainer: {
    width,
    height: height * 0.65, // Use 65% of screen height for image
    position: 'absolute',
    top: 0,
    left: 0,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  slideContent: {
    marginTop: height * 0.45, // Push content down
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.heavy,
    color: Colors.white,
    lineHeight: 42,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 200,
    width: '100%',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary[400],
  },
  bottomContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing['2xl'],
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24, // Overlap the carousel
    gap: Spacing.md,
  },
  primaryButton: {
    height: 56,
    backgroundColor: Colors.primary[600],
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  primaryButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
  },
  secondaryButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.gray[100],
  },
  secondaryButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
