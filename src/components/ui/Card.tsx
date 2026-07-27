import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle, StyleProp } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { colors } from '../../theme/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  glass?: boolean;
  glow?: boolean;
  glowColor?: string;
  onPress?: () => void;
}

export function Card({
  children,
  style,
  glass = true,
  glow = false,
  glowColor = colors.primary,
  onPress,
}: CardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const containerStyle = [
    styles.card,
    glow && {
      borderColor: glowColor,
      shadowColor: glowColor,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
      elevation: 6,
    },
    style,
  ];

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.97, { damping: 15 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
        style={[containerStyle, animatedStyle]}
      >
        {glass ? (
          <BlurView intensity={25} tint="dark" style={styles.blurInner}>
            {children}
          </BlurView>
        ) : (
          children
        )}
      </AnimatedPressable>
    );
  }

  return (
    <View style={containerStyle}>
      {glass ? (
        <BlurView intensity={25} tint="dark" style={styles.blurInner}>
          {children}
        </BlurView>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  blurInner: {
    padding: 16,
    backgroundColor: colors.surfaceGlass,
  },
});
