import React from 'react';
import { Text, StyleSheet, Pressable, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'ghost' | 'glow' | 'glass';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function Button({
  children,
  onPress,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.5 : 1,
  }));

  const getVariantStyles = (): { bg: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'destructive':
        return {
          bg: { backgroundColor: colors.danger },
          text: { color: '#ffffff' },
        };
      case 'outline':
        return {
          bg: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.borderHover },
          text: { color: colors.foreground },
        };
      case 'ghost':
        return {
          bg: { backgroundColor: 'transparent' },
          text: { color: colors.slate[300] },
        };
      case 'glass':
        return {
          bg: { backgroundColor: colors.surfaceGlass, borderWidth: 1, borderColor: colors.borderGlass },
          text: { color: colors.primary },
        };
      case 'glow':
      case 'default':
      default:
        return {
          bg: { backgroundColor: colors.primary },
          text: { color: '#030712' },
        };
    }
  };

  const getSizeStyles = (): { button: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return { button: { paddingHorizontal: 12, height: 36 }, text: { fontSize: 13 } };
      case 'lg':
        return { button: { paddingHorizontal: 24, height: 50 }, text: { fontSize: 16 } };
      case 'icon':
        return { button: { width: 42, height: 42, paddingHorizontal: 0 }, text: { fontSize: 14 } };
      case 'default':
      default:
        return { button: { paddingHorizontal: 18, height: 44 }, text: { fontSize: 14 } };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  const content = (
    <>
      {loading ? (
        <ActivityIndicator color={variant === 'default' ? '#030712' : colors.primary} />
      ) : (
        <>
          {icon}
          {typeof children === 'string' ||
          typeof children === 'number' ||
          (Array.isArray(children) &&
            children.every(
              (c) => typeof c === 'string' || typeof c === 'number' || c === null || c === undefined
            )) ? (
            <Text style={[styles.btnText, vStyles.text, sStyles.text, textStyle]}>
              {children}
            </Text>
          ) : (
            children
          )}
        </>
      )}
    </>
  );

  if (variant === 'glow') {
    return (
      <AnimatedPressable
        onPress={disabled || loading ? undefined : onPress}
        onPressIn={() => { if (!disabled) scale.value = withSpring(0.96); }}
        onPressOut={() => { if (!disabled) scale.value = withSpring(1); }}
        style={[animatedStyle, style]}
      >
        <LinearGradient
          colors={['#00e5ff', '#8b5cf6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.btnContainer, sStyles.button]}
        >
          {content}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={disabled || loading ? undefined : onPress}
      onPressIn={() => { if (!disabled) scale.value = withSpring(0.96); }}
      onPressOut={() => { if (!disabled) scale.value = withSpring(1); }}
      style={[styles.btnContainer, vStyles.bg, sStyles.button, animatedStyle, style]}
    >
      {content}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnText: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
