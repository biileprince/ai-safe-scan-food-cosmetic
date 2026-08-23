/**
 * SafeScan Design System — Theme Constants
 * 
 * Dark-mode-first design with glassmorphism, vibrant gradient accents.
 * Emerald → Teal for "safe" / Amber → Red for "concern"
 */

// ─── Color Palette ──────────────────────────────────────────────

export const Colors = {
  // Core backgrounds
  background: {
    primary: '#0A0E1A',       // Deep navy-black
    secondary: '#111827',     // Slightly lighter navy
    tertiary: '#1A1F2E',      // Card-level dark
    elevated: '#1F2537',      // Elevated surfaces
  },

  // Glass surfaces
  glass: {
    background: 'rgba(255, 255, 255, 0.05)',
    backgroundHover: 'rgba(255, 255, 255, 0.08)',
    border: 'rgba(255, 255, 255, 0.10)',
    borderLight: 'rgba(255, 255, 255, 0.15)',
    overlay: 'rgba(10, 14, 26, 0.85)',
  },

  // Text
  text: {
    primary: '#F9FAFB',       // Pure white-ish
    secondary: '#9CA3AF',     // Muted grey
    tertiary: '#6B7280',      // Even more muted
    inverse: '#0A0E1A',       // Dark text on light surfaces
    link: '#60A5FA',          // Blue links
  },

  // Assessment status colors
  status: {
    favorable: '#10B981',     // Emerald green
    favorableLight: '#34D399',
    favorableDim: 'rgba(16, 185, 129, 0.15)',

    caution: '#F59E0B',       // Amber
    cautionLight: '#FBBF24',
    cautionDim: 'rgba(245, 158, 11, 0.15)',

    concern: '#EF4444',       // Red
    concernLight: '#F87171',
    concernDim: 'rgba(239, 68, 68, 0.15)',

    neutral: '#6B7280',       // Grey
    neutralLight: '#9CA3AF',
    neutralDim: 'rgba(107, 114, 128, 0.15)',

    insufficient: '#8B5CF6',  // Purple
    insufficientLight: '#A78BFA',
    insufficientDim: 'rgba(139, 92, 246, 0.15)',
  },

  // Brand accent
  accent: {
    primary: '#6366F1',       // Indigo
    primaryLight: '#818CF8',
    secondary: '#8B5CF6',     // Purple
    secondaryLight: '#A78BFA',
    teal: '#14B8A6',
    tealLight: '#2DD4BF',
  },

  // Semantic
  semantic: {
    benefit: '#10B981',       // Green — positive findings
    benefitBg: 'rgba(16, 185, 129, 0.12)',
    risk: '#EF4444',          // Red — concerns
    riskBg: 'rgba(239, 68, 68, 0.12)',
    allergen: '#F59E0B',      // Amber — allergens
    allergenBg: 'rgba(245, 158, 11, 0.12)',
    info: '#3B82F6',          // Blue — informational
    infoBg: 'rgba(59, 130, 246, 0.12)',
  },

  // Borders & dividers
  border: {
    default: 'rgba(255, 255, 255, 0.08)',
    light: 'rgba(255, 255, 255, 0.12)',
    focus: '#6366F1',
  },

  // White & black
  white: '#FFFFFF',
  black: '#000000',
} as const;


// ─── Gradients ──────────────────────────────────────────────────

export const Gradients = {
  // Assessment gradients
  favorable: ['#10B981', '#14B8A6'],       // Emerald → Teal
  caution: ['#F59E0B', '#F97316'],         // Amber → Orange
  concern: ['#EF4444', '#DC2626'],         // Red → Dark Red
  insufficient: ['#8B5CF6', '#6366F1'],    // Purple → Indigo

  // Brand gradients
  primary: ['#6366F1', '#8B5CF6'],         // Indigo → Purple
  accent: ['#14B8A6', '#06B6D4'],          // Teal → Cyan
  premium: ['#6366F1', '#EC4899'],         // Indigo → Pink

  // Background gradients
  backgroundRadial: ['#0A0E1A', '#111827', '#0A0E1A'],
  cardShimmer: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0)'],

  // Scan progress
  scanActive: ['#6366F1', '#14B8A6', '#10B981'],
  scanProcessing: ['#8B5CF6', '#6366F1', '#3B82F6'],
} as const;


// ─── Typography ─────────────────────────────────────────────────

export const Typography = {
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    displayRegular: 'Outfit_400Regular',
    displayMedium: 'Outfit_500Medium',
    displaySemibold: 'Outfit_600SemiBold',
    displayBold: 'Outfit_700Bold',
  },

  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 34,
    '4xl': 42,
    hero: 52,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },

  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1.0,
    widest: 2.0,
  },
} as const;


// ─── Spacing ────────────────────────────────────────────────────

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
} as const;


// ─── Border Radius ──────────────────────────────────────────────

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;


// ─── Shadows ────────────────────────────────────────────────────

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  }),
} as const;


// ─── Animation Timings ──────────────────────────────────────────

export const Animation = {
  fast: 150,
  normal: 300,
  slow: 500,
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  springBouncy: {
    damping: 10,
    stiffness: 180,
    mass: 0.8,
  },
} as const;


// ─── Layout ─────────────────────────────────────────────────────

export const Layout = {
  screenPadding: 20,
  cardPadding: 16,
  maxContentWidth: 428,    // iPhone 14 Pro Max width
  tabBarHeight: 80,
  headerHeight: 56,
} as const;
