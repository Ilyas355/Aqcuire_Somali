import { StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';

interface Props {
  sectionTitle: string;
  xpReward: number;
  stepLabel: string;
}

export function LessonHeader({ sectionTitle, xpReward, stepLabel }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.stepLabel}>{stepLabel.toUpperCase()}</Text>
      <View style={styles.row}>
        <Text style={styles.sectionTitle} numberOfLines={1}>{sectionTitle}</Text>
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>+{xpReward} XP</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.primary,
    letterSpacing: 1.2,
    marginBottom: 4,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  xpBadge: {
    backgroundColor: AppColors.goldMuted,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  xpText: {
    color: AppColors.gold,
    fontSize: 12,
    fontWeight: '700',
  },
});
