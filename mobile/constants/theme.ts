/**
 * SafeScan — Design System
 * 
 * Clean, professional design inspired by CLEAR app.
 * Primary: Green + White. No glassmorphism. Card-based layouts.
 */

export const Colors = {
  // ── Primary Brand ──
  primary: {
    900: '#0D3B1A',    // Darkest green (headers, nav bars)
    800: '#14532D',    // Dark green
    700: '#166534',    // Deep green
    600: '#16A34A',    // Primary action green
    500: '#22C55E',    // Bright green
    400: '#4ADE80',    // Light green
    300: '#86EFAC',    // Soft green
    200: '#BBF7D0',    // Pale green
    100: '#DCFCE7',    // Very light green
    50:  '#F0FDF4',    // Near-white green tint
  },

  // ── Neutral / Gray ──
  gray: {
    900: '#111827',
    800: '#1F2937',
    700: '#374151',
    600: '#4B5563',
    500: '#6B7280',
    400: '#9CA3AF',
    300: '#D1D5DB',
    200: '#E5E7EB',
    100: '#F3F4F6',
    50:  '#F9FAFB',
  },

  // ── Backgrounds ──
  background: {
    primary: '#FFFFFF',      // Main screen background
    secondary: '#F9FAFB',    // Slightly off-white for sections
    tertiary: '#F3F4F6',     // Card backgrounds on white
    dark: '#0D3B1A',         // Dark green header areas
    darkGradientStart: '#0D3B1A',
    darkGradientEnd: '#14532D',
  },

  // ── Text ──
  text: {
    primary: '#111827',      // Almost black — main text
    secondary: '#4B5563',    // Medium gray — descriptions
    tertiary: '#9CA3AF',     // Light gray — hints, captions
    inverse: '#FFFFFF',      // White text on dark backgrounds
    link: '#16A34A',         // Green links
  },

  // ── Borders ──
  border: {
    default: '#E5E7EB',
    subtle: '#F3F4F6',
    focus: '#16A34A',
  },

  // ── Status Colors ──
  status: {
    favorable: '#16A34A',
    favorableBg: '#F0FDF4',
    caution: '#F59E0B',
    cautionBg: '#FFFBEB',
    concern: '#EF4444',
    concernBg: '#FEF2F2',
    insufficient: '#6B7280',
    insufficientBg: '#F9FAFB',
  },

  // ── Cards ──
  card: {
    background: '#FFFFFF',
    border: '#E5E7EB',
    shadow: 'rgba(0, 0, 0, 0.06)',
    elevated: '#FFFFFF',
  },

  // ── Semantic ──
  semantic: {
    allergen: '#F59E0B',
    allergenBg: '#FFFBEB',
    riskBg: '#FEF2F2',
  },

  // ── Basic ──
  white: '#FFFFFF',
  black: '#000000',
} as const;

// ── Typography ──
export const Typography = {
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 34,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
} as const;

// ── Spacing ──
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
} as const;

// ── Border Radius ──
export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

// ── Shadows ──
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
} as const;
