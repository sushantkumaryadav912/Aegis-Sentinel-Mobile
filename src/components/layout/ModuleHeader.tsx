import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

interface AIEngine {
  label: string;
  color?: string;
}

interface ModuleHeaderProps {
  /** e.g. "SENTINEL CORE" */
  module: string;
  /** e.g. "Detection Engine" */
  category: string;
  /** e.g. "Detection AI + Correlation AI" */
  aiEngine?: string;
  /** Override the pulsing dot color */
  engineColor?: string;
  /** Optional right-hand action slot (badge, button) */
  action?: React.ReactNode;
  /** Extra bottom margin */
  compact?: boolean;
}

export function ModuleHeader({
  module,
  category,
  aiEngine,
  engineColor = colors.primary,
  action,
  compact = false,
}: ModuleHeaderProps) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(0.25, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  return (
    <View style={[styles.wrapper, compact && styles.wrapperCompact]}>
      {/* Category label row */}
      <View style={styles.categoryRow}>
        <Text style={styles.categoryLabel}>{category.toUpperCase()}</Text>
        {aiEngine && (
          <View style={styles.enginePill}>
            <Animated.View style={[styles.engineDot, { backgroundColor: engineColor }, pulseStyle]} />
            <Text style={[styles.engineLabel, { color: engineColor }]}>{aiEngine}</Text>
          </View>
        )}
      </View>

      {/* Module name + action */}
      <View style={styles.titleRow}>
        <Text style={styles.moduleTitle}>{module}</Text>
        {action && <View style={styles.actionSlot}>{action}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    gap: 4,
  },
  wrapperCompact: {
    marginBottom: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    color: colors.slate[500],
    letterSpacing: 1.5,
  },
  enginePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  engineDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  engineLabel: {
    fontFamily: fonts.mono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moduleTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 24,
    fontWeight: '800',
    color: colors.foreground,
    letterSpacing: 1,
    flex: 1,
  },
  actionSlot: {
    marginLeft: 12,
  },
});
