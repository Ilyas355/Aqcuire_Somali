import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';

interface Props {
  title: string;
  xpReward: number;
  onBack: () => void;
}

export function StoryPlayerHeader({ title, xpReward, onBack }: Props) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backText}>← Stories</Text>
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <View style={styles.xpBadge}>
        <Text style={styles.xpText}>+{xpReward} XP</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
    gap: 10,
  },
  backBtn: {
    paddingVertical: 4,
  },
  backText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    fontWeight: '600',
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.textPrimary,
    textAlign: 'center',
  },
  xpBadge: {
    backgroundColor: AppColors.goldMuted,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  xpText: {
    fontSize: 12,
    color: AppColors.gold,
    fontWeight: '700',
  },
});
