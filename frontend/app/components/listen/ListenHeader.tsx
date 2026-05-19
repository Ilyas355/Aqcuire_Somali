import { StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';

interface Props {
  streak: number;
  storyCount: number;
}

export function ListenHeader({ streak, storyCount }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.title}>Listen</Text>
        <Text style={styles.subtitle}>
          {storyCount} {storyCount === 1 ? 'story' : 'stories'} · Real Somali conversations
        </Text>
      </View>
      {streak > 0 && (
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 {streak}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  left: {
    gap: 3,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: AppColors.textSecondary,
  },
  streakBadge: {
    backgroundColor: AppColors.goldMuted,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  streakText: {
    color: AppColors.gold,
    fontWeight: '700',
    fontSize: 14,
  },
});
