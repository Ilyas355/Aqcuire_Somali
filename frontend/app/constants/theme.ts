import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#22C55E',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#22C55E',
  },
  dark: {
    text: '#FFFFFF',
    background: '#0A0A0A',
    tint: '#22C55E',
    icon: '#6B7280',
    tabIconDefault: '#6B7280',
    tabIconSelected: '#22C55E',
  },
};

export const AppColors = {
  // backgrounds
  background: '#080B0A',
  surface0:   '#0D1110',
  surface1:   '#131918',
  surface2:   '#1A2120',
  surface3:   '#222B2A',

  // cards / borders
  card:   '#131918',
  border: 'rgba(255,255,255,0.08)',

  // primary green
  primary:      '#1DB954',
  primaryMuted: 'rgba(29,185,84,0.14)',
  primaryGlow:  'rgba(29,185,84,0.38)',

  // purple
  purple:       '#8B5CF6',
  purpleLight:  '#b07ef8',
  purpleMuted:  'rgba(139,92,246,0.14)',
  purpleAlpha06: 'rgba(139,92,246,0.06)',
  purpleAlpha18: 'rgba(139,92,246,0.18)',
  purpleAlpha20: 'rgba(139,92,246,0.20)',
  purpleAlpha24: 'rgba(139,92,246,0.24)',
  purpleAlpha30: 'rgba(139,92,246,0.30)',

  // orange (streak)
  orange:      '#F5A623',
  orangeMuted: 'rgba(245,166,35,0.14)',

  // blue (vocab)
  blue:       '#3B82F6',
  blueLight:  '#6ba4f9',
  blueMuted:  'rgba(59,130,246,0.14)',
  blueAlpha06: 'rgba(59,130,246,0.06)',
  blueAlpha18: 'rgba(59,130,246,0.18)',
  blueAlpha20: 'rgba(59,130,246,0.20)',
  blueAlpha24: 'rgba(59,130,246,0.24)',
  blueAlpha30: 'rgba(59,130,246,0.30)',

  // gold (legacy — XP badges, tips)
  gold:      '#F59E0B',
  goldMuted: '#422006',
  goldAlpha06: 'rgba(245,159,11,0.06)',
  goldAlpha22: 'rgba(245,159,11,0.22)',
  goldAlpha30: 'rgba(245,159,11,0.30)',

  // text
  textPrimary:   '#F2F5F2',
  textSecondary: 'rgba(242,245,242,0.60)',
  textTertiary:  'rgba(242,245,242,0.36)',
  textQuaternary:'rgba(242,245,242,0.18)',

  error: '#EF4444',
  errorMuted: 'rgba(239,68,68,0.14)',

  // Card gradient stops (ContinueLearningCard)
  cardGradientStart: '#060F09',
  cardGradientMid:   '#0A1208',
  cardGradientEnd:   '#0D0A18',

  // Black overlays
  overlay05: 'rgba(0,0,0,0.05)',
  overlay35: 'rgba(0,0,0,0.35)',
  overlay50: 'rgba(0,0,0,0.50)',
  overlay82: 'rgba(0,0,0,0.82)',

  // White alphas (on dark surfaces)
  white12:  'rgba(255,255,255,0.12)',
  white13:  'rgba(255,255,255,0.13)',
  white22:  'rgba(255,255,255,0.22)',
  white45:  'rgba(255,255,255,0.45)',
  white58:  'rgba(255,255,255,0.58)',
  shimmer:  'rgba(255,255,255,0.035)',

  // Primary green at various opacities
  primaryAlpha22: 'rgba(29,185,84,0.22)',
  primaryAlpha40: 'rgba(29,185,84,0.40)',
  primaryAlpha85: 'rgba(29,185,84,0.85)',

  // Purple at opacity
  purpleAlpha85: 'rgba(139,92,246,0.85)',

  // Text on primary-coloured backgrounds
  onPrimary: '#040605',

  // Pure white / black utility
  white: '#fff',
  black: '#000',
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
