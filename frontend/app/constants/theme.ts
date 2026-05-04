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
  background: '#0A0A0A',
  card: '#111111',
  primary: '#22C55E',
  primaryMuted: '#052E16',
  purple: '#7C3AED',
  purpleMuted: '#2E1065',
  gold: '#F59E0B',
  goldMuted: '#422006',
  textPrimary: '#FFFFFF',
  textSecondary: '#6B7280',
  error: '#EF4444',
  border: '#222222',
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
