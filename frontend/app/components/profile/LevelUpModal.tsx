import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { ProgressBar } from '@/components/ui/ProgressBar';
import { AppColors } from '@/constants/theme';
import type { UserLevel } from '@/types/api';

interface Props {
  visible: boolean;
  level: UserLevel;
  totalXP: number;
  streak: number;
  overallPct: number;
  nextSectionTitle?: string;
  onDismiss: () => void;
  onKeepGoing: () => void;
}

export function LevelUpModal({
  visible,
  level,
  totalXP,
  streak,
  overallPct,
  nextSectionTitle,
  onDismiss,
  onKeepGoing,
}: Props) {
  const { current_level } = level;

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.screen}>
        <Text style={styles.unlockedLabel}>LEVEL UNLOCKED</Text>

        <Text style={styles.trophy}>🏆</Text>

        <Text style={styles.levelName}>{current_level.name}</Text>
        <Text style={styles.subtitle}>⚡ {current_level.subtitle}</Text>

        {current_level.description ? (
          <Text style={styles.description}>"{current_level.description}"</Text>
        ) : null}

        <View style={styles.statsRow}>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>{totalXP.toLocaleString()}</Text>
            <Text style={styles.statLabel}>TOTAL XP</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statTile}>
            <Text style={styles.statValue}>{overallPct}%</Text>
            <Text style={styles.statLabel}>COMPLETE</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statTile}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>DAY STREAK</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <ProgressBar value={level.level_percentage} height={6} />
          <Text style={styles.progressLabel}>{level.level_percentage}% to next level</Text>
        </View>

        <View style={styles.shareCard}>
          <Text style={styles.shareText}>Share your progress</Text>
          <Pressable style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Share 🚀</Text>
          </Pressable>
        </View>

        <Pressable style={styles.keepGoingButton} onPress={onKeepGoing}>
          <Text style={styles.keepGoingText}>
            Keep going{nextSectionTitle ? ` → ${nextSectionTitle}` : ''} →
          </Text>
        </Pressable>

        <Pressable onPress={onDismiss} style={styles.dismissLink}>
          <Text style={styles.dismissText}>Maybe later</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AppColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 16,
  },
  unlockedLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.gold,
    letterSpacing: 1.2,
  },
  trophy: {
    fontSize: 72,
  },
  levelName: {
    fontSize: 36,
    fontWeight: '700',
    color: AppColors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.primary,
  },
  description: {
    fontSize: 14,
    color: AppColors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: AppColors.card,
    borderRadius: 14,
    paddingVertical: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  statTile: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: AppColors.textSecondary,
    letterSpacing: 0.6,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: AppColors.border,
  },
  progressSection: {
    width: '100%',
    gap: 6,
  },
  progressLabel: {
    fontSize: 12,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
  shareCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AppColors.card,
    borderRadius: 14,
    padding: 14,
    width: '100%',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  shareText: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.textPrimary,
  },
  shareButton: {
    backgroundColor: AppColors.primaryMuted,
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  shareButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.primary,
  },
  keepGoingButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  keepGoingText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.background,
  },
  dismissLink: {
    paddingVertical: 8,
  },
  dismissText: {
    fontSize: 13,
    color: AppColors.textSecondary,
  },
});
