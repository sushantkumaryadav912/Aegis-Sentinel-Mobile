import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'glow';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  customColor?: string;
  customBg?: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function Badge({
  children,
  variant = 'default',
  customColor,
  customBg,
  size = 'md',
  style,
}: BadgeProps) {
  const getVariantStyles = (): { bg: ViewStyle; text: TextStyle } => {
    if (customBg && customColor) {
      return {
        bg: { backgroundColor: customBg, borderColor: customColor },
        text: { color: customColor },
      };
    }
    switch (variant) {
      case 'destructive':
        return {
          bg: { backgroundColor: 'rgba(239, 68, 68, 0.18)', borderColor: 'rgba(239, 68, 68, 0.4)' },
          text: { color: colors.danger },
        };
      case 'warning':
        return {
          bg: { backgroundColor: 'rgba(245, 158, 11, 0.18)', borderColor: 'rgba(245, 158, 11, 0.4)' },
          text: { color: colors.warning },
        };
      case 'success':
        return {
          bg: { backgroundColor: 'rgba(16, 185, 129, 0.18)', borderColor: 'rgba(16, 185, 129, 0.4)' },
          text: { color: colors.success },
        };
      case 'outline':
        return {
          bg: { backgroundColor: 'transparent', borderColor: colors.border },
          text: { color: colors.slate[300] },
        };
      case 'secondary':
        return {
          bg: { backgroundColor: colors.muted, borderColor: 'transparent' },
          text: { color: colors.slate[300] },
        };
      case 'glow':
      case 'default':
      default:
        return {
          bg: { backgroundColor: 'rgba(0, 229, 255, 0.15)', borderColor: 'rgba(0, 229, 255, 0.4)' },
          text: { color: colors.primary },
        };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <View style={[styles.badge, vStyles.bg, size === 'sm' && styles.smBadge, style]}>
      <Text style={[styles.badgeText, vStyles.text, size === 'sm' && styles.smText]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  smBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  smText: {
    fontSize: 10,
  },
});
