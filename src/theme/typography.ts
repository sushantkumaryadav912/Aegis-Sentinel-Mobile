import { Platform } from 'react-native';

export const fonts = {
  sans: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'Inter_400Regular',
  }),
  sansMedium: Platform.select({
    ios: 'System',
    android: 'sans-serif-medium',
    default: 'Inter_500Medium',
  }),
  sansBold: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'Inter_700Bold',
  }),
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'JetBrainsMono_400Regular',
  }),
  monoBold: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'JetBrainsMono_700Bold',
  }),
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
  } as const,
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};
