import { StyleSheet, Text, View, Pressable } from 'react-native';

import { AppColors } from '@/constants/theme';

interface Props {
  streak: number;
  onFindPartner: () => void;
}

export function CommunityHeader({ streak, onFindPartner }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Community</Text>
        {streak > 0 && (
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 {streak}</Text>
          </View>
        )}
      </View>

      <View style={styles.promoCard}>
        <View style={styles.promoTop}>
          <Text style={styles.promoTitle}>Practice with a real speaker</Text>
          <Text style={styles.promoBody}>
            Connect with another learner and speak Somali together. Partners earn +20 XP per session and reach fluency 3× faster.
          </Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>+20</Text>
            <Text style={styles.statLabel}>XP / session</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3×</Text>
            <Text style={styles.statLabel}>faster fluency</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>Live</Text>
            <Text style={styles.statLabel}>conversation</Text>
          </View>
        </View>
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          onPress={onFindPartner}
        >
          <Text style={styles.ctaText}>Find a Partner →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: AppColors.textPrimary,
    letterSpacing: -0.5,
  },
  streakBadge: {
    backgroundColor: AppColors.goldMuted,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: AppColors.goldAlpha22,
  },
  streakText: {
    color: AppColors.gold,
    fontWeight: '700',
    fontSize: 13,
  },
  promoCard: {
    backgroundColor: AppColors.surface1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 16,
    gap: 14,
  },
  promoTop: {
    gap: 6,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textPrimary,
    letterSpacing: -0.2,
  },
  promoBody: {
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 19,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface2,
    borderRadius: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    color: AppColors.primary,
  },
  statLabel: {
    fontSize: 10,
    color: AppColors.textTertiary,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: AppColors.border,
  },
  cta: {
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  ctaPressed: {
    opacity: 0.85,
  },
  ctaText: {
    color: AppColors.onPrimary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
