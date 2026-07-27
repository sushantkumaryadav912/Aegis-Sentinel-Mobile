import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  style?: ViewStyle;
}

export function ScreenHeader({ title, subtitle, action, style }: ScreenHeaderProps) {
  return (
    <View style={[styles.headerContainer, style]}>
      <View style={styles.textColumn}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {action && <View style={styles.actionWrapper}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 12,
  },
  textColumn: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.foreground,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: colors.slate[400],
    marginTop: 2,
  },
  actionWrapper: {
    alignItems: 'flex-end',
  },
});
