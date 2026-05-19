import { StyleSheet, View } from 'react-native';

import { AppColors } from '@/constants/theme';

interface ProgressBarProps {
  value: number;
  color?: string;
  height?: number;
}

export function ProgressBar({
  value,
  color = AppColors.primary,
  height = 4,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View style={{ flex: clamped, height, backgroundColor: color, borderRadius: height / 2 }} />
      <View style={{ flex: 100 - clamped }} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: AppColors.border,
    overflow: 'hidden',
    flexDirection: 'row',
  },
});
