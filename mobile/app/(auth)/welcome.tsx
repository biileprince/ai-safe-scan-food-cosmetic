import React, { useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Carousel } from 'react-native-reanimated-carousel'; // @ts-ignore
import Animated, { useAnimatedStyle, withTiming, withRepeat, useSharedValue, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import Button from '../../components/ui/Button';

const SLIDES = [
  {
    title: 'Point. Snap. Know.',
    desc: 'Photograph any food or cosmetic label — SafeScan takes it from there.',
    icon: 'camera-outline' as const,
  },
  {
    title: 'AI reads every ingredient',
    desc: 'Vision OCR extracts full ingredient lists in seconds — even the fine print.',
    icon: 'scan-outline' as const,
  },
  {
    title: 'Checked against real regulators',
    desc: 'Cross-referenced with NAFDAC, FDA, EU CosIng, KEBS and SAHPRA.',
    icon: 'shield-checkmark-outline' as const,
    chips: ['NAFDAC', 'FDA', 'EU CosIng', 'KEBS', 'SAHPRA'],
  },
  {
    title: 'Get a clear verdict',
    desc: 'A plain 0–100 score with the evidence behind it — no guesswork, no jargon.',
    icon: 'checkmark-circle-outline' as const,
  }
];

export default function WelcomeScreen() {
  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const carouselRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const drift1 = useSharedValue(0);
  const drift2 = useSharedValue(0);

  React.useEffect(() => {
    drift1.value = withRepeat(withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.ease) }), -1, true);
    drift2.value = withRepeat(withTiming(1, { duration: 11000, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  const glowStyle1 = useAnimatedStyle(() => ({
    transform: [
      { translateX: -14 * drift1.value },
      { translateY: 16 * drift1.value },
      { scale: 1 + 0.12 * drift1.value },
    ],
  }));

  const glowStyle2 = useAnimatedStyle(() => ({
    transform: [
      { translateX: 12 * drift2.value },
      { translateY: -14 * drift2.value },
      { scale: 1 + 0.08 * drift2.value },
    ],
  }));

  const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
    return (
      <View style={styles.slideContainer}>
        <Animated.View style={styles.iconContainer}>
          <Ionicons name={item.icon} size={34} color={Colors.primary[300]} />
        </Animated.View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc}>{item.desc}</Text>
        {item.chips && (
          <View style={styles.chipsContainer}>
            {item.chips.map(c => (
              <View key={c} style={styles.chip}>
                <Text style={styles.chipText}>{c}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#0D3B1A', '#14532D', '#111827']}
          start={{ x: 0.18, y: -0.1 }}
          end={{ x: 1.2, y: 0.9 }}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View style={[styles.glow1, glowStyle1]} />
        <Animated.View style={[styles.glow2, glowStyle2]} />
      </View>

      <View style={styles.skipContainer}>
        <Pressable 
          onPress={() => carouselRef.current?.scrollTo({ index: SLIDES.length - 1, animated: true })}
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      <View style={styles.carouselContainer}>
        {width > 0 && (
          <Carousel
            ref={carouselRef}
            width={width}
            height={height * 0.45}
            data={SLIDES}
            autoPlay={true}
            autoPlayInterval={3400}
            loop={true}
            onSnapToItem={(index: number) => setActiveIndex(index)}
            renderItem={renderItem}
            panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
          />
        )}
      </View>

      <View style={styles.paginationContainer}>
        {SLIDES.map((_, i) => (
          <View 
            key={i} 
            style={[styles.dot, i === activeIndex ? styles.activeDot : styles.inactiveDot]}
          />
        ))}
      </View>

      <View style={styles.actionContainer}>
        {/* @ts-ignore */}
        <Button label="Get started" onPress={() => router.push('/register')} style={{ marginTop: 24 }} />
        <Pressable onPress={() => router.push('/login')} style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already scanning with us? <Text style={styles.loginTextBold}>Log in</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    overflow: 'hidden',
  },
  glow1: {
    position: 'absolute',
    top: -50,
    right: -60,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(22, 163, 74, 0.45)',
  },
  glow2: {
    position: 'absolute',
    bottom: 120,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
  },
  skipContainer: {
    paddingTop: 56,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
    zIndex: 10,
  },
  skipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '600',
    fontSize: 11.5,
  },
  carouselContainer: {
    flex: 1,
    marginTop: 32,
    zIndex: 10,
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  iconContainer: {
    width: 84,
    height: 84,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.xl,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  desc: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 210,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chipText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 9.5,
    fontWeight: '700',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 24,
    marginBottom: 20,
    zIndex: 10,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 20,
    backgroundColor: Colors.primary[500],
  },
  inactiveDot: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  actionContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    zIndex: 10,
  },
  loginContainer: {
    marginTop: 16,
    paddingVertical: 8,
  },
  loginText: {
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    fontSize: 11.5,
  },
  loginTextBold: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

