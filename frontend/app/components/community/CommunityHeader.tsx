import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
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
        <Text style={styles.promoTitle}>Ready to level up? 🎮</Text>
        <Text style={styles.promoBody}>
          Practice with a real speaker. Earn +20 XP per session — partners make you 3× more likely to finish.
        </Text>
        <Button
          label="Find a Partner"
          variant="secondary"
          size="sm"
          onPress={onFindPartner}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
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
  },
  streakText: {
    color: AppColors.gold,
    fontWeight: '700',
    fontSize: 14,
  },
  promoCard: {
    backgroundColor: AppColors.primaryMuted,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  promoBody: {
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 19,
  },
});
