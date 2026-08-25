/**
 * SafeScan — Button Component
 * 
 * Reusable button with multiple variants: primary, secondary, outline, danger.
 */

import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: IoniconsName;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const sizeMap = {
    sm: { height: 36, px: Spacing.md, fontSize: Typography.fontSize.sm, iconSize: 16 },
    md: { height: 48, px: Spacing.xl, fontSize: Typography.fontSize.base, iconSize: 18 },
    lg: { height: 56, px: Spacing['2xl'], fontSize: Typography.fontSize.md, iconSize: 20 },
  };

  const variantStyles: Record<string, { bg: string; text: string; border?: string }> = {
    primary: { bg: Colors.primary[600], text: Colors.white },
    secondary: { bg: Colors.gray[100], text: Colors.text.primary },
    outline: { bg: 'transparent', text: Colors.primary[600], border: Colors.primary[600] },
    danger: { bg: Colors.semantic.riskBg, text: Colors.status.concern, border: Colors.status.concern },
    ghost: { bg: 'transparent', text: Colors.text.secondary },
  };

  const s = sizeMap[size];
  const v = variantStyles[variant];

  const buttonStyle: ViewStyle[] = [
    styles.base,
    {
      height: s.height,
      paddingHorizontal: s.px,
      backgroundColor: v.bg,
    },
    v.border ? { borderWidth: 1, borderColor: v.border } : {},
    variant === 'primary' ? Shadows.md : {},
    fullWidth ? { alignSelf: 'stretch' as const } : {},
    isDisabled ? styles.disabled : {},
    style || {},
  ];

  const textStyle: TextStyle = {
    fontSize: s.fontSize,
    fontWeight: '600',
    color: v.text,
  };

  const iconColor = v.text;

  return (
    <Pressable
      style={({ pressed }) => [
        ...buttonStyle,
        pressed && !isDisabled ? styles.pressed : {},
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.text} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={s.iconSize} color={iconColor} />
          )}
          <Text style={textStyle}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={s.iconSize} color={iconColor} />
          )}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
