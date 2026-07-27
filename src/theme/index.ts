import { colors } from './colors';
import { fonts, fontSizes } from './typography';
import { spacing, borderRadius } from './spacing';

export const theme = {
  colors,
  fonts,
  fontSizes,
  spacing,
  borderRadius,
};

export type Theme = typeof theme;
export { colors, fonts, fontSizes, spacing, borderRadius };
