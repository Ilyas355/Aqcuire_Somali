import { StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';
import type { UserAchievement } from '@/types/api';

interface Props {
  achievements: UserAchievement[];
}

function AchievementTile({ item }: { item: UserAchievement }) {
  const { achievement } = item;
  const initial = achievement.title[0]?.toUpperCase() ?? '?';

  return (
    <View style={styles.tile}>
      <View style={styles.iconBox}>
        <Text style={styles.iconText}>{initial}</Text>
      </View>
      <Text style={styles.tileLabel} numberOfLines={2}>{achievement.title}</Text>
    </View>
  );
}

export function AchievementsGrid({ achievements }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.groupLabel}>ACHIEVEMENTS</Text>

      {achievements.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🏆</Text>
          <Text style={styles.emptyText}>Complete lessons to earn achievements.</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {achievements.map((item) => (
            <AchievementTile key={item.achievement.key} item={item} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textSecondary,
    letterSpacing: 0.8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    width: '22%',
    alignItems: 'center',
    gap: 6,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: AppColors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  iconText: {
    fontSize: 22,
    fontWeight: '700',
    color: AppColors.primary,
  },
  tileLabel: {
    fontSize: 10,
    color: AppColors.textSecondary,
    textAlign: 'center',
    lineHeight: 13,
  },
  empty: {
    backgroundColor: AppColors.card,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyText: {
    fontSize: 13,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
});
