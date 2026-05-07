import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AppColors } from '@/constants/theme';

interface Props {
  levelName: string | null;
  levelDescription: string | null;
  levelPercentage: number;
  nextLevelName: string | null;
}

export function LevelCard({ levelName, levelDescription, levelPercentage, nextLevelName }: Props) {
  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.sectionLabel}>YOUR LEVEL</Text>
        <Text style={styles.nextLabel}>
          {nextLevelName ? `TO ${nextLevelName.toUpperCase()}` : 'MAX LEVEL'}
        </Text>
      </View>

      <View style={styles.body}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>📚</Text>
        </View>
        <View style={styles.textGroup}>
          <Text style={styles.levelName}>{levelName ?? '—'}</Text>
          {levelDescription ? (
            <Text style={styles.description}>
              {'“'}
              {levelDescription}
              {'”'}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.barRow}>
        <View style={styles.barWrap}>
          <ProgressBar value={levelPercentage} height={6} />
        </View>
        <Text style={styles.percentage}>{levelPercentage}%</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textSecondary,
    letterSpacing: 0.8,
  },
  nextLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.textSecondary,
    letterSpacing: 0.8,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: AppColors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
  },
  textGroup: {
    flex: 1,
    gap: 4,
  },
  levelName: {
    fontSize: 22,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  description: {
    fontSize: 13,
    color: AppColors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  barWrap: {
    flex: 1,
  },
  percentage: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.primary,
    width: 36,
    textAlign: 'right',
  },
});
